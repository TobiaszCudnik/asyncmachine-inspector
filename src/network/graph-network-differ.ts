import * as assert from 'assert/'
import { GraphNetwork, GraphNode, NodeGraph } from './graph-network'
import { Delta, DiffPatcher } from 'jsondiffpatch'

// TODO specify the fields
export type GraphJSON = Partial<NodeGraph>

/**
 * TODO make it a stream
 */
export class GraphNetworkDiffer {
  network: GraphNetwork
  diffpatcher: DiffPatcher
  previous_json: GraphJSON

  constructor(network: GraphNetwork) {
    assert(network)
    this.network = network
    this.diffpatcher = new DiffPatcher({
      objectHash: this.objectHash()
      // propertyFilter(name) {
      //   // skip machine instances
      //   return ['machine', 'machine'].includes(name)
      // }
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
  generateGraphJSON(): GraphJSON {
    const graph = this.network.graph
    const ret: GraphJSON = {}

    // clone nodes
    ret._nodes = {}
    for (const key of Object.keys(graph._nodes)) {
      // @ts-ignore
      ret._nodes[key] = graph._nodes[key].export()
    }
    // clone _edgeLabels
    ret._edgeLabels = {}
    for (const key of Object.keys(graph._edgeLabels)) {
      // @ts-ignore
      ret._edgeLabels[key] = graph._edgeLabels[key].export()
    }

    this.previous_json = ret
    return ret
  }

  generateGraphPatch(base_json?: GraphJSON): Delta {
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
