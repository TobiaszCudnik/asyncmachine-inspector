import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { GraphNetworkDiffer } from '../../../network/graph-network-differ'

const cache = {}
const db = redis.createClient()
const sub = redis.createClient()
sub.subscribe('ami-logger-cache')
sub.subscribe('ami-logger')
sub.on('message', function(channel, msg) {
  if (channel == 'ami-logger-cache') {
    disposeNode(msg)
  } else if (channel == 'ami-logger-cache' && msg == 'exit') {
    process.exit()
  }
})

// @ts-ignore
const differ = new GraphNetworkDiffer({})

function disposeNode(index: string) {
  delete cache[index]
}

async function getJSON(index: number) {
  return new Promise(async resolve => {
    if (cache[index]) {
      resolve(cache[index])
    } else {
      await db.get(index.toString(), (err, json) => {
        // save the cache
        cache[index] = json
        // resolve
        resolve(json)
      })
    }
  })
}

async function createDiff(index: number) {
  // console.log('worker diff req', index)
  const [prev, current] = await Promise.all([
    // prev
    getJSON(index - 1),
    // current
    getJSON(index)
  ])
  const patch = differ.diffpatcher.diff(prev, current)
  // console.log('worker diff', patch)
  // console.log('worker diff ready', index)
  // TODO try to save directly to the stream and bypass the main thread
  return patch
}

// create a worker and register functions
workerpool.worker({
  createDiff
})
