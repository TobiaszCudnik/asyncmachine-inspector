import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { GraphNetworkDiffer } from '../../../network/graph-network-differ'
import { promisify } from 'util'
import * as assert from 'assert'
import * as uuid from 'simple-random-id'
import { Fields } from '../../../network/graph-network'
import * as range from 'array-range'

const db = redis.createClient()
const sub = redis.createClient()
const worker_id = uuid()
// keep the fully build jsons (ready for diffing)
const jsons = {}
// keeps index diffs
const diffs = {}
let parsing_json = false
let last_unparsed_index = 0
let last_requested_index = -1

console.log('worker start', worker_id)

sub.subscribe('ami-logger-exit')
sub.subscribe('ami-logger-index-worker')
// sub.subscribe('ami-logger-json')
sub.subscribe('ami-logger-dispose')
sub.subscribe('ami-logger-dispose-json')

sub.on('message', function(channel: string, msg: string) {
  try {
    if (channel == 'ami-logger-exit') {
      process.exit()
    } else if (channel == 'ami-logger-index-worker') {
      // process jsons up till the provided index
      console.log(printStats())
      last_requested_index = parseInt(msg, 10)
      loadJSON(last_requested_index)
    } else if (channel == 'ami-logger-dispose') {
      // if (parseInt(msg, 10) % 1000 === 0) {
      //   console.log('worker dispose', worker_id, msg)
      // }
      delete local_cache[msg]
    } else if (channel == 'ami-logger-dispose-json') {
      // console.log('dispose json', msg, worker_id)
      delete jsons[msg]
      delete diffs[msg]
    }
  } catch (e) {
    console.error('worker differ error', e)
  }
})

function printStats() {
  return {
    last_requested_index,
    last_unparsed_index,
    'local_cache.length': Object.keys(local_cache).length,
    'diffs.length': Object.keys(diffs).length,
    'jsons.length': Object.keys(jsons).length,
    worker_id
  }
}

// @ts-ignore
const differ = new GraphNetworkDiffer({})
const local_cache = {}

async function get(key) {
  return promisify(db.get).call(db, key)
}

async function set(key, value) {
  assert(typeof value !== 'undefined')
  return promisify(db.set).call(db, key, value)
}

async function publish(channel, msg) {
  return promisify(db.publish).call(db, channel, msg)
}

// async function fetch_versions(index: number) {
//   return await Promise.all([get(index - 1 + '-index'), get(index + '-index')])
// }

// TODO write directly to the file stream
//  sync via redis
//  dont send back the data at all
//  accept the whole patch in a separate redis cell
async function createDiff(index: number) {
  // console.log('createDiff', index, worker_id)
  let patch = await get(index + '-patch')
  assert(patch, `patch ${index} missing in redis`)

  // create the actual diff
  // TODO dont jsondiff when an index diff is empty
  // console.log(
  //   'diff',
  //   index,
  //   jsons[index - 1],
  //   jsons[index]
  // )
  assert(jsons[index - 1], `prev json missing ${index - 1} ${worker_id}`)
  assert(jsons[index], `current json missing ${index} ${worker_id}`)
  const diff = differ.diffpatcher.diff(jsons[index - 1], jsons[index])

  // inject into the text patch and save
  // console.log('patch', index, patch)
  if (diff) {
    if (Array.isArray(diff)) {
      console.log('array diff', index)
      console.log('prev', jsons[index - 1])
      console.log('curr', jsons[index])
      process.exit()
    }
    patch = patch.slice(0, -1) + `,"diff": ${JSON.stringify(diff)}}`
  }
  // save as a different field
  await set(index + '-patch-diff', patch)
  // console.log('patch saved', index, data.length)

  // set as ready
  await set(index + '-ready', '1')
  // console.log('ready saved', index)

  // request a write
  // TODO throttle
  await publish('ami-logger-write', index.toString())
  // console.log('SEND ami-logger-write', index, worker_id)

  // DEBUG
  // if (index % 1000 === 0) {
  //   console.log('AFTER createDiff', index)
  // }
  // console.log('worker diff', patch)
  // console.log('worker diff ready', index)
}

