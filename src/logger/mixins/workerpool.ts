/**
 * This mixin spreads diff computations across a workerpool with shared memory
 * and local per node caching. To achieve this, the node change detection needs
 * to function well, which is currently not the case, thus using this mixin
 * brings performance down, instead of boosting it.
 *
 * See /src/network/json/joint.ts - getCachedNode() method
 */
import * as workerpool from 'workerpool'
import * as randomID from 'simple-random-id'
import { Semaphore } from 'await-semaphore'
import { IOptions, Logger, Granularity, Constructor } from '../logger'
import Network, {
  IPatch,
  ITransitionData,
  PatchType
} from '../../network/network'
import NetworkJson, { JsonDiffFactory, INetworkJson } from '../../network/json/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../network/json'
import * as redis from 'redis'

export { WorkerPoolMixin }

function removeArrayEl(arr, val) {
  arr.splice(arr.indexOf(val), 1)
}

const db = redis.createClient()
export default function WorkerPoolMixin<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    last_end = -1
    pool = workerpool.pool(__dirname + '/workerpool/diff-worker.js')
    sent_index: {
      id: string
      status: boolean
      version_ids: string[][]
      missing_ids?: string[]
    }[] = []
    redis_index = []

    constructor(...args: any[]) {
      super(...args)
      const during_save = []
      this.network.on('node-change', (id: string, index: number) => {
        // TODO jointjs related code
        const node = this.json.json.cells[index]
        const vid = `${id}:${node.version}`
        // console.log(`save ${vid}`)
        // TODO make it race safe - finish all sets before generating the patch
        if (during_save.includes(vid) || this.redis_index.includes(vid)) {
          return
        }
        during_save.push(vid)
        db.set(vid, JSON.stringify(node), () => {
          removeArrayEl(during_save, vid)
          this.redis_index.push(vid)
          this.emit('node-change-saved', vid)
        })
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
          version_ids: json_ids_struct,
          missing_ids: null
        }) - 1
      const logs = [...this.network.logs]
      this.network.logs = []

      // all the required IDs should be asserted before calling the worker
      // console.log('WAIT', id, this.redis_index.length)
      await new Promise(resolve => {
        this.sent_index.missing_ids = json_ids.filter(
          id => !this.redis_index.includes(id)
        )
        const missing_ids = this.sent_index.missing_ids
        const listener = vid => {
          if (missing_ids.includes(vid)) {
            removeArrayEl(missing_ids, vid)
          }
          if (missing_ids.length == 0) {
            this.removeListener('node-change-saved', listener)
            resolve()
          }
        }
        this.on('node-change-saved', listener)
      })
      // console.log('START', id, this.redis_index.length)
      const diff = await this.pool.exec('createDiff', [prev_ids, json_ids])
      // console.log('DONE', this.redis_index.length)
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

    flushOrderedBuffer(pos) {
      // console.log('try - flushOrderedBuffer', pos)
      let send = 1
      let i
      for (i = this.last_end + 1; i <= pos; i++) {
        if (!this.sent_index[i].status) {
          // console.log('not ready yet', i, this.sent_index[i].missing_ids)
          send = 0
          break
        }
        send = 1
      }
      if (!send) return
      let flushed = 0
      for (i = this.last_end + 1; i <= pos; i++) {
        if (!this.patches[i - 1]) continue
        this.emit('diff-sync', this.patches[i - 1], i - 1)
        flushed++
        // dispose all IDs older than than the ones used to create
        // the patch which just got flushed
        for (const [id, ver] of this.sent_index[i - 1].version_ids) {
          if (ver < 2) continue
          const vid = `${id}:${ver - 1}`
          if (!this.redis_index.includes(vid)) continue
          // broadcast to all the workers
          db.publish('ami-logger-cache', vid)
          // remove from memory
          removeArrayEl(this.redis_index, vid)
          db.del(vid)
        }
        delete this.sent_index[i - 1]
      }
      this.last_end = pos
      // console.log('flushOrderedBuffer', pos)
    }

    async dispose() {
      super.dispose()
      db.publish('ami-logger', 'exit')
    }
  }
}
