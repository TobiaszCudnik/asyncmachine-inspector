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

const network = {
  json: null,
  generateGraphJSON() {
    return this.json
  }
}
// @ts-ignore
const differ = new GraphNetworkDiffer(network)

function disposeNode(index: string) {
  delete cache[index]
}

async function createDiff(index: number) {
  const [prev, current] = await Promise.all([
    // prev
    new Promise(async resolve => {
      if (cache[index - 1]) {
        return resolve(cache[index - 1])
      }
      resolve(await db.get((index - 1).toString()))
    }),
    // current
    db.get((index - 1).toString())
  ])

  differ.previous_json = prev
  network.json = current
  return differ.generateGraphPatch()
}

// create a worker and register functions
workerpool.worker({
  createDiff
})
