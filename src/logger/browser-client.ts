/**
 * TODO network-to-ui-json should be handled by the server
 */
import Network, { IPatch, ITransitionData, PatchType } from '../network'
import NetworkJson, { JsonDiffFactory, INetworkJson } from '../inspector/joint/network'
import * as EventEmitter from 'eventemitter3'

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
    // TODO too early
    // this.emit('full-sync', this.base_version)

    this.json.network.on('change', (type, machine_id, data) =>
      this.onGraphChange(type, machine_id, data)
    )
  }

  // TODO merge many empty transition-end events into 1
  onGraphChange(type: PatchType, machine_id: string, data?: ITransitionData) {
    let diff = this.diff.generateDiff()
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
    this.packets.push({ ...packet, logs: [...this.network.logs] })
    this.network.logs = []
    this.emit('diff-sync', this.packets[this.packets.length - 1])
  }
}
