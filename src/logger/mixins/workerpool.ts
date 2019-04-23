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
    // TODO move to dispatcher and throttle
    // semaphore = new Semaphore(3 * 5)
    dispatcher: Worker

    constructor(...args: any[]) {
      super(...args)
      // TODO pass a DB name?
      this.db = redis.createClient()

      // TODO check why not in htop
      // this.dispatcher = new Worker(__dirname + '/workerpool/dispatcher.js')
    }

    async dbSet(key: string | number, value: string) {
      return await promisify(this.db.set).call(this.db, key.toString(), value)
    }

    empty_indexes = 0
    async saveNode(index: string | number, json, patch: IPatch) {
      // DEBUG
      if (
        json ===
        '{"nodes":{"add": [], "remove": []}, "links": {"add": [], "remove": []}}'
      ) {
        this.empty_indexes++
        if (this.empty_indexes && this.empty_indexes % 1000 === 0) {
          console.log('empty_indexes', this.empty_indexes)
        }
        // TODO avoid empty indexes
        json = ''
      }

      await Promise.all([
        json && this.dbSet(index + '-index', json) || null,
        patch && this.dbSet(index + '-patch', JSON.stringify(patch)) || null,
        // this blocks the workers from parsing this node
        this.dbSet(index + '-ready', '1')
      ])

      // DEBUG
      // if (parseInt(index, 10) % 1000 === 0) {
      //   console.log('dbset', index)
      // }
    }

    async generateFullSync() {
      const [to_save, _, json] = this.differ.generateGraphDiff()

      // save the diff parts
      const promises = to_save.map(async data => {
        // console.log('saving cache', data)
        await this.dbSet('cache-' + data[0], data[1])
      })

      // save the initial sync to the DB
      const save = this.saveNode('0', json, null)

      // wait for all to complete
      await Promise.all([...promises, save])
      // emit
      this.db.publish('ami-logger-index', '0')
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
      const index = this.patches_counter
      const logs = [...this.network.logs]
      this.network.logs = []

      // TODO batch cache_nodes
      // this.differ.on('cache-node', cache_node)
      // console.log('json start', index)
      let [to_save, to_delete, json] = await this.differ.generateGraphDiff()
      // console.log('json.length', index, json.length)
      if (json.length > 5000) {
        console.log(json)
        process.exit()
      }
      // TODO jump to the next tick?
      // TODO barch by 50
      // TODO dispose after Promises dispatched
      // save the cache
      const promises = to_save.map(async data => {
        await this.dbSet('cache-' + data[0], data[1])
      })
      if (to_delete) {
        promises.push(this.dbSet(index + '-delete', JSON.stringify(to_delete)))
      }
      // console.log('saved', index)

      let patch: IPatch = {
        id: index,
        logs,
        type,
        machine_id
      }

      // console.log(json)
      // save the json
      // console.log('json.length', json.length)
      promises.push(this.saveNode(index, json, patch))
      // dispose TODO new ones
      this.differ.previous_json = null
      json = null
      patch = null

      // wait for everything to save
      await Promise.all(promises)

      // if (index % 1000 === 0) {
      //   console.log('req', index)
      // }

      // TODO throttle with a tail
      this.db.publish('ami-logger-index', index.toString())
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
