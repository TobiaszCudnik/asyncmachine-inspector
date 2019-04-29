import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { promisify } from 'util'
import * as fs from 'fs'
// @ts-ignore
import * as now from 'performance-now'
import { isMainThread } from 'worker_threads'
import * as os from 'os'

const db = redis.createClient()
const sub = redis.createClient()
const stream = fs.createWriteStream('logs/snapshot.json')

process.on('SIGINT', exit)
process.on('exit', exit)

console.log('dispatcher start', isMainThread)

const num_workers = os.cpus().length - 1

const pool = workerpool.pool(__dirname + '/diff-worker.js', {
  minWorkers: num_workers,
  maxWorkers: num_workers,
  // @ts-ignore
  nodeWorker: 'thread'
})

console.log('pool started')

sub.subscribe('ami-logger-exit')
sub.subscribe('ami-logger-index')
sub.subscribe('ami-logger-index-worker')
sub.subscribe('ami-logger-write')

let writting = false
let time = now()
let lowest_index = 0
let highest_index = 0
const workers = {}
let last_diff_index = -1
sub.on('message', async function(channel, msg) {
  try {
    if (channel == 'ami-logger-exit') {
      exit()
    } else if (channel === 'ami-logger-index-worker') {
      // update the index for this worker
      const data = JSON.parse(msg)
      workers[data.worker_id] = data.index
      // check if all workers have been initted
      if (Object.keys(workers).length < num_workers) {
        return
      }
      // try to parse
      const lowest_workers = Math.min(...(Object.values(workers) as number[]))
      // TODO throttle
      for (let i = Math.max(last_diff_index, 1); i <= lowest_workers; i++) {
        pool.exec('createDiff', [i])
      }
      last_diff_index = lowest_workers
    } else if (channel === 'ami-logger-write') {
      // TODO move to a dedicated worker
      highest_index = Math.max(highest_index, parseInt(msg, 10))
      if (!writting) {
        writting = true
        await write()
        writting = false
      }
    }
  } catch (e) {
    console.error('worker dispatcher error', e)
  }
})

async function get(key) {
  return promisify(db.get).call(db, key)
}

/**
 * Emits an list of ordered events containing patches.
 */
async function write() {
  // get the lowest index
  // console.log('write', index)

  // if (lowest_index % 100 === 0) {
  //   console.log('TRY flushOrderedBuffer', lowest_index)
  // }

  // write whatever is ready
  while (true) {
    const ready = await promisify(db.get).call(db, lowest_index + '-ready')
    // console.log('ready', lowest_index, ready)
    if (lowest_index === highest_index || !ready || ready === 'null') {
      break
    }

    let patch, to_delete

    if (lowest_index === 0) {
      // FULL SYNC
      const json = await get('full-sync')
      patch = `{"full_sync": ${json}, "patches": [`
    } else {
      // DIFF SYNC
      // console.log('patch read', lowest_index)
      const patch_delete = await Promise.all([
        get(lowest_index + '-patch-diff'),
        get(lowest_index + '-delete')
      ])
      patch = patch_delete[0]
      to_delete = patch_delete[1]

      if (patch === null) {
        break
      }
    }

    // delimiter
    if (lowest_index > 1) {
      stream.write(',')
    }
    // console.log('patch write', lowest_index, patch.length)

    // await promisify(stream.write).call(stream, patch)
    stream.write(patch)
    // stream.uncork()
    disposeIndex(lowest_index, to_delete ? JSON.parse(to_delete) : null)
    // console.log('disposeIndex', index)
    lowest_index++

    // if (lowest_index % 1000 === 0) {
    //   console.log('AFTER flushOrderedBuffer', lowest_index, now() - time)
    //   time = now()
    // }
  }
}

async function exit() {
  console.log('dispatcher dispose')
  await promisify(stream.end).call(stream, ']}')
  pool.terminate()
  process.exit()
}

// dispose completed node
function disposeIndex(index: number, to_delete: string[] = []) {
  // if (index % 1000 === 0) {
    // console.log('dispose', index)
  // }
  // remove from the DB
  db.del(index + '-patch')
  db.del(index + '-patch-diff')
  db.del(index + '-ready')
  db.del(index + '-delete')
  db.del((index - 1).toString())
  // dispose all the node caches, in all workers
  if (to_delete) {
    for (const id of to_delete) {
      db.del(id)
      db.publish('ami-logger-dispose', id)
    }
  }
  // dispose the index from redis
  db.publish('ami-logger-dispose-json', index.toString())
}

// create a worker and register functions
workerpool.worker({
  // start: () => {
  //
  // },
  // createDiff
})
setInterval(() => {
  // console.log('alive')
}, 1000)
