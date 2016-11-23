import { IDelta } from 'jsondiffpatch'
import * as jsondiffpatch from 'jsondiffpatch'
import {
    INetworkJson,
    TCell
} from './joint-network'
import { EventEmitter } from 'events'
import {
    IPatch,
    PatchType,
    ILogEntry
} from '../network'

export enum Direction {
    FWD,
    BACK
}

export enum StepTypes {
    STEPS,
    TRANSITIONS,
    STATES,
}

/**
 * TODO extract common logic to a super class
 */
class JointDataService extends EventEmitter {
    patches: IPatch[] = [];
    data: INetworkJson | null;
    // 0 mean initial, non-patched data
    protected patch_position = 0;
    /** 0 mean initial, non-patched data */
    position = 0;
    active_transitions = 0;
    /** Did the last scroll add or remove any cells? */
    // TODO binary flags for all of the last scrolls props
    last_scroll_add_remove = false;
    last_scroll_direction: Direction | null = null
    step_type: StepTypes = StepTypes.STATES
    /**
     * Index of patches of a certain type (values map directly to this.patches)*/
    index: {
        states: number[],
        transitions: number[]
    } = {
        states: [],
        transitions: []
    }
    get during_transition(): boolean {
        return Boolean(this.active_transitions)
    }
    get current_patch(): IPatch | null {
        if (!this.patch_position)
            return null
        return this.patches[this.patch_position-1]
    }
    get is_latest() {
        return this.patch_position == this.position_max
    }
    get position_max() {
        const t = StepTypes
        switch (this.step_type) {
            case t.STATES:
                return this.index.states.length
            case t.TRANSITIONS:
                return this.index.transitions.length
            case t.STEPS:
                return this.patches.length
        }
    }
    constructor(data?: INetworkJson) {
        super()
        this.data = data || null
    }
    addPatch(patch: IPatch) {
        if (patch.type == PatchType.STATE ||
                patch.type == PatchType.NEW_MACHINE) {
            this.index.states.push(this.patches.length)
            this.index.transitions.push(this.patches.length)
        }
        // TODO avoid nested transitions
        if (patch.type == PatchType.TRANSITION_END)
            this.index.transitions.push(this.patches.length)

        this.patches.push(patch)
    }
    setStepType(type: StepTypes) {
        let old_step_type = this.step_type
        this.step_type = type
        if (type > old_step_type) {
            // lower granularity (grouping)
            const positions = (type == StepTypes.STATES) ?
                this.index.states : this.index.transitions
            // go back to the prev step
            if (!positions.includes(this.patch_position - 1)) {
                let index = positions.findIndex(
                    position => position+1 > this.position )
                // scroll to one step before the found one
                this.scrollTo(index)
            } else {
                this.position = positions.indexOf(this.patch_position - 1) + 1
            }
        } else if (type < old_step_type) {
            // higher granularity
            if (type == StepTypes.TRANSITIONS) {
                this.position = this.index.transitions
                    .indexOf(this.patch_position - 1) + 1
            } else
                this.position = this.patch_position
        }
    }
    /**
     * Returns all the logs till the current position.
     */
    getLogs(): ILogEntry[][] {
        return this.patches.slice(0, Math.max(0, this.patch_position - 1))
            .map( patch => patch.logs || [] )
    }
    // TODO the reverse param
    scrollOne(reverse = false) {
        if (reverse)
            this.scrollTo(Math.max(this.position - 1, 0))
        else
            this.scrollTo(Math.min(this.position + 1, this.position_max))
    }
    // TODO
    // scrollBy(amount)
    scrollTo(position: number): Set<string> {
        // TODO ensure that the position is not out of range
        if (position == this.position)
            return new Set()
        const t = StepTypes
        let patch_position = position
        switch (this.step_type) {
            case t.STATES:
                patch_position = this.index.states[position - 1] + 1
                break
            case t.TRANSITIONS:
                patch_position = this.index.transitions[position - 1] + 1
                break
        }
        this.position = position
        return this.scrollToPatch(patch_position)
    }
    /**
     * Slides data to specific point (0 == no patches applied).
     * 
     * Returns a list of affected nodes (in their latest form (
     * in the scroll direction)).
     */
    protected scrollToPatch(position: number): Set<string> {
        this.last_scroll_add_remove = false
        let changed = new Set<string>()
		if (position < this.patch_position) {
            this.last_scroll_direction = Direction.BACK
			// go back in time
			for (let i = this.patch_position; i > position; i--) {
                let diff = this.patches[i-1].diff
				if (diff)
                    this.unapplyDiff(diff, changed)
                this.patch_position = i - 1
				this.handleDuringTransition(this.patches[i-1], true)
			}
		} else if (position > this.patch_position) {
            this.last_scroll_direction = Direction.FWD
			// go fwd in time
			for (let i = this.patch_position; i < position; i++) {
                let diff = this.patches[i].diff
				if (diff)
                    this.applyDiff(diff, changed)
                this.patch_position = i + 1
				this.handleDuringTransition(this.patches[i])
			}
		}
        this.emit('scrolled', position, changed)
        return changed
    }
    protected applyDiff(diff, changed: Set<string>): void {
		if (!diff.cells)
			return

		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] != '_')
				continue
            this.handleAddRemove(diff.cells[key])
            changed.add(this.data.cells[key.slice(1)].id)
		}
        jsondiffpatch.patch(this.data, diff)
		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] == '_')
				continue
            this.handleAddRemove(diff.cells[key])
            changed.add(this.data.cells[key].id)
		}
    }
    protected unapplyDiff(diff, changed: Set<string>): void {
		if (!diff.cells)
			return

		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] == '_')
				continue
            this.handleAddRemove(diff.cells[key])
            changed.add(this.data.cells[key].id)
		}
        jsondiffpatch.unpatch(this.data, diff)
		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] != '_')
				continue
            this.handleAddRemove(diff.cells[key])
            changed.add(this.data.cells[key.slice(1)].id)
		}
    }
    protected handleAddRemove(cell) {
        this.last_scroll_add_remove = this.last_scroll_add_remove ||
            Array.isArray(cell) && cell.length !== 2
    }
	// TODO breaks when reversing inside nested active_transitions
	handleDuringTransition(packet, reversed = false) {
        // TODO expose data for messages
		if (packet.type == PatchType.TRANSITION_START)
			this.active_transitions += reversed ? -1 : 1
		else if (packet.type == PatchType.TRANSITION_END)
			this.active_transitions += reversed ? 1 : -1
	}
}

export default JointDataService
