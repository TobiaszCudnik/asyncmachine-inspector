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
  generateGraphJSON(): IGraphJSON {
    const graph = this.network.graph
    const nodes = {}
    const links = {}

    // clone nodes
    for (const key of Object.keys(graph._nodes)) {
      // @ts-ignore
      nodes[key] = graph._nodes[key].export()
    }
    // clone _edgeLabels
    for (const key of Object.keys(graph._edgeLabels)) {
      // @ts-ignore
      links[key] = graph._edgeLabels[key].export()
    }

    const ret: IGraphJSON = {
      nodes,
      links
    }

    this.previous_json = ret
    return ret
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
