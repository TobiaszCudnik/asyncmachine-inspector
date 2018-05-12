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

const db = redis.createClient()
const cache = {}
// TODO run after redis connects
// db.subscribe('ami-logger-cache')
// db.on('message', function(channel, vid) {
//   if (channel != 'ami-logger-cache') return
//   disposeNode(vid)
// })

const readFileAsync = util.promisify(fs.readFile)
const jsons = []
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

// TODO broadcast to all workers is missing in the workerpool module
// so caching is not possible
function disposeNode(vid: string) {
  console.log(`Disposed ${vid} in a worker`)
  delete cache[vid]
}

async function createDiff(prev_ids: string[], json_ids: string[], pos: number) {
  // get only unique IDs
  const ids = chain(prev_ids)
    .concat(json_ids)
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
    // TODO broadcast to all workers is missing in the workerpool module
    // so caching is not possible
    // cache[vid] = node
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
