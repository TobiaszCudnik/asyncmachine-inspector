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
import * as assert from 'assert'
import { Semaphore } from 'await-semaphore'

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
        patch?: IPatch
      }
    } = {}
    // TODO base on the number of workers *5
    semaphore = new Semaphore(3 * 5)

    constructor(...args: any[]) {
      super(...args)
      // TODO pass a DB name?
      this.db = redis.createClient()
    }

    async dbSet(index: string | number, value: string) {
      assert(typeof value === 'string')
      this.indexes[index] = {
        db_ready: false,
        // theres no diff for the initial sync
        diff_ready: index.toString() === '0'
      }
      await promisify(this.db.set).call(this.db, index.toString(), value)
      this.indexes[index].db_ready = true
      this.emit('db-ready', index)
    }

    generateFullSync() {
      super.generateFullSync()
      // save the initial sync to the DB
      this.dbSet(0, JSON.stringify(this.full_sync))
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
      let json = JSON.stringify(this.differ.generateGraphJSON())
      const index = this.patches_counter
      const logs = [...this.network.logs]
      this.network.logs = []

      // save the json
      // console.log('save json', index)
      await this.dbSet(index, json)
      // dispose
      json = null

      // wait for the prev json to finish being written to the DB
      if (!this.indexes[index - 1].db_ready) {
        // console.log('wait for diff', index - 1)
        await new Promise(resolve => {
          this.on('db-ready', (ready_index: string) => {
            if (ready_index === (index - 1).toString()) {
              resolve()
            }
          })
        })
      }
      // both json (prev and current) are in the DB, ask the worker to diff them
      // console.log('request diff', index)
      let diff: Delta
      const release = await this.semaphore.acquire()
      try {
        // console.log('mainthread diff req', index)
        diff = await this.pool.exec('createDiff', [index])
        // console.log('mainthread diff', diff)
        // console.log('mainthread diff ready', index)
      } catch (e) {
        // TODO handle exceptions and re-send the requests
        //  support process.exit
        console.error('worker error')
        release()
      }
      this.indexes[index].diff_ready = true

      // skip when there's nothing to send
      if (type == PatchType.TRANSITION_STEP && !diff && !logs.length) {
        release()
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
      release()
    }

    /**
     * Emits an list of ordered events containing patches.
     */
    flushOrderedBuffer(index: number) {
      if (index % 1000 === 0) {
        console.log('TRY flushOrderedBuffer', index)
        console.log(this.stats())
      }
      let should_send = false

      for (let i = this.last_sent_index + 1; i <= index; i++) {
        if (!this.indexes[i].diff_ready) {
          // console.log('missing diff', i)
          should_send = false
          break
        }
        should_send = true
      }
      if (!should_send) {
        return
      }

      // emit patches in order
      for (let i = this.last_sent_index + 1; i <= index; i++) {
        // skip the base json
        if (i === 0) {
          continue
        }
        const patch = this.indexes[i - 1].patch
        // sometimes patches are null, skip them in that case
        if (patch) {
          this.emit('diff-sync', patch)
        }
        // dispose
        this.disposeIndex(i - 1)
      }

      this.last_sent_index = index
      if (index % 1000 === 0) {
        console.log('flushOrderedBuffer', index)
        console.log(this.stats())
      }
    }

    disposeIndex(index: number) {
      // remove from the DB
      this.db.del(index.toString())
      // remove from workers cache
      // TODO dispose directly via worker's interface?
      this.db.publish('ami-logger-cache', index.toString())
      // remove from local cache
      delete this.indexes[index]
    }

    stats() {
      const indexes = Object.values(this.indexes)
      const keys = Object.keys(this.indexes)
      return {
        last_sent_index: this.last_sent_index,
        active: indexes.length,
        'no diff': indexes.filter(i => !i.diff_ready).length,
        'no db': indexes.filter(i => !i.db_ready).length,
        last_index: keys[keys.length - 1]
      }
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
