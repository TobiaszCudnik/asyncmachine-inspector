import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { promisify } from 'util'
import * as fs from 'fs'
import * as now from 'performance-now'

const db = redis.createClient()
const sub = redis.createClient()
const stream = fs.createWriteStream('logs/snapshot.json')

process.on('SIGINT', exit)
process.on('exit', exit)

console.log('dispatcher start')

const pool = workerpool.pool(__dirname + '/diff-worker.js')

console.log('pool started')

sub.subscribe('ami-logger-exit')
sub.subscribe('ami-logger-index')
sub.subscribe('ami-logger-write')

let writting = false
let time = now()
let lowest_index = 0
let highest_index = 0
sub.on('message', async function(channel, msg) {
  if (channel == 'ami-logger-exit') {
    exit()
  } else if (channel === 'ami-logger-index') {
    pool.exec('createDiff', [parseInt(msg, 10)])
  } else if (channel === 'ami-logger-write') {
    highest_index = Math.max(highest_index, parseInt(msg, 10))
    if (!writting) {
      writting = true
      await write()
      writting = false
    }
  }
})

/**
 * Emits an list of ordered events containing patches.
 */
async function write() {
  // get the lowest index
  // console.log('write', index)

  if (lowest_index % 100 === 0) {
    // console.log('TRY flushOrderedBuffer', lowest_index)
  }

  // write whatever is ready
  while (true) {
    const ready = await promisify(db.get).call(db, lowest_index + '-ready')
    // console.log('ready', index, ready)
    if (lowest_index === highest_index || !ready || ready === 'null') {
      break
    }
    // console.log('patch read', lowest_index)
    let patch = await promisify(db.get).call(db, lowest_index + '-patch-diff')

    // json start
    if (lowest_index === 0) {
      patch = `{"full_sync": ${await promisify(db.get).call(
        db,
        '0'
      )}, "patches": [`
    }

    if (patch === null) {
      break
    }

    // delimiter
    if (lowest_index > 1) {
      patch = ',' + patch
    }
    // console.log('patch write', lowest_index, patch.length)

    // TODO dont wait? stream directly from redis
    // await promisify(stream.write).call(stream, patch)
    stream.write(patch)
    // stream.uncork()
    disposeIndex(lowest_index)
    // console.log('disposeIndex', index)
    lowest_index++

    if (lowest_index % 1000 === 0) {
      console.log('AFTER flushOrderedBuffer', lowest_index, now() - time)
      time = now()
    }
  }
}

async function exit() {
  console.log('dispatcher dispose')
  await promisify(stream.end).call(stream, ']}')
  pool.terminate()
  process.exit()
}

// dispose completed node
function disposeIndex(index: number) {
  // remove from the DB
  db.del(index + '-patch')
  db.del(index + '-patch-diff')
  db.del(index + '-ready')
  db.del((index - 1).toString())
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
