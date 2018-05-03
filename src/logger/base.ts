import Network, { IPatch, ITransitionData, PatchType } from '../network/network'
import NetworkJson, { JsonDiffFactory, INetworkJson } from '../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../network/network-json'

// TODO outer transitions
export enum Granularity {
  STATES,
  TRANSITIONS,
  STEPS
}

export { Network, LoggerBase }
export interface IOptions {
  summary_fn?: (network: Network) => string
  workers?: number
  granularity?: Granularity
}

export const options_defaults = {
  granularity: Granularity.STEPS
}

export default class LoggerBase extends EventEmitter {
  json: NetworkJson
  differ: JsonDiffFactory
  full_sync: INetworkJson
  patches: IPatch[] = []
  summary_fn?: (network: Network) => string
  options: IOptions = {}
  granularity = this.options.granularity || Granularity.STEPS

  get snapshot(): JSONSnapshot {
    return {
      full_sync: this.full_sync,
      patches: this.patches
    }
  }

  constructor(public network: Network, options: IOptions = null) {
    super()
    this.options = { ...options_defaults, ...options }
    this.json = new NetworkJson(network)
    this.differ = new JsonDiffFactory(this.json)

    if (this.options.summary_fn) {
      this.summary_fn = this.options.summary_fn
    }

    this.bindSetState()
  }

  checkGranularity(type: PatchType): boolean {
    const t = PatchType
    const granularity = this.options.granularity
    if (granularity == Granularity.STATES) {
      switch (type) {
        case t.TRANSITION_STEP:
        case t.PIPE:
        case t.MACHINE_ADDED:
        case t.MACHINE_REMOVED:
        case t.QUEUE_CHANGED:
          return false
        case t.STATE_CHANGED:
        case t.TRANSITION_START:
          // accept state changes only from the outer transition
          return this.network.machines_during_transition.size == 1
        case t.TRANSITION_END:
          // accept state changes only from the outer transition
          return this.network.machines_during_transition.size == 0
      }
    } else if (
      granularity == Granularity.TRANSITIONS &&
      type == t.TRANSITION_STEP
    ) {
      return false
    }
    return true
  }

  // TODO state set mixin
  bindSetState() {
    this.on('state-add', states => {
      // TODO group by machines and add in bulks
      for (const id of states) {
        const [machine_id, name] = id.split(':')
        const node = this.network.getNodeByName(name, machine_id)
        node.machine.add(name)
      }
    })
    this.on('state-drop', states => {
      // TODO group by machines and add in bulks
      for (const id of states) {
        const [machine_id, name] = id.split(':')
        const node = this.network.getNodeByName(name, machine_id)
        node.machine.drop(name)
      }
    })
  }

  start() {
    if (!this.network.machines.size) {
      this.network.on('ready', () => this.generateFullSync())
    } else {
      this.generateFullSync()
    }

    this.json.network.on('change', (type, machine_id, data) =>
      this.onGraphChange(type, machine_id, data)
    )
  }

  protected generateFullSync() {
    this.differ.generateJson()
    this.full_sync = this.differ.previous_json
  }

  onGraphChange(type: PatchType, machine_id: string, data?: ITransitionData) {
    if (!this.checkGranularity(type)) return
    const patch = this.createPatch(machine_id, type, data)
    if (!patch) return
    this.patches.push(patch)
    this.emit('diff-sync', patch)
  }

  createPatch(machine_id, type, data?): IPatch | null {
    const diff = this.differ.generateDiff()
    if (
      type == PatchType.TRANSITION_STEP &&
      !diff &&
      !this.network.logs.length
    ) {
      return null
    }
    let patch: IPatch = {
      diff,
      type,
      machine_id,
      logs: [...this.network.logs]
    }
    if (data) {
      patch.data = data
    }
    if (this.summary_fn) {
      // TODO use jsdiff
      patch.summary = this.summary_fn(this.network)
    }
    this.network.logs = []
    return patch
  }
}
