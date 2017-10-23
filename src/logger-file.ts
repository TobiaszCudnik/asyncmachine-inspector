/**
 * TODO network-to-ui-json should be handled by the server
 */
import Network, { PatchType } from './network'
// import * as io from 'socket.io-client'
// import NetworkJson, {
//     JsonDiffFactory
// } from "./ui/cola-network"
import NetworkJson, { JsonDiffFactory, INetworkJson } from './ui/joint-network'
// import NetworkJson, {
//     JsonDiffFactory
// } from "./ui/graphviz-network"
// TODO save as file (download on keystroke & filesystem)
// import * as downloadAsFile from 'download-as-file'
// import * as key from 'keymaster'

type MachineId = string

/**
 * TODO rename to LoggerClient
 * fix d.ts files generation
 * TODO introduce revision hashes
 */
export default class LoggerFile {
  json: NetworkJson
  diff: JsonDiffFactory
  base_version: INetworkJson
  packets = []

  constructor(public network: Network, public serverHost) {
    console.log(`Logger active`)
    this.diff.generateJson()
    this.base_version = this.diff.previous_json

    this.json.network.on('change', (type, machine_id, ...params) =>
      this.onGraphChange(type, machine_id, ...params)
    )
  }

  // TODO merge many empty transition-end events into 1
  onGraphChange(type: PatchType, machine_id, ...params) {
    let diff = this.diff.generateDiff()
    let packet = {
      diff,
      type,
      machine_id,
      logs: this.network.logs
    }
    // skip empty steps
    if (
      type == PatchType.TRANSITION_STEP &&
      !diff &&
      !this.network.logs.length
    ) {
      return
    }
    this.packets.push({ packet, logs: [...this.network.logs] })
    this.network.logs = []
  }
}
