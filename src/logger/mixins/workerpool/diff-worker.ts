import * as workerpool from 'workerpool'
import * as redis from 'redis'
import { GraphNetworkDiffer } from '../../../network/graph-network-differ'
import { promisify } from 'util'
import * as assert from 'assert'
import * as uuid from 'simple-random-id'

const db = redis.createClient()
const sub = redis.createClient()
const worker_id = uuid()
// keep the fully build jsons (ready for diffing)
const jsons = {}
// keeps index diffs
const diffs = {}
let parsing_json = false
let last_index = -1
let last_requested_index = -1

console.log('worker start')

sub.subscribe('ami-logger-exit')
sub.subscribe('ami-logger-index')
sub.subscribe('ami-logger-dispose')
sub.subscribe('ami-logger-dispose-json')

sub.on('message', function(channel: string, msg: string) {
  try {
    if (channel == 'ami-logger-exit') {
      process.exit()
    } else if (channel == 'ami-logger-index') {
      // TODO assert prev indexes has also already been saved (track emits)
      last_requested_index = parseInt(msg, 10)
      loadJSON(last_requested_index)
      // TODO await and request the last_requested_index again
    } else if (channel == 'ami-logger-dispose') {
      console.log('dispose', msg)
      delete cache[msg]
    } else if (channel == 'ami-logger-dispose-json') {
      delete jsons[msg]
      delete diffs[msg]
    }
  } catch (e) {
    console.error('worker differ error', e)
  }
})

// @ts-ignore
const differ = new GraphNetworkDiffer({})
const cache = {}

async function get(key) {
  return promisify(db.get).call(db, key)
}

async function set(key, value) {
  assert(typeof value !== 'undefined')
  return promisify(db.set).call(db, key, value)
}

// async function fetch_versions(index: number) {
//   return await Promise.all([get(index - 1 + '-index'), get(index + '-index')])
// }

// TODO write directly to the file stream
//  sync via redis
//  dont send back the data at all
//  accept the whole patch in a separate redis cell
async function createDiff(index: number) {
  // console.log('worker diff req', index)
  let patch = await get(index + '-patch')

  // create the actual diff
  // TODO dont jsondiff when an index diff is empty
  const diff = differ.diffpatcher.diff(jsons[index - 1], jsons[index])
  differ.previous_json = null

  // inject into the text patch and save
  patch = patch.slice(0, -1) + `,"diff": ${JSON.stringify(diff)}}`
  await set(index + '-patch-diff', patch)
  // console.log('patch saved', index, data.length)

  // set as ready
  await set(index + '-ready', true)
  // console.log('ready saved', index)

  // request a write
  // TODO throttle
  db.publish('ami-logger-write', index.toString())

  // DEBUG
  if (index % 1000 === 0) {
    console.log('AFTER createDiff', index)
  }
  // console.log('worker diff', patch)
  // console.log('worker diff ready', index)
}

async function loadJSON(index) {
  if (parsing_json) {
    return
  }
  parsing_json = true
  const promises = []
  // load indexes
  for (let i = Math.max(last_index, 0); i <= index; i++) {
    promises.push(
      get(i + '-index').then(patch => {
        diffs[i] = (patch && JSON.parse(patch)) || null
      })
    )
  }
  await Promise.all(promises)
  promises.length = 0
  // parse indexes & load cache chunks
  for (let i = Math.max(last_index, 0); i <= index; i++) {
    const diff = diffs[i]
    const prev_json = jsons[i - 1] || { nodes: [], links: [] }
    if (!diff) {
      // empty (index) diff
      // TODO mark as no-change to avoid jsondiffing
      jsons[i] = prev_json
      continue
    }
    console.log('diff', diff)
    const load_nodes = mergeList(i, prev_json.nodes, diff.nodes)
    const load_links = mergeList(i, prev_json.link, diff.links)
    // series
    const [nodes, links] = await Promise.all([load_nodes, load_links])
    // set the final json
    jsons[i] = { nodes, links }
    console.log('jsons[i]', i, jsons[i])
  }
  last_index = index
  assert(jsons[index], 'final json missing')
  db.publish('ami-logger-index-worker', JSON.stringify({ worker_id, index }))
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
        remove_ids.push(cache[i].id)
      }
    } else {
      try {
        // number
        remove_ids.push(cache[id].id)
      } catch (e) {
        console.log('no cache', id, cache)
      }
    }
  }
  // remove from the copy of the prev json
  for (const id of remove_ids) {
    delete ret[id]
  }
  // add the new IDs
  await Promise.all(
    list.add.map(async id => {
      if (typeof id === 'string') {
        // index range (eg 100-250)

        const range = id.split('-')
        const from = parseInt(range[0], 10)
        const to = parseInt(range[1], 10)
        const promises = []

        for (let i = from; i <= to; i++) {
          promises.push(async () => {
            const full = await getCacheEntry(i)
            ret[full.id] = full
          })
        }
        await Promise.all(promises)
      } else if (cache[id]) {
        // cache

        ret[cache[id].id] = cache[id]
      } else {
        // no cache

        const full = await getCacheEntry(id as number)
        ret[full.id] = full
        cache[id] = full
      }
    })
  )
  return ret
}

// TODO multi get
async function getCacheEntry(id: number): Promise<{ id: string }> {
  let ret = { id: '' }
  const json = JSON.parse(await get('cache-' + id))
  console.log(id, json)
  assert(json, `cache ${id} not found`)
  console.log('cache ok', id)
  // diff
  const [last_cache_id, new_cache] = json
  // TODO request cache[last_cache_id] if not available
  if (last_cache_id && !cache[last_cache_id]) {
    // TODO this isnt guaranteed to be available?
    console.log('chunk missing', last_cache_id, id)
    await getCacheEntry(last_cache_id)
  }
  // merge
  if (last_cache_id) {
    cache[id] = { ...cache[last_cache_id], ...new_cache }
  } else {
    cache[id] = new_cache
  }
  ret = cache[id]
  // delete cache[last_cache_id]
  return ret
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
