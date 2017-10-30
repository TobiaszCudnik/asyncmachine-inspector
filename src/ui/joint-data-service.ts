import { IDelta } from 'jsondiffpatch'
import * as jsondiffpatch from 'jsondiffpatch'
import { INetworkJson, TCell } from './joint-network'
import { EventEmitter } from 'events'
import { IPatch, PatchType, ILogEntry } from '../network'
import * as assert from 'assert/'

export enum Direction {
  FWD,
  BACK
}

export enum StepTypes {
  STEPS,
  TRANSITIONS,
  STATES
}

const log = (...args) =>{};
// const log = (...args) => console.log(...args)

/**
 * TODO extract common logic to a super class
 */
class JointDataService extends EventEmitter {
  patches: IPatch[] = [
    { diff: null, type: PatchType.FULL_SYNC, machine_id: null }
  ]
  data: INetworkJson | null
  patch_position = 0
  position = 0
  active_transitions = 0
  /** Did the last scroll add or remove any cells? */
  // TODO binary flags for all of the last scrolls props
  last_scroll_add_remove = false
  last_scroll_direction: Direction | null = null
  step_type: StepTypes = StepTypes.STATES
  /**
     * Index of patches of a certain type (values map directly to this.patches)*/
  index: {
    states: number[]
    transitions: number[]
  } = {
    // `[0]` means initial full sync
    states: [0],
    transitions: [0]
  }
  get during_transition(): boolean {
    return Boolean(this.active_transitions)
  }
  get current_patch(): IPatch | null {
    if (!this.patch_position) return null
    return this.patches[this.patch_position - 1]
  }
  // TODO test
  get is_latest(): boolean {
    const t = StepTypes
    switch (this.step_type) {
      case t.STATES:
      case t.TRANSITIONS:
        return this.position == this.position_max
      case t.STEPS:
        return this.patch_position == this.patches.length
    }
  }
  get position_max() {
    const t = StepTypes
    switch (this.step_type) {
      case t.STATES:
        return this.index.states.length - 1
      case t.TRANSITIONS:
        return Math.max(0, this.index.transitions.length - 1)
      case t.STEPS:
        return Math.max(0, this.patches.length - 1)
    }
  }

  constructor(data?: INetworkJson) {
    super()
    this.data = data || null
  }

  patches_active_transitions = 0

  addPatch(patch: IPatch) {
    // TODO assert integrity somehow
    this.patches_active_transitions +=
      patch.type == PatchType.TRANSITION_START
        ? 1
        : patch.type == PatchType.TRANSITION_END ? -1 : 0
    const prev_patch_state_change =
      this.patches.length &&
      this.patches[this.patches.length - 1].type == PatchType.STATE_CHANGED
    const prev_patch_transition_end =
      this.patches.length &&
      this.patches[this.patches.length - 1].type == PatchType.TRANSITION_END
    if (
      (patch.type == PatchType.TRANSITION_END &&
        !this.patches_active_transitions) ||
      patch.type == PatchType.NEW_MACHINE
    ) {
      // keep states index on the most outer (recent) transition
      // TODO skips only the first nested
      // if (prev_patch_transition_end)
      //   this.index.states[this.index.states.length - 1] = this.patches.length
      // else
      this.index.states.push(this.patches.length)

      // add also the prev step
      if (
        this.index.transitions[this.index.transitions.length - 1] !=
        this.patches.length - 1
      )
        this.index.transitions.push(this.patches.length - 1)
      this.index.transitions.push(this.patches.length)
    }
    // TODO avoid nested transitions
    if (patch.type == PatchType.TRANSITION_END && !prev_patch_state_change)
      this.index.transitions.push(this.patches.length)

    this.patches.push(patch)
  }

  setStepType(type: StepTypes) {
    let old_step_type = this.step_type
    this.step_type = type
    if (type > old_step_type) {
      // lower granularity (grouping)
      const positions =
        type == StepTypes.STATES ? this.index.states : this.index.transitions
      // go back to the prev step
      if (!positions.includes(this.patch_position - 1)) {
        let index = positions.findIndex(
          position => position + 1 > this.position
        )
        // scroll to one step before the found one
        this.scrollTo(index)
      } else {
        this.position = positions.indexOf(this.patch_position - 1) + 1
      }
    } else if (type < old_step_type) {
      // higher granularity
      if (type == StepTypes.TRANSITIONS) {
        this.position =
          this.index.transitions.indexOf(this.patch_position - 1) + 1
      } else this.position = this.patch_position
    }
    // TODO required?
    // if (type == StepTypes.STEPS)
    //   this.active_transitions = 0
  }

