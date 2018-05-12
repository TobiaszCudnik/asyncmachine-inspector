import Network, { IPatch, ITransitionData, PatchType } from '../network/network'
import NetworkJson, { JsonDiffFactory, INetworkJson } from '../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../network/network-json'
import WritableStream = NodeJS.WritableStream

// TODO try to export all required symbols used by the mixins
export enum Granularity {
  STATES,
  TRANSITIONS,
  STEPS
}

export { Network, Logger }
export interface IOptions {
  summary_fn?: (network: Network) => string
  workers?: number
  granularity?: Granularity
  url?: string
  stream?: WritableStream
}

export const options_defaults = {
  granularity: Granularity.STEPS
}

export type Constructor<T = Logger> = new (...args: any[]) => T

export default class Logger extends EventEmitter {
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

  generateFullSync() {
    this.differ.generateJson()
    this.full_sync = this.differ.previous_json
    this.emit('full-sync', this.full_sync)
  }

  onGraphChange(type: PatchType, machine_id: string, data?: ITransitionData) {
    if (!this.checkGranularity(type)) return
    const patch = this.createPatch(machine_id, type, data)
    if (!patch) return
    this.patches.push(patch)
    this.emit('diff-sync', patch, this.patches.length - 1)
  }

  createPatch(machine_id, type, data?): IPatch | null {
    const diff = this.differ.generateDiff()
    // only transition data is useful for the patches
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
    if (is_transaction && data) {
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
