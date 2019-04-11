import * as jsondiffpatch from 'jsondiffpatch'
import * as assert from 'assert/'
import {
  GraphNetwork,
  ILogEntry,
  ITransitionData,
  Node as GraphNode,
  NodeGraph
} from './graph-network'
import * as deepCopy from 'deepcopy'
import { Delta, DiffPatcher } from 'jsondiffpatch'
import Logger from "../logger/logger";

export interface IPatch {
  diff: Delta
  logs?: ILogEntry[]
  data?: ITransitionData
  summary?: string
}

/**
 * TODO make it a stream
 */
export class GraphNetworkDiffer {
  network: GraphNetwork
  logger: Logger
  diffpatcher: DiffPatcher
  // TODO rename to json
  previous_json: any

  constructor(network: GraphNetwork, logger: Logger) {
    assert(network)
    assert(logger)
    this.network = network
    this.logger = logger
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
   * Generates a json represention of the graph, ready for diffing.
   *
   * TODO narrow down Partial to fields only
   */
  generateGraphJSON(): Partial<NodeGraph> {
    const graph = this.network.graph
    const ret: Partial<NodeGraph> = {}
    // get all the private fields (`_foo`), besides functions
    for (const key of Object.keys(graph)) {
      if (key[0] !== '_' || typeof graph[key] === 'function') {
        continue
      }
      ret[key] = graph[key]
    }
    // TODO possibly avoid cloning by using the prototype chain
    //  (for each property)
    this.previous_json = deepCopy(ret)
    return this.previous_json
  }

  generateGraphDiff(base_json?: Delta) {
    base_json = base_json || this.previous_json

    assert(base_json, 'Base JSON required to create a diff')

    this.generateGraphJSON()

    // generate the diff
    return this.diffpatcher.diff(base_json, this.previous_json)
  }

  generatePatch(): IPatch {
    const logs = this.network.logs
    this.network.logs = []
    return {
      diff: this.generateGraphDiff(),
      logs,
      // TODO get the summary from the logger
      summary: 'TODO'
    }
  }
}

export enum OBJECT_TYPE {
  MACHINE,
  STATE,
  LINK
}
