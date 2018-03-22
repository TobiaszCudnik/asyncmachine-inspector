// file myWorker.js
import * as workerpool from 'workerpool'
import * as fs from 'fs'
import * as util from 'util'
import { JsonDiffFactory } from '../../inspector/joint/network'

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

async function createDiffID(prev_id, id, pos) {
  const [prev, json] = await Promise.all([
    readFileAsync(`./tmp/${prev_id}.json`),
    readFileAsync(`./tmp/${id}.json`)
  ])
  differ.previous_json = prev
  network.json = json
  // console.log('generateDiff', workerpool.isMainThread)
  const diff = differ.generateDiff()
  // fs.unlink(`./tmp/${prev_id}.json`)
  // console.log('generate diff END', pos)
  return diff
}

function createDiffSync(prev, json, pos) {
  differ.previous_json = prev
  network.json = json
  // console.log('generateDiff', workerpool.isMainThread)
  const diff = differ.generateDiff()
  // console.log('generate diff END', pos)
  return diff
}

function createDiff(id, json, previous_id) {
  jsons.push({ time: Date.now(), id, json })
  let previous = jsons.find(r => r.id == previous_id)
  if (!previous) {
    return previous_id
  } else {
    differ.previous_json = previous.json
    network.json = json
    // console.log('generate diff 1')
    return differ.generateDiff()
  }
}

function createDiff2(id, previous_id, previous) {
  jsons.push({ time: Date.now(), previous_id, previous })
  differ.previous_json = previous
  network.json = jsons.find(r => r.id == id).json
  // console.log('generate diff 2 start')
  let diff = differ.generateDiff()
  // console.log('generate diff 2 end')
  return diff
}

// create a worker and register functions
workerpool.worker({
  createDiffID,
  createDiffSync,
  createDiff,
  createDiff2
})
