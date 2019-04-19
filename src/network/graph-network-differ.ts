import * as assert from 'assert/'
import {
  GraphNetwork,
  GraphNode,
  LinkNode,
  MachineNode,
  StateNode
} from './graph-network'
import { Delta, DiffPatcher } from 'jsondiffpatch'
import * as EventEmitter from 'eventemitter3'

// TODO specify the fields
export interface IGraphJSON {
  nodes: {
    // TODO define the exported type in graph-network.ts
    [id: string]: Exclude<MachineNode | StateNode, 'machine_node' | 'machine'>
  }
  links: { [id: string]: LinkNode[] }
}

let caches = 0
let misses = 0
const last_index = {}

/**
 * TODO make it a stream
 */
export class GraphNetworkDiffer extends EventEmitter {
  network: GraphNetwork
  diffpatcher: DiffPatcher
  previous_json: IGraphJSON

  constructor(network: GraphNetwork) {
    super()
    assert(network)
    this.network = network
    this.diffpatcher = new DiffPatcher({
      objectHash: this.objectHash()
    })
  }

  /**
   * Hash every array element by ID.
   */
  objectHash(): (node: GraphNode) => any {
    return function(node) {
      return node.id
    }
  }

  last_cache_id = 0

  /**
   * Generates a json representation of the graph, ready for diffing.
   *
   * TODO skip the caches and rebuild them on import
   * TODO move to the graph class
   */
  generateGraphJSON(stringify?: false, index?: undefined): IGraphJSON
  // @ts-ignore
  generateGraphJSON(
    stringify?: true,
    index?: number
  ): [Function[], [number, number][], string]
  // @ts-ignore
  generateGraphJSON(
    stringify = false,
    index: number = undefined
  ): IGraphJSON | Promise<string> {
    const graph = this.network.graph
    const nodes = {}
    const links = {}
    let json = '{"nodes":['
    let first = true
    const to_delete: string[] = []
    const to_save = {}
    const run_node = (key, source, target) => {
      const graph_node = source[key]
      if (stringify) {
        if (!first) {
          json += ','
        }
        const cache_index = graph_node.cache
          ? graph_node.cache_version
          : this.last_cache_id
        json += cache_index
        if (graph_node.cache) {
          caches++
        } else {
          graph_node.cache = true
          to_save[this.last_cache_id] = JSON.stringify(graph_node.export())
          to_delete.push(graph_node.cache_version)
          graph_node.cache_version = this.last_cache_id
          // inc
          misses++
          this.last_cache_id++
        }
        first = false
      } else {
        target[key] = graph_node.export()
      }
    }
    this.emit('json-cache', to_save, to_delete)
    // TODO delete nodes missing from the last run
    // clone nodes
    for (const key of Object.keys(graph._nodes)) {
      run_node(key, graph._nodes, nodes)
    }
    first = true
    json += '],"links":['
    // clone _edgeLabels
    for (const key of Object.keys(graph._edgeLabels)) {
      run_node(key, graph._edgeLabels, links)
    }
    json += ']}'

    // ----- DEBUG

    if (misses % 10000 === 0 || caches % 10000 === 0) {
      console.log('caches', caches, misses)
    }
    // if (json.length > 1000) {
    //   console.dir(json)
    //   process.exit()
    // }
    // try {
    //   JSON.parse(json)
    // } catch (e) {
    //   console.error('parse error', e)
    //   console.log(json)
    //   process.exit()
    // }

    const ret: IGraphJSON = {
      nodes,
      links
    }

    this.previous_json = ret
    // @ts-ignore
    return stringify ? [to_save, to_delete, json] : ret
  }

  generateGraphPatch(base_json?: IGraphJSON): Delta {
    base_json = base_json || this.previous_json

    assert(base_json, 'Base JSON required to create a diff')

    this.generateGraphJSON()

    // generate the diff
    return this.diffpatcher.diff(base_json, this.previous_json)
  }
}

export enum OBJECT_TYPE {
  MACHINE,
  STATE,
  LINK
}