async function loadJSON(index) {
  if (parsing_json) {
    return
  }
  // console.log('loadJSON', index, last_unparsed_index)
  parsing_json = true
  // load index diffs
  const promises = range(last_unparsed_index, index + 1).map(async i => {
    // console.log(`get(${i} + '-index')`)
    const patch = await get(i + '-index')
    diffs[i] = (patch && JSON.parse(patch)) || null
  })
  await Promise.all(promises)
  promises.length = 0
  // parse indexes & load cache chunks
  for (let i = last_unparsed_index; i <= index; i++) {
    const diff = diffs[i]
    const prev_json = jsons[i - 1] || { nodes: [], links: [] }
    if (!diff) {
      // console.log('NO diff', i)
      // empty (index) diff
      // TODO mark as no-change to avoid jsondiffing
      jsons[i] = prev_json
      continue
    }
    // console.log('diff', i, diff)
    const load_nodes = mergeList(i, prev_json.nodes, diff.nodes)
    const load_links = mergeList(i, prev_json.links, diff.links)
    // series
    const [nodes, links] = await Promise.all([load_nodes, load_links])
    // set the final json
    jsons[i] = { nodes, links }
    // save the first json as initial full-sync
    if (i === 0) {
      await set('full-sync', JSON.stringify(jsons[0]))
    }
    // console.log(`jsons[${i}]`, Object.keys(jsons[i].nodes).length, worker_id)
  }
  last_unparsed_index = index + 1
  // console.log('last_index', last_unparsed_index)
  assert(jsons[index], 'final json missing')
  // inform the dispatcher that this worker is ready
  db.publish('ami-logger-json', JSON.stringify({ worker_id, index }))
  // release the mutex
  parsing_json = false
}

export type ListDiff = {
  add: (string | number)[]
  remove: (string | number)[]
}

/**
 * joins all the parts from redis
 */
async function mergeList(index: number, prev: {}[], list: ListDiff) {
  // shallow copy the prev json
  const ret = { ...prev }

  // gather IDs to remove (sync)
  const remove_ids = []
  for (const id of list.remove) {
    if (typeof id === 'string') {
      // index range (eg 100-250)
      const range = id.split('-')
      const from = parseInt(range[0], 10)
      const to = parseInt(range[1], 10)

      for (let i = from; i <= to; i++) {
        const cache_entry = getLocalCache(i)
        remove_ids.push(cache_entry.id)
      }
    } else {
      const cache_entry = getLocalCache(id)
      remove_ids.push(cache_entry.id)
    }
  }
  // remove from the copy of the prev json
  for (const id of remove_ids) {
    delete ret[id]
  }
  // console.log('list.add', index, list.add)
  // add the new IDs
  await Promise.all(
    list.add.map(async id => {
      if (typeof id === 'string') {
        // index range (eg 100-250)

        const split = id.split('-')
        const from = parseInt(split[0], 10)
        const to = parseInt(split[1], 10)
        const array = range(from, to + 1) as number[]
        const promises = array.map(async i => {
          const full = local_cache[id] ? getLocalCache(id) : await getDBCache(i)
          ret[full.id] = full
        })
        // console.log('await Promise.all(promises)', promises.length)

        await Promise.all(promises)
      } else if (local_cache[id]) {
        // cache

        const cache_entry = getLocalCache(id)
        ret[cache_entry.id] = cache_entry
      } else {
        // no cache

        const full = await getDBCache(id as number)
        ret[full.id] = full
        local_cache[id] = full
      }
    })
  )
  // console.log('ret', index)
  return ret
}

function getLocalCache(id) {
  assert(local_cache[id], `Local cache ${id} missing`)
  return local_cache[id]
}

const str_number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// TODO multi get
async function getDBCache(id: number): Promise<{ id: string }> {
  // console.log('getCacheEntry', id)
  assert(id, `id required (got '${id}')`)
  const ret = {}
  const json = await get('cache-' + id)
  if (!json) {
    console.log('missing cache', id)
    process.exit()
  }
  let data
  try {
    data = JSON.parse(json)
  } catch (e) {
    console.error('cache json error', id, e, typeof json, json)
    process.exit()
  }
  // decode enums to field names
  for (const field of Object.keys(Fields)) {
    if (str_number.includes(field[0])) continue
    const index = Fields[field]
    if (typeof data[index] === 'undefined') continue
    ret[field.toLowerCase()] = data[index]
  }
  assert(ret, 'cache entry empty')
  // merge
  local_cache[id] = ret
  // delete cache[last_cache_id]
  return local_cache[id]
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
