/**
 * TODO network-to-ui-json should be handled by the server
 */
import Network, { IPatch, PatchType } from './network'
// import * as io from 'socket.io-client'
// import NetworkJson, {
//     JsonDiffFactory
// } from "./ui/cola-network"
import NetworkJson, { JsonDiffFactory, INetworkJson } from './ui/joint-network'
import * as EventEmitter from 'eventemitter3'
// import NetworkJson, {
//     JsonDiffFactory
// } from "./ui/graphviz-network"
// TODO save as file (download on keystroke & filesystem)
// import * as downloadAsFile from 'download-as-file'
// import * as key from 'keymaster'

type MachineId = string

/**
 * fix d.ts files generation
 * TODO introduce revision hashes
 */
export default class LoggerFile extends EventEmitter {
  json: NetworkJson
  diff: JsonDiffFactory
  base_version: INetworkJson
  packets: IPatch[] = []

  constructor(public network: Network) {
    super()
    console.log(`Logger active`)
    this.json = new NetworkJson(network)
    this.diff = new JsonDiffFactory(this.json)
    this.diff.generateJson()
    this.base_version = this.diff.previous_json
    this.emit('full-sync', this.base_version)

    this.json.network.on('change', (type, machine_id, ...params) =>
      this.onGraphChange(type, machine_id, ...params)
    )
  }

  // TODO merge many empty transition-end events into 1
  onGraphChange(type: PatchType, machine_id, ...params) {
    let diff = this.diff.generateDiff()
    let packet: IPatch = {
      diff,
      type,
      machine_id
    }
    // skip empty steps
    if (
      type == PatchType.TRANSITION_STEP &&
      !diff &&
      !this.network.logs.length
    ) {
      return
    }
    this.packets.push({ ...packet, logs: [...this.network.logs] })
    this.network.logs = []
    this.emit('diff-sync', this.packets[this.packets.length-1])
  }
}
