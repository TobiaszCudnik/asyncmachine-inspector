import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { promisify } from 'util'
import * as fs from 'fs'

const db = redis.createClient()
const sub = redis.createClient()
const stream = fs.createWriteStream('logs/snapshot.json')

process.on('SIGINT', exit)
process.on('exit', exit)

console.log('dispatcher start')

const pool = workerpool.pool(__dirname + '/diff-worker.js', {})

console.log('pool started')

sub.subscribe('ami-logger-exit')
sub.subscribe('ami-logger-index')
sub.subscribe('ami-logger-write')

let writting = false
let lowest_index = 0
sub.on('message', async function(channel, msg) {
  if (channel == 'ami-logger-exit') {
    exit()
  } else if (channel === 'ami-logger-index') {
    pool.exec('createDiff', [parseInt(msg, 10)])
  } else if (channel === 'ami-logger-write') {
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
    if (!ready) {
      break
    }
    let patch = await promisify(db.get).call(db, lowest_index + '-patch')

    // json start
    if (!patch || patch === 'null') {
      patch = `{"full_sync": ${await promisify(db.get).call(
        db,
        '0'
      )}, "patches": [`
    }

    // delimiter
    if (lowest_index > 1) {
      patch = ',' + patch
    }

    await promisify(stream.write).call(stream, patch)
    stream.uncork()
    disposeIndex(lowest_index)
    // console.log('disposeIndex', index)
    lowest_index++

    if (lowest_index % 100 === 0) {
      // console.log('AFTER flushOrderedBuffer', lowest_index)
    }
  }
}

async function exit() {
  console.log('dispatcher dispose')
  await promisify(stream.end).call(stream, ']}')
  process.exit()
}

// dispose completed node
function disposeIndex(index: number) {
  // remove from the DB
  db.del(index + '-patch')
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
