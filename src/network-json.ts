import * as jsondiffpatch from 'jsondiffpatch'
import * as assert from 'assert/'
import Network, {ILogEntry, IPatch, Node as GraphNode} from './network'
import { PipeFlags } from 'asyncmachine'
import { AsyncMachine } from 'asyncmachine/src/types'
import {INetworkJson} from "./inspector/joint/network";

export interface JSONSnapshot {
  full_sync: INetworkJson,
  patches: IPatch[]
}

export interface INetworkJsonFactory<Json> {
  generateJson(): Json
}

/**
 * Produce JSON from a Network instance, ready to be consumed by the UI layer.
 */
export abstract class NetworkJsonFactory<Json, Machine, State, Link>
  implements INetworkJsonFactory<Json> {
  // list of created machine nodes
  machine_ids: Set<string>
  // map of machine IDs to machine nodes
  machine_nodes: {
    [index: string]: Machine
  }
  // map of graph nodes to their d3 nodes
  nodes: Map<GraphNode, State>
  // map of created external nodes
  // also used for creating links between machine nodes
  externals: Map<GraphNode, Set<GraphNode>>

  json: Json

  constructor(public network: Network) {
    assert(network)
  }

  generateJson(): Json {
    // TODO cleanup at the end
    this.json = this.initJson()
    this.machine_ids = new Set()
    this.nodes = new Map()
    this.machine_nodes = {}
    this.externals = new Map()

    // process nodes
    this.network.graph.forEach(node => this.parseNode(node))
    this.network.graph.traverseAll((from, to) => this.parseLink(from, to))

    return this.json
  }

  parseMachine(machine: AsyncMachine) {
    const machine_id = machine.id(true)
    const machine_node = this.createMachineNode(machine)
    this.addMachineNode(machine_node)
    this.machine_ids.add(machine_id)
    this.machine_nodes[machine_id] = machine_node
  }

  parseNode(graph_node: GraphNode) {
    const machine = graph_node.machine

    if (!this.machine_ids.has(graph_node.machine_id)) {
      this.parseMachine(machine)
    }

    const node = this.createStateNode(graph_node)

    // add to json
    this.addStateNode(node)

    // index the reference
    this.nodes.set(graph_node, node)
  }

  /**
   * create a link for every relation
   */
  parseLink(from: GraphNode, to: GraphNode) {
    // state relations
    if (from.machine_id == to.machine_id) {
      let relations = from.relations(to)
      for (let relation of relations) {
        let relation_type = RELATION_TO_LINK_TYPE[relation]
        assert(relation_type !== undefined)

        this.addLinkNode(this.createLinkNode(from, to, relation_type))
      }
      // piped states
    } else {
      for (let pipe of from.machine.piped[from.name]) {
        if (pipe.machine != to.machine || pipe.state != to.name) continue

        let type
        if (!pipe.flags) type = NODE_LINK_TYPE.PIPE
        else if (
          pipe.flags & PipeFlags.INVERT &&
          pipe.flags & PipeFlags.NEGOTIATION
        )
          type = NODE_LINK_TYPE.PIPE_INVERTED_NEGOTIATION
        else if (pipe.flags & PipeFlags.NEGOTIATION)
          type = NODE_LINK_TYPE.PIPE_NEGOTIATION
        else if (pipe.flags & PipeFlags.INVERT)
          type = NODE_LINK_TYPE.PIPE_INVERTED

        this.addLinkNode(this.createLinkNode(from, to, type))

        // pipe is represented by 2 entries (enter and exit)
        break
      }
    }
  }

  getLabelFromLinkType(type: NODE_LINK_TYPE): string {
    let t = NODE_LINK_TYPE
    switch (type) {
      case t.REQUIRE:
        return 'require'
      case t.DROP:
        return 'drop'
      case t.AFTER:
        return 'after'
      case t.ADD:
        return 'add'
      case t.PIPE:
        return 'add'
      case t.PIPE_INVERTED:
        return 'drop'
      case t.PIPE_NEGOTIATION:
        return 'add neg'
      case t.PIPE_INVERTED_NEGOTIATION:
        return 'drop neg'
    }
  }

  protected getMachineName(machine) {
    return machine.id().replace(['[', ']', ' '], '')
  }

  abstract initJson(): Json

  abstract addMachineNode(node: Machine)
  abstract addStateNode(node: State)
  abstract addLinkNode(node: Link)

  abstract createMachineNode(machine: AsyncMachine): Machine
  abstract createStateNode(node: GraphNode): State
  abstract createLinkNode(
    from: GraphNode,
    to: GraphNode,
    relation: NODE_LINK_TYPE
  ): Link
}

/**
 * TODO make it a stream
 */
export abstract class JsonDiffFactory<
  T extends INetworkJsonFactory<Json>,
  Json
> {
  diffpatcher: jsondiffpatch.IDiffPatch
  previous_json: Json

  constructor(public network: T) {
    assert(network)
    this.diffpatcher = jsondiffpatch.create({
      objectHash: this.objectHash()
    })
  }

  objectHash(): (node: any) => any {
    return function(node) {
      return node.id
    }
  }

  generateJson() {
    // generate a new json and keep it as the last one
    this.previous_json = this.network.generateJson()
  }

  generateDiff(base_json?: Json) {
    base_json = base_json || this.previous_json

    assert(base_json, 'Base JSON required to create a diff')

    this.generateJson()

    // generate the diff
    return this.diffpatcher.diff(base_json, this.previous_json)
  }
}

export enum NODE_LINK_TYPE {
  REQUIRE,
  DROP,
  AFTER,
  ADD,
  PIPE,
  PIPE_INVERTED,
  PIPE_NEGOTIATION,
  PIPE_INVERTED_NEGOTIATION
}

export enum RELATION_TO_LINK_TYPE {
  require = NODE_LINK_TYPE.REQUIRE,
  drop = NODE_LINK_TYPE.DROP,
  add = NODE_LINK_TYPE.ADD,
  after = NODE_LINK_TYPE.AFTER
}

export enum OBJECT_TYPE {
  MACHINE,
  STATE,
  LINK
}
