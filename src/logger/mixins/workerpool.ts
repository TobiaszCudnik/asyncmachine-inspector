/**
 * This mixin spreads diff computations across a workerpool with shared memory
 * through redis.
 *
 * TODO use SharedArrayBuffer, support chrome
 */
import * as workerpool from 'workerpool'
import { IPatch, LoggerConstructor } from '../logger'
import { ITransitionData, PatchType } from '../../network/graph-network'
import * as redis from 'redis'
import { RedisClient } from 'redis'
import { promisify } from 'util'
import { Delta } from 'jsondiffpatch'

export { WorkerPoolMixin }

export default function WorkerPoolMixin<TBase extends LoggerConstructor>(
  Base: TBase
) {
  /**
   * Sub class of a passed Logger constructor.
   */
  return class extends Base {
    db: RedisClient
    last_sent_index = -1
    pool = workerpool.pool(__dirname + '/workerpool/diff-worker.js')
    indexes: {
      [index: string]: {
        db_ready: boolean
        diff_ready: boolean
        sent: boolean
        patch?: IPatch
      }
    } = {}

    constructor(...args: any[]) {
      super(...args)
      // TODO pass a DB name?
      this.db = redis.createClient()
    }

    async dbSet(index: string | number, value: string) {
      this.indexes[index] = {
        db_ready: false,
        diff_ready: false,
        sent: false
      }
      await promisify(this.db.set).call(this.db, index.toString(), value)
      this.indexes[index].db_ready = true
      this.emit('db-ready', index)
    }

    generateFullSync() {
      super.generateFullSync()
      // save the initial sync to the DB
      this.dbSet(0, this.full_sync)
    }

    /**
     * TODO Share as much logic with the super class as possible.
     */
    async onGraphChange(
      type: PatchType,
      machine_id: string,
      data?: ITransitionData
    ) {
      if (!this.checkGranularity(type)) {
        return
      }

      this.patches_counter++
      const json = JSON.stringify(this.differ.generateGraphJSON())
      const index = this.patches_counter
      const logs = [...this.network.logs]
      this.network.logs = []

      // save the json
      await this.dbSet(index, json)

      // wait for the prev json to finish being written to the DB
      if (!this.indexes[index - 1].db_ready) {
        await new Promise(resolve => {
          this.on('db-ready', (ready_index: string) => {
            if (ready_index === (index - 1).toString()) {
              resolve()
            }
          })
        })
      }
      // both json (prev and current) are in the DB, ask the worker to diff them
      const diff: Delta = await this.pool.exec('createDiff', index)
      this.indexes[index].diff_ready = true

      // skip when there's nothing to send
      if (type == PatchType.TRANSITION_STEP && !diff && !logs.length) {
        return null
      }

      let patch: IPatch = {
        id: index,
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
        patch.data = data
      }

      this.indexes[index].patch = patch
      this.flushOrderedBuffer(index)
    }

    /**
     * Emits an list of ordered events containing patches.
     */
    flushOrderedBuffer(index: number) {
      // console.log('try - flushOrderedBuffer', pos)
      let should_send = false
      for (let i = this.last_sent_index + 1; i <= index; i++) {
        if (!this.indexes[i].diff_ready) {
          // console.log('not ready yet', i, this.sent_index[i].missing_ids)
          should_send = false
          break
        }
        should_send = true
      }
      if (!should_send) {
        return
      }
      for (let i = this.last_sent_index + 1; i <= index; i++) {
        const patch = this.indexes[i - 1].patch
        // sometimes patches are null, skip them in that case
        if (!patch) {
          continue
        }
        this.emit('diff-sync', patch, i - 1)
        // mark as sent
        this.indexes[i - 1].sent = true
      }
      // delete old entries
      for (let i = this.last_sent_index; this.indexes[i]; i--) {
        // remove from the DB
        this.db.del(i.toString())
        // remove from workers cache
        // TODO dispose directly via worker's interface?
        this.db.publish('ami-logger-cache', i.toString())
        // remove from local cache
        delete this.indexes[i]
      }
      this.last_sent_index = index
      // console.log('flushOrderedBuffer', pos)
    }

    async dispose() {
      super.dispose()
      this.db.publish('ami-logger', 'exit')
    }

    createPatch(): IPatch | null {
      throw new Error('Patches should be created by diff workers')
    }
  }
}