  /**
     * Returns all the logs till the current position.
     */
  getLogs(): ILogEntry[][] {
    return this.patches
      .slice(0, Math.max(0, this.patch_position - 1))
      .map(patch => patch.logs || [])
  }

  // TODO the reverse param
  scrollOne(reverse = false) {
    if (reverse) this.scrollTo(Math.max(this.position - 1, 0))
    else this.scrollTo(Math.min(this.position + 1, this.position_max))
  }

  // TODO
  // scrollBy(amount)
  scrollTo(position: number): Set<string> {
    // TODO ensure that the position is not out of range
    if (position == this.position) return new Set()
    this.position = position
    return this.scrollToPatch(this.positionToPatchPosition(position))
  }

  positionToPatchPosition(position: number): number {
    const t = StepTypes
    switch (this.step_type) {
      case t.STATES:
        return this.index.states[position]
      case t.TRANSITIONS:
        return this.index.transitions[position]
    }
    return position
  }

  /**
     * Slides data to specific point (0 == no patches applied).
     * 
     * Returns a list of affected nodes (in their latest form (
     * in the scroll direction)).
     */
  protected scrollToPatch(position: number): Set<string> {
    assert(typeof position == 'number')
    this.last_scroll_add_remove = false
    let changed = new Set<string>()
    if (position < this.patch_position) {
      this.last_scroll_direction = Direction.BACK
      // go back in time
      for (let i = this.patch_position; i > position; i--) {
        let diff = this.patches[i].diff
        if (diff) this.unapplyDiff(diff, changed)
        this.handleDuringTransition(this.patches[i])
      }
    } else if (position > this.patch_position) {
      this.last_scroll_direction = Direction.FWD
      // go fwd in time
      for (let i = this.patch_position + 1; i <= position; i++) {
        let diff = this.patches[i].diff
        if (diff) this.applyDiff(diff, changed)
        this.handleDuringTransition(this.patches[i])
      }
    }
    this.patch_position = position
    this.emit('scrolled', position, changed)
    return changed
  }

  protected applyDiff(diff, changed: Set<string>): void {
    if (!diff.cells) return

    for (let key of Object.keys(diff.cells)) {
      if (key == '_t' || key[0] != '_') continue
      this.handleAddRemove(diff.cells[key])
      if (this.data.cells[key.slice(1)])
        changed.add(this.data.cells[key.slice(1)].id)
    }
    jsondiffpatch.patch(this.data, diff)
    for (let key of Object.keys(diff.cells)) {
      if (key == '_t' || key[0] == '_') continue
      this.handleAddRemove(diff.cells[key])
      if (this.data.cells[key]) changed.add(this.data.cells[key].id)
    }
  }

  protected unapplyDiff(diff, changed: Set<string>): void {
    if (!diff.cells) return

    for (let key of Object.keys(diff.cells)) {
      if (key == '_t' || key[0] == '_') continue
      this.handleAddRemove(diff.cells[key])
      if (this.data.cells[key]) changed.add(this.data.cells[key].id)
    }
    jsondiffpatch.unpatch(this.data, diff)
    for (let key of Object.keys(diff.cells)) {
      if (key == '_t' || key[0] != '_') continue
      this.handleAddRemove(diff.cells[key])
      // TODO handle missing elements when key == '_a'
      if (this.data.cells[key.slice(1)])
        changed.add(this.data.cells[key.slice(1)].id)
    }
  }

  protected handleAddRemove(cell) {
    this.last_scroll_add_remove =
      this.last_scroll_add_remove || (Array.isArray(cell) && cell.length !== 2)
  }

  // TODO breaks when reversing inside nested active_transitions
  handleDuringTransition(packet) {
    // if (this.step_type != StepTypes.STEPS)
    //   return
    // TODO expose data for messages
    const reversed = this.last_scroll_direction == Direction.BACK
    let count = this.active_transitions
    if (packet.type == PatchType.TRANSITION_START) {
      log('transition start', reversed ? -1 : 1)
      this.active_transitions += reversed ? -1 : 1
    } else if (packet.type == PatchType.TRANSITION_END) {
      log('transition end', reversed ? -1 : 1)
      this.active_transitions += reversed ? 1 : -1
    }
    log(
      'this.active_transitions ',
      this.active_transitions - count,
      '==',
      this.active_transitions
    )
  }
}

export default JointDataService
