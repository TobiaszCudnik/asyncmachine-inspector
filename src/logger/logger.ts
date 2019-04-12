import { ILogEntry, ITransitionData, PatchType } from '../network/graph-network'
import * as EventEmitter from 'eventemitter3'
// import { JSONSnapshot } from '../network/json'
import { GraphNetworkDiffer } from '../network/graph-network-differ'
import MachineNetwork from '../network/machine-network'
import WritableStream = NodeJS.WritableStream
import { Delta } from 'jsondiffpatch'

// TODO try to export all required symbols used by the mixins
export enum Granularity {
  STATES,
  TRANSITIONS,
  STEPS
}

export interface IPatch {
  id?: string | number
  type: PatchType
  machine_id: string
  diff: Delta
  logs?: ILogEntry[]
  data?: ITransitionData
  summary?: string
}

export { MachineNetwork, Logger }
export interface IOptions {
  summary_fn?: (network: MachineNetwork) => string
  workers?: number
  granularity?: Granularity
  url?: string
  stream?: WritableStream
}

export type IGraphJson = any

export const options_defaults = {
  granularity: Granularity.STEPS
}

export type Constructor<T = Logger> = new (...args: any[]) => T

export default class Logger extends EventEmitter {
  differ: GraphNetworkDiffer
  full_sync: IGraphJson
  patches: IPatch[] = []
  summary_fn?: (network: MachineNetwork) => string
  options: IOptions = {}
  granularity = this.options.granularity || Granularity.STEPS

  // TODO
  // get snapshot(): JSONSnapshot {
  get snapshot() {
    return {
      full_sync: this.full_sync,
      patches: this.patches
    }
  }

  constructor(public network: MachineNetwork, options: IOptions = null) {
    super()
    this.options = { ...options_defaults, ...options }
    this.differ = new GraphNetworkDiffer(this.network)

    if (this.options.summary_fn) {
      this.summary_fn = this.options.summary_fn
    }
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
          return this.network.machines_during_transition.length == 1
        case t.TRANSITION_END:
          // accept state changes only from the outer transition
          return this.network.machines_during_transition.length == 0
      }
    } else if (
      granularity == Granularity.TRANSITIONS &&
      type == t.TRANSITION_STEP
    ) {
      return false
    }
    return true
  }

  start() {
    if (!this.network.machines.size) {
      this.network.on('ready', () => this.generateFullSync())
    } else {
      this.generateFullSync()
    }

    this.differ.network.on('change', (type, machine_id, data) =>
      this.onGraphChange(type, machine_id, data)
    )
  }

  generateFullSync() {
    this.differ.generateGraphJSON()
    this.full_sync = this.differ.previous_json
    this.emit('full-sync', this.full_sync)
  }

  onGraphChange(type: PatchType, machine_id: string, data?: ITransitionData) {
    if (!this.checkGranularity(type)) {
      return
    }
    const patch = this.createPatch(machine_id, type, data)
    if (!patch) {
      return
    }
    patch.id = this.patches.length
    // TODO remove this along with the /mixins/fs.ts
    this.patches.push(patch)
    this.emit('diff-sync', patch, this.patches.length - 1)
  }

  createPatch(machine_id, type, data?): IPatch | null {
    const diff = this.differ.generateGraphPatch()
    const is_transaction = [
      PatchType.TRANSITION_START,
      PatchType.TRANSITION_END
    ].includes(type)
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
    // only transition data is useful for the patches
    if (is_transaction && data) {
      patch.data = data
    }
    if (this.summary_fn) {
      // TODO use jsondiff
      patch.summary = this.summary_fn(this.network)
    }
    this.network.logs = []
    return patch
  }

  async dispose() {}
}
