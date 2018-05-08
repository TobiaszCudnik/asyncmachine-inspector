import * as workerpool from 'workerpool'
import * as randomID from 'simple-random-id'
import { Semaphore } from 'await-semaphore'
import { IOptions, Logger, Granularity, Constructor } from '../logger'
import Network, {
  IPatch,
  ITransitionData,
  PatchType
} from '../../network/network'
import NetworkJson, { JsonDiffFactory, INetworkJson } from '../../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../network/network-json'
import * as redis from 'redis'
import * as os from 'os'

export { WorkerPoolMixin }

const db = redis.createClient()
export default function WorkerPoolMixin<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    last_end = -1
    pool = workerpool.pool(__dirname + '/workerpool/diff-worker.js')
    sent_index: { id: string; status: boolean }[] = []

    constructor(...args: any[]) {
      super(...args)
      this.network.on('node-change', (id: string, index: number) => {
        // TODO jointjs related code
        const node = this.json.json.cells[index]
        // TODO make it race safe - finish all sets before generating the patch
        db.set(`${id}:${node.version}`, JSON.stringify(node))
      })
    }

    async onGraphChange(
      type: PatchType,
      machine_id: string,
      data?: ITransitionData
    ) {
      if (!this.checkGranularity(type)) return

      let prev_ids = this.differ.previous_json.cells.map(
        node => `${node.id}:${node.version}`
      )
      let json_ids = this.differ
        .generateJson()
        .cells.map(node => `${node.id}:${node.version}`)

      const id = randomID()
      const pos = this.sent_index.push({ id, status: false }) - 1
      const logs = [...this.network.logs]
      this.network.logs = []

      let diff = await this.pool.exec('createDiff', [prev_ids, json_ids, pos])
      // console.timeEnd(id)
      let packet: IPatch = {
        logs,
        diff,
        type,
        machine_id
      }
      if (data) packet.data = data
      // delete this.jsons[pos].json
      this.sent_index[pos].status = true
      this.patches[pos] = packet
      this.flushOrderedBuffer(pos)
    }

    // TODO dispose older sent_indexes
    // TODO dispose older redis entries
    flushOrderedBuffer(pos) {
      // console.log('flushOrderedBuffer', pos)
      let send = 1
      let i
      for (i = this.last_end + 1; i <= pos; i++) {
        if (!this.sent_index[i].status) {
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
