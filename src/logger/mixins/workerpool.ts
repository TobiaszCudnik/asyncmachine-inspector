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

export { WorkerPoolMixin }

const db = redis.createClient()
export default function WorkerPoolMixin<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    last_end = -1
    pool = workerpool.pool(__dirname + '/workerpool/diff-worker.js')
    sent_index: { id: string; status: boolean; version_ids: string[][] }[] = []

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

      const prev_ids = this.differ.previous_json.cells.map(
        node => `${node.id}:${node.version}`
      )
      let cells = this.differ.generateJson().cells
      const json_ids = cells.map(node => `${node.id}:${node.version}`)
      const json_ids_struct = cells.map(node => [
        node.id,
        node.version.toString()
      ])

      const id = randomID()
      const pos =
        this.sent_index.push({
          id,
          status: false,
          version_ids: json_ids_struct
        }) - 1
      const logs = [...this.network.logs]
      this.network.logs = []

      // TODO race condition with node-change listener - all the required IDs
      // should be asserted before calling the worker
      let diff = await this.pool.exec('createDiff', [prev_ids, json_ids, pos])
      // console.timeEnd(id)
      let packet: IPatch = {
        logs,
        diff,
        type,
        machine_id
      }
      const is_transaction = [
        PatchType.TRANSITION_START,
        PatchType.TRANSITION_END
      ].includes(type)
      if (is_transaction && data) {
        packet.data = data
      }
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
          this.emit('diff-sync', this.patches[i - 1], i - 1)
          flushed++
          // dispose all IDs older than than the ones used to create
          // the patch which just got flushed
          for (const [id, ver] of this.sent_index[i - 1].version_ids) {
            if (ver < 2) continue
            // TODO keep the map of all of the redis entries?
            // console.log(`DISPOSED ${id}:${ver - 1}`)
            db.del(`${id}:${ver - 1}`)
            // TODO broadcast to ALL the worksers to clear the local cache
            // but dont wait for the result
          }
          if (this.sent_index[i - 2]) {
            delete this.sent_index[i - 2]
          }
        }
      }
      this.last_end = pos
    }
  }
}
