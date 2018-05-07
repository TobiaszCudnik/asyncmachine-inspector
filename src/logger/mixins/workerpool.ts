import * as workerpool from 'workerpool'
import * as randomID from 'simple-random-id'
import { Semaphore } from 'await-semaphore'
import { IOptions, Logger, Granularity, Constructor } from '../logger'
import Network, {
  IPatch,
  ITransitionData,
  PatchType
} from '../../network/network'
import NetworkJson, {
  JsonDiffFactory,
  INetworkJson
} from '../../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../network/network-json'

export { WorkerPoolMixin }

export default function WorkerPoolMixin<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    last_end = -1
    // TODO check if helpful, if yes, get the number from the workerpool module
    differ_semaphore = new Semaphore(this.options.workers || 3)
    pool = workerpool.pool(__dirname + '/workerpool/diff-worker.js')
    sent_map: { id: string; status: boolean }[] = []

    async onGraphChange(
      type: PatchType,
      machine_id: string,
      data?: ITransitionData
    ) {
      if (!this.checkGranularity(type)) return
      const id = randomID()
      let prev = this.differ.previous_json
      let json = this.differ.generateJson()
      debugger
      const pos = this.sent_map.push({ id, status: false }) - 1
      const logs = [...this.network.logs]
      this.network.logs = []

      const release = await this.differ_semaphore.acquire()
      try {
        let diff = await this.pool.exec('createDiffSync', [prev, json, pos])
        prev = null
        json = null
        // console.timeEnd(id)
        let packet: IPatch = {
          logs,
          diff,
          type,
          machine_id
        }
        if (data) packet.data = data
        // delete this.jsons[pos].json
        this.sent_map[pos].status = true
        this.patches[pos] = packet
        this.flushOrderedBuffer(pos)
      } catch (e) {
        throw e
      } finally {
        release()
      }
    }

    // TODO dispose older jsons
    flushOrderedBuffer(pos) {
      // console.log('flushOrderedBuffer', pos)
      let send = 1
      let i
      for (i = this.last_end + 1; i <= pos; i++) {
        if (!this.sent_map[i].status) {
          send = 0
          break
        }
        send = 1
      }
      if (!send) return
      let flushed = 0
      for (i = this.last_end + 1; i <= pos; i++) {
        if (this.patches[i - 1]) {
          this.emit('diff-sync', this.patches[i - 1])
          flushed++
        }
      }
      this.last_end = pos
    }
  }
}
