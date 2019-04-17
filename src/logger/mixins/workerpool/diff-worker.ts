import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { GraphNetworkDiffer } from '../../../network/graph-network-differ'
import { promisify } from 'util'
import * as assert from "assert";

const db = redis.createClient()
const sub = redis.createClient()

console.log('worker start')

sub.subscribe('ami-logger-exit')

sub.on('message', function(channel, msg) {
  if (channel == 'ami-logger-exit') {
    process.exit()
  }
})

// @ts-ignore
const differ = new GraphNetworkDiffer({})

async function get(index: number) {
  return await Promise.all([
    promisify(db.get).call(db, index - 1),
    promisify(db.get).call(db, index)
  ])
}

// TODO write directly to the file stream
//  sync via redis
//  dont send back the data at all
//  accept the whole patch in a separate redis cell
async function createDiff(index: number) {
  // console.log('worker diff req', index)
  // get both versions
  const [prev, current] = await get(index)
  // create the diff
  const diff = differ.diffpatcher.diff(prev, current)
  // load the patch data
  const patch = JSON.parse(await promisify(db.get).call(db, index + '-patch'))
  assert(patch, `no patch ${index}`)
  // update the patch JSON
  patch.diff = diff
  await promisify(db.set).call(db, index + '-patch', JSON.stringify(patch))
  // set as ready
  await promisify(db.set).call(db, index + '-ready', true)
  // request a write
  db.publish('ami-logger-write', index.toString())
  // console.log('worker diff', patch)
  // console.log('worker diff ready', index)
}

// create a worker and register functions
workerpool.worker({
  start: () => {
    setInterval(() => {}, 1000)
  },
  createDiff
})
