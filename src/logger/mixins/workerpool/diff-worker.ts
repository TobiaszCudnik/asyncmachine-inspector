import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { GraphNetworkDiffer } from '../../../network/graph-network-differ'
import { promisify } from 'util'
import * as assert from 'assert'

const db = redis.createClient()
const sub = redis.createClient()

console.log('worker start')

sub.subscribe('ami-logger-exit')
sub.subscribe('ami-logger-dispose')

sub.on('message', function(channel: string, msg: string) {
  if (channel == 'ami-logger-exit') {
    process.exit()
  } else if (channel == 'ami-logger-dispose') {
    delete cache[msg]
  }
})

// @ts-ignore
const differ = new GraphNetworkDiffer({})
const cache = {}

async function get(key) {
  return promisify(db.get).call(db, key)
}

async function set(key, value) {
  return promisify(db.set).call(db, key, value)
}

async function fetch_versions(index: number) {
  return await Promise.all([get(index - 1), get(index)])
}

// TODO write directly to the file stream
//  sync via redis
//  dont send back the data at all
//  accept the whole patch in a separate redis cell
async function createDiff(index: number) {
  // console.log('worker diff req', index)
  // get both versions
  const [prev, current] = await fetch_versions(index)
  assert(prev, 'no graph json in redis')
  assert(current, 'no graph json in redis')
  /**
   * joins all the parts from redis
   * TODO use local cache
   * TODO merge
   */
  async function load_caches(list) {
    const ret = {}
    list.map(async id => {
      // cache
      if (cache[id]) {
        ret[id] = cache[id]
        return
      }
      // no cache
      const json: string = await new Promise(resolve => {
        // console.log('get part', key)
        // get a part's ret
        db.get(index + ':' + id, (err, json) => {
          resolve(json)
        })
      })
      cache[id] = JSON.parse(json)
      ret[id] = cache[id]
    })
    return ret
  }
  async function parse_json(json) {
    await Promise.all([load_caches(json.nodes), load_caches(json.links)])
  }
  // console.log('reading', index)
  // create the diff
  let diff, prev2, current2
  try {
    prev2 = JSON.parse(prev)
  } catch (e) {
    console.error('json prev failed', e)
    console.log(prev)
    process.exit()
  }
  try {
    current2 = JSON.parse(current)
  } catch (e) {
    console.error('json current failed', e)
    // console.log(current)
    process.exit()
  }
  let [patch, prev3, current3] = await Promise.all([
    get(index + '-patch'),
    parse_json(prev2),
    parse_json(current2)
  ])
  prev2 = null
  current2 = null
  // TODO dispose
  diff = differ.diffpatcher.diff(prev3, current3)
  assert(patch, `no patch ${index}`)
  prev3 = null
  current3 = null
  differ.previous_json = null
  patch = patch.slice(0, -1) + `,"diff": ${JSON.stringify(diff)}}`
  await set(index + '-patch-diff', patch)
  // console.log('patch saved', index, data.length)
  // set as ready
  await set(index + '-ready', true)
  // console.log('ready saved', index)
  // request a write
  // TODO throttle
  db.publish('ami-logger-write', index.toString())
  if (index % 1000 === 0) {
    console.log('AFTER createDiff', index)
  }
  // console.log('worker diff', patch)
  // console.log('worker diff ready', index)
}

// create a worker and register functions
workerpool.worker({
  start: () => {
    setInterval(() => {}, 1000)
  },
  async createDiff(index) {
    try {
      await createDiff(index)
    } catch (e) {
      console.error('worker differ error', e)
    }
  }
})
