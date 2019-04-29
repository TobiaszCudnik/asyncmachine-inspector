/**
 * This mixin spreads diff computations across a workerpool with shared memory
 * through redis.
 *
 * TODO use SharedArrayBuffer, support chrome
 */
import { IPatch, LoggerConstructor } from '../logger'
import { ITransitionData, PatchType } from '../../network/graph-network'
import * as redis from 'redis'
import { RedisClient } from 'redis'
import { promisify } from 'util'
import * as assert from 'assert'
import { Semaphore } from 'await-semaphore'
import { Worker } from 'worker_threads'
import * as delay from 'delay'

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

    indexes: {
      [index: string]: {
        db_ready: boolean
        diff_ready: boolean
        patch?: IPatch
      }
    } = {}
    // TODO base on the number of workers *5
    semaphore = new Semaphore(3 * 5)
    dispatcher: Worker

    constructor(...args: any[]) {
      super(...args)
      // TODO pass a DB name?
      this.db = redis.createClient()

      this.dispatcher = new Worker(__dirname + '/workerpool/dispatcher.js')

      // this.pool.exec('start')
      // this.pool.exec('start')
      // this.pool.exec('start')
    }

    async dbSet(index: string | number, value: string, patch: IPatch) {
      assert(typeof value === 'string')
      const i = index.toString()
      this.indexes[index] = {
        db_ready: false,
        // theres no diff for the initial sync
        diff_ready: i === '0'
      }
      await Promise.all([
        promisify(this.db.set).call(this.db, i, value),
        promisify(this.db.set).call(
          this.db,
          i + '-patch',
          JSON.stringify(patch)
        ),
        promisify(this.db.set).call(this.db, i + '-ready', '1')
      ])
      // console.log('dbset', index)
      // this.indexes[index].db_ready = true
      // this.emit('db-ready', index)
      // this.db.publish('ami-logger-index', i)
    }

    generateFullSync() {
      super.generateFullSync()
      // save the initial sync to the DB
      this.dbSet('0', JSON.stringify(this.full_sync), null)
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
      // TODO optimize stringify
      let json = this.differ.generateGraphJSON(true)
      const index = this.patches_counter
      const logs = [...this.network.logs]
      this.network.logs = []

      let patch: IPatch = {
        id: index,
        type,
        machine_id
      }

      if (logs.length) {
        patch.logs = logs
      }

      // save the json
      // console.log('save json', index)
      await this.dbSet(index, json, patch)
      // dispose
      this.differ.previous_json = null
      json = null
      patch = null

      if (index % 100 === 0) {
        // console.log('req', index)
      }

      this.db.publish('ami-logger-index', index.toString())
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
      console.log('dispose workerpool')
      this.db.publish('ami-logger-exit', '')
      await delay(500)
    }

    createPatch(): IPatch | null {
      throw new Error('Patches should be created by diff workers')
    }
  }
}
