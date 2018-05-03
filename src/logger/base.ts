import Network, { IPatch, ITransitionData, PatchType } from '../network/network'
import NetworkJson, { JsonDiffFactory, INetworkJson } from '../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../network/network-json'

export enum Granularity {
  STATES,
  TRANSITIONS,
  STEPS
}

export { Network, LoggerBase }
export interface IOptions {
  // TODO autostart is problematic with inheritance and field inits in TS
  autostart?: boolean
  summary_fn?: (network: Network) => string
  workers?: number
  granularity?: Granularity
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
    this.options = options || {}
    this.json = new NetworkJson(network)
    this.differ = new JsonDiffFactory(this.json)

    if (this.options.summary_fn) {
      this.summary_fn = this.options.summary_fn
    }
    if (this.options.granularity) {
      this.granularity = this.options.granularity
    }
    if (this.options.autostart) {
      this.start()
    }

    this.bindSetState()
  }

  checkGranularity(type) {
    const t = PatchType
    switch (type) {
      case t.TRANSITION_STEP:
      case t.PIPE:
      case t.NEW_MACHINE:
      case t.MACHINE_REMOVED:
      case t.QUEUE_CHANGED:
        if (this.granularity !== Granularity.STEPS) {
          return false
        }
      case t.TRANSITION_END:
      case t.TRANSITION_START:
        if (
          this.granularity !== Granularity.TRANSITIONS &&
          this.granularity !== Granularity.STEPS
        ) {
          return false
        }
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
    this.differ.generateJson()
    this.full_sync = this.differ.previous_json

    this.json.network.on('change', (type, machine_id, data) =>
      this.onGraphChange(type, machine_id, data)
    )
  }

  onGraphChange(type: PatchType, machine_id: string, data?: ITransitionData) {
    if (!this.checkGranularity(type)) return
    const patch = this.createPatch(machine_id, type, data)
    if (!patch) return
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
    this.patches.push(patch)
    return patch
  }
}
