import Network, { IPatch, ITransitionData, PatchType } from '../network'
import NetworkJson, {
  JsonDiffFactory,
  INetworkJson
} from '../inspector/joint/network'
import * as EventEmitter from 'eventemitter3'
import {JSONSnapshot} from "../network-json"
import * as downloadAsFile from 'download-as-file'
import * as bindKey from 'keymaster'


export default class LoggerLocal extends EventEmitter {
  json: NetworkJson
  differ: JsonDiffFactory
  full_sync: INetworkJson
  patches: IPatch[] = []

  constructor(public network: Network, autostart = true) {
    super()
    this.json = new NetworkJson(network)
    this.differ = new JsonDiffFactory(this.json)

    if (autostart) {
      this.start()
    }
  }

  start() {
    this.differ.generateJson()
    this.full_sync = this.differ.previous_json

    this.json.network.on('change', (type, machine_id, data) =>
      this.onGraphChange(type, machine_id, data)
    )
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
    this.patches.push({ ...packet, logs: [...this.network.logs] })
    this.network.logs = []
    this.emit('diff-sync', this.patches[this.patches.length - 1])
  }

  bindKeyToSnapshotDownload(key: string) {
    // TODO browser check?
    bindKey(key, () => {
      this.downloadSnapshot()
    })
  }

  getSnapshot(): JSONSnapshot {
    return {
      full_sync: this.full_sync,
      patches: this.patches
    }
  }

  downloadSnapshot() {
    // TODO browser check?
    downloadAsFile(JSON.stringify({
      data: this.getSnapshot(),
      // TODO format the date
      filename: `inspector-snapshot-${Date.now()}.json`
    }))
  }
}
