import * as workerpool from 'workerpool'
import * as fs from 'fs'
import * as util from 'util'
import {
  JsonDiffFactory,
  TLink,
  TMachine,
  TState
} from '../../../network/joint'
import * as redis from 'redis'
import { chain, sortBy } from 'lodash'

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
  generateJson() {
    return this.json
  }
}
// @ts-ignore
const differ = new JsonDiffFactory(network)

function versionedID(node: TMachine | TLink | TState) {
  return `${node.id}:${node.version}`
}

function disposeNode(vid: string) {
  delete cache[vid]
}

async function createDiff(prev_ids: string[], json_ids: string[], pos: number) {
  // get only unique IDs
  const ids = chain(prev_ids.filter(vid => !cache[vid]))
    .concat(json_ids.filter(vid => !cache[vid]))
    .uniq()
    .value()
  let multi = db.multi()
  for (const id of ids) {
    multi = multi.get(id)
  }
  // TODO <any> bc of wrong typing
  const results: string[] = <any>await new Promise((resolve, reject) => {
    multi.exec((err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
  // build both jsons
  const json = { cells: [] }
  const prev = { cells: [] }
  for (let [index, node_json] of results.entries()) {
    if (!node_json) {
      console.error('missing', ids[index])
      continue
    }
    const node: TMachine | TLink | TState = JSON.parse(node_json)
    const vid = versionedID(node)
    if (json_ids.includes(vid)) {
      json.cells.push(node)
    }
    if (prev_ids.includes(vid)) {
      prev.cells.push(node)
    }
    // cache the parsed JSON
    cache[vid] = node
  }
  // read the missing IDs from cache
  for (const vid of prev_ids) {
    if (!prev.cells.includes(vid)) {
      prev.cells.push(cache[vid])
    }
  }
  for (const vid of json_ids) {
    if (!json.cells.includes(vid)) {
      json.cells.push(cache[vid])
    }
  }
  // sort both jsons like the ID list
  json.cells.sort(
    (a, b) =>
      json_ids.indexOf(versionedID(a)) < json_ids.indexOf(versionedID(b))
        ? -1
        : 1
  )
  prev.cells.sort(
    (a, b) =>
      prev_ids.indexOf(versionedID(a)) < prev_ids.indexOf(versionedID(b))
        ? -1
        : 1
  )

  differ.previous_json = prev
  network.json = json
  return differ.generateDiff()
}

// create a worker and register functions
workerpool.worker({
  createDiff,
  disposeNode
})
