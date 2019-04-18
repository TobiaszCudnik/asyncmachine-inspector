import * as assert from 'assert/'
import {
  GraphNetwork,
  GraphNode,
  LinkNode,
  MachineNode,
  StateNode
} from './graph-network'
import { Delta, DiffPatcher } from 'jsondiffpatch'

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

/**
 * TODO make it a stream
 */
export class GraphNetworkDiffer {
  network: GraphNetwork
  diffpatcher: DiffPatcher
  previous_json: IGraphJSON

  constructor(network: GraphNetwork) {
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

  /**
   * Generates a json representation of the graph, ready for diffing.
   *
   * TODO skip the caches and rebuild them on import
   * TODO move to the graph class
   */
  generateGraphJSON(stringify?: false): IGraphJSON
  generateGraphJSON(stringify?: true): string
  generateGraphJSON(stringify = false): IGraphJSON | string {
    const graph = this.network.graph
    const nodes = {}
    const links = {}
    let json = '{"nodes":{'
    let first = true
    // clone nodes
    for (const key of Object.keys(graph._nodes)) {
      // @ts-ignore
      const graph_node = graph._nodes[key]
      if (stringify) {
        if (!first) {
          json += ','
        }
        if (graph_node.cache) {
          json += graph_node.cache
          caches++
        } else {
          const node_json =
            '"' + key + '"' + ': ' + JSON.stringify(graph_node.export())
          json += node_json
          if (graph_node instanceof StateNode) {
            graph_node.cache = node_json
          }
          misses++
        }
        first = false
      } else {
        nodes[key] = graph_node.export()
      }
    }
    first = true
    json += '},"links":{'
    // clone _edgeLabels
    for (const key of Object.keys(graph._edgeLabels)) {
      // @ts-ignore
      const graph_node = graph._edgeLabels[key]
      if (stringify) {
        if (!first) {
          json += ','
        }
        if (graph_node.cache) {
          json += graph_node.cache
          caches++
        } else {
          const node_json = `${JSON.stringify(key)}: ${JSON.stringify(
            graph_node.export()
          )}`
          json += node_json
          graph_node.cache = node_json
          misses++
        }
        first = false
      } else {
        links[key] = graph_node.export()
      }
    }
    if (misses % 1000 === 0 || caches % 1000 === 0) {
      console.log('caches', caches, misses)
    }
    json += '}}'
    // if (json.length > 1000) {
    //   console.dir(json)
    //   process.exit()
    // }
    try {
      JSON.parse(json)
    } catch (e) {
      console.error('parse error', e)
      console.log(json)
      process.exit()
    }

    const ret: IGraphJSON = {
      nodes,
      links
    }

    this.previous_json = ret
    return stringify ? json : ret
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
