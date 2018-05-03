import Network, { IPatch, ITransitionData, PatchType } from '../network/network'
import NetworkJson, { JsonDiffFactory, INetworkJson } from '../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../network/network-json'
import * as downloadAsFile from 'download-as-file'
import * as bindKey from 'keymaster'
import { IOptions } from './base'

export { Network, Logger }

// TODO default options.autostart should be true
export default class Logger extends EventEmitter {
  json: NetworkJson
  differ: JsonDiffFactory
  full_sync: INetworkJson
  patches: IPatch[] = []
  summary_fn?: (network: Network) => string
  is_started = false

  get snapshot(): JSONSnapshot {
    return {
      full_sync: this.full_sync,
      patches: this.patches
    }
  }

  // TODO inherit from ./base OR extract the options logic
  constructor(public network: Network, public options: IOptions = null) {
    super()
    this.json = new NetworkJson(network)
    this.differ = new JsonDiffFactory(this.json)

    if (options.autostart) {
      this.start()
    }

    if (this.options.summary_fn) {
      this.summary_fn = this.options.summary_fn
    }
    this.bindSetState()
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
    if (this.is_started) return
    this.differ.generateJson()
    this.full_sync = this.differ.previous_json

    this.json.network.on('change', (type, machine_id, data) =>
      this.onGraphChange(type, machine_id, data)
    )
    this.is_started = true
  }

  onGraphChange(type: PatchType, machine_id: string, data?: ITransitionData) {
    let diff = this.differ.generateDiff()
    let packet: IPatch = {
      diff,
      type,
      machine_id
    }
    if (data) packet.data = data
    // skip empty steps
    if (
      type == PatchType.TRANSITION_STEP &&
      !diff &&
      !this.network.logs.length
    ) {
      return
    }
    if (this.summary_fn) {
      // TODO use jsdiff
      packet.summary = this.summary_fn(this.network)
    }
    this.patches.push({ ...packet, logs: [...this.network.logs] })
    this.network.logs = []
    this.emit('diff-sync', this.patches[this.patches.length - 1])
  }

  bindKeyToSnapshotDownload(key: string) {
    bindKey(key, () => {
      this.downloadSnapshot()
    })
  }

  downloadSnapshot() {
    // TODO browser check?
    downloadAsFile(
      JSON.stringify({
        data: this.snapshot,
        // TODO format the date
        filename: `inspector-snapshot-${Date.now()}.json`
      })
    )
  }
}
