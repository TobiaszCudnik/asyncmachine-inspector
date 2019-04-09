import * as jsondiffpatch from 'jsondiffpatch'
import * as assert from 'assert/'
import Network, {
  GraphNetwork,
  IPatch,
  MachineNode as NetworkMachineNode,
  Node as GraphNode,
  NODE_LINK_TYPE,
  RELATION_TO_LINK_TYPE
} from '../../../network/network'
// TODO shouldnt point to a layout-specific type
import { INetworkJson } from './json/joint'

export interface JSONSnapshot {
  full_sync: INetworkJson
  patches: IPatch[]
}

export interface INetworkJsonFactory<Json> {
  generateJson(): Json
}

export type TJSONIndex = { [index: string]: number }

/**
 * Produce JSON from a Network instance, ready to be consumed by the UI layer.
 */
export abstract class JointJsonFactory<
  Json,
  Machine extends { id: string },
  State extends { id: string },
  Link extends { id: string }
> implements INetworkJsonFactory<Json> {
  network: GraphNetwork
  // list of created machine nodes
  parsed_machine_ids: Set<string>

  json: Json
  // ID to position in the array
  json_index: TJSONIndex
  changed_ids: Set<string> = new Set()

  constructor(network: Network) {
    assert(network)
    this.network = network
    // TODO turn on once caching is done
    // keep track of all changed ID during a transition-per-machine
    // to be able to un-mark them once the transition is over
    // let transition_changed_ids = {}
    // this.network.on(
    //   'change',
    //   (type: PatchType, machine_id: string, ...data) => {
    //     let changed_ids = []
    //     const machine = this.network.machine_ids[machine_id]
    //     switch (type) {
    //       case PatchType.STATE_CHANGED:
    //       case PatchType.TRANSITION_STEP:
    //         changed_ids.push(...(data[0] as string[]))
    //         changed_ids.unshift(machine_id)
    //         break
    //       case PatchType.MACHINE_ADDED:
    //       case PatchType.MACHINE_REMOVED:
    //         changed_ids.push(machine_id)
    //         changed_ids.push(
    //           ...machine.states_all.map(s => `${machine_id}:${s}`)
    //         )
    //         break
    //       case PatchType.PIPE:
    //         changed_ids.push(...(data[0] as string[]))
    //         changed_ids.unshift(machine_id)
    //         break
    //       case PatchType.TRANSITION_END:
    //         // re-generate all the changed states to loose the during-transition
    //         // styling
    //         if (this.network.machines_during_transition.size == 0) {
    //           // add all remaining IDs
    //           changed_ids.push(
    //             ...Object.values(transition_changed_ids).reduce(
    //               (ret, ids) => ret.push(...ids) && ret,
    //               []
    //             )
    //           )
    //           transition_changed_ids = {}
    //         } else if (transition_changed_ids[machine_id]) {
    //           changed_ids.push(...transition_changed_ids[machine_id])
    //           // TODO this is not really correct, but it works
    //           // delete transition_changed_ids[machine_id]
    //         }
    //       // fall
    //       case PatchType.TRANSITION_START:
    //       case PatchType.QUEUE_CHANGED:
    //         changed_ids.push(machine_id)
    //         break
    //     }
    //     for (const id of changed_ids) {
    //       this.changed_ids.add(id)
    //       if (type == PatchType.TRANSITION_END) continue
    //       if (!transition_changed_ids[machine_id]) {
    //         transition_changed_ids[machine_id] = new Set()
    //       }
    //       transition_changed_ids[machine_id].add(id)
    //     }
    //   }
    // )
  }

  generateJson(): Json {
    // TODO cleanup at the end
    const prev_json = this.json
    const index = this.json_index
    // console.log(`Generating JSON for ${this.changed_ids.size} IDs`)
    // reset everything besides `this.changed_ids`
    this.json = this.initJson()
    this.json_index = {}
    this.parsed_machine_ids = new Set()

    // process nodes
    // TODO ideally go through this.changed_ids only
    this.network.states.map(node => {
      this.parseNode(node, prev_json, index)
    })
    this.network.links.map(link => {
      const from = this.network.nodes.find(
        n => n.id === link.from_id
      ) as GraphNode
      const to = this.network.nodes.find(n => n.id === link.to_id) as GraphNode
      this.parseLink(from, to, prev_json, index)
    })

    this.changed_ids = new Set()

    return this.json
  }

  abstract getCachedNode<Node>(
    id: string,
    prev_json: Json,
    index: TJSONIndex
  ): Node

  abstract onNodeChange(index: number, skip_increment?: boolean)

  parseMachine(
    machine: NetworkMachineNode,
    prev_json: Json,
    index: TJSONIndex
  ) {
    const machine_id = machine.id
    let machine_node = this.getCachedNode<Machine>(machine_id, prev_json, index)
    if (machine_node) {
      const node_index = this.addMachineNode(machine_node)
      this.json_index[machine_node.id] = node_index
    } else {
      machine_node = this.createMachineNode(machine, prev_json, index)
      const node_index = this.addMachineNode(machine_node)
      this.onNodeChange(node_index)
    }
    this.parsed_machine_ids.add(machine_id)
  }

  parseNode(graph_node: GraphNode, prev_json: Json, index: TJSONIndex) {
    const machine = graph_node.machine_node

    if (!this.parsed_machine_ids.has(graph_node.machine_id)) {
      this.parseMachine(machine, prev_json, index)
    }

    let node = this.getCachedNode<State>(graph_node.full_name, prev_json, index)
    if (node) {
      const node_index = this.addStateNode(node)
      this.json_index[node.id] = node_index
    } else {
      node = this.createStateNode(graph_node, prev_json, index)
      // add to json
      const node_index = this.addStateNode(node)
      this.onNodeChange(node_index)
    }
  }

  /**
   * Create a link for every relation
   */
  parseLink(
    from: GraphNode,
    to: GraphNode,
    prev_json: Json,
    index: TJSONIndex
  ) {
    // state relations
    if (from.machine_id == to.machine_id) {
      // TODO read from the graph
      const relations = this.network.linksByType
        .filter(link => link.v === from.id && link.w === to.id)
        .map(link => link.name)
      for (let relation of relations) {
        let relation_type = RELATION_TO_LINK_TYPE[relation]
        assert(relation_type !== undefined)
        // @ts-ignore
        const type = relation_type as NODE_LINK_TYPE

        const link_id = this.createLinkID(from, to, type)
        let link_node = this.getCachedNode<Link>(link_id, prev_json, index)

        if (link_node) {
          const node_index = this.addLinkNode(link_node)
          this.json_index[link_node.id] = node_index
        } else {
          link_node = this.createLinkNode(from, to, type, prev_json, index)
          // add to json
          const node_index = this.addLinkNode(link_node)
          this.onNodeChange(node_index)
        }
      }
      // piped states
    } else {
      for (let pipe of from.machine.piped[from.name]) {
        if (pipe.machine != to.machine || pipe.state != to.name) continue

        let type
        // if (!pipe.flags) {
        type = NODE_LINK_TYPE.PIPE
        // } else if (
        //   pipe.flags & PipeFlags.INVERT &&
        //   pipe.flags & PipeFlags.NEGOTIATION
        // ) {
        //   type = NODE_LINK_TYPE.PIPE_INVERTED_NEGOTIATION
        // } else if (pipe.flags & PipeFlags.NEGOTIATION) {
        //   type = NODE_LINK_TYPE.PIPE_NEGOTIATION
        // } else if (pipe.flags & PipeFlags.INVERT) {
        //   type = NODE_LINK_TYPE.PIPE_INVERTED
        // }

        const link_id = this.createLinkID(from, to, type)
        let link_node = this.getCachedNode<Link>(link_id, prev_json, index)

        if (link_node) {
          const node_index = this.addLinkNode(link_node)
          this.json_index[link_node.id] = node_index
        } else {
          link_node = this.createLinkNode(from, to, type, prev_json, index)
          // add to json
          const node_index = this.addLinkNode(link_node)
          this.onNodeChange(node_index)
        }

        // break after finding the piped connection
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
        // TODO return a detailed pipe info
        return 'pipe'
      // case t.PIPE_INVERTED:
      //   return 'drop'
      // case t.PIPE_NEGOTIATION:
      //   return 'add neg'
      // case t.PIPE_INVERTED_NEGOTIATION:
      //   return 'drop neg'
    }
  }

  protected getMachineName(machine) {
    return machine.id().replace(['[', ']', ' '], '')
  }

  abstract initJson(): Json

  abstract addMachineNode(node: Machine)
  abstract addStateNode(node: State)
  abstract addLinkNode(node: Link)

  abstract createMachineNode(
    machine: NetworkMachineNode,
    prev_json,
    index
  ): Machine
  abstract createStateNode(node: GraphNode, prev_json, index): State
  abstract createLinkNode(
    from: GraphNode,
    to: GraphNode,
    relation: NODE_LINK_TYPE,
    prev_json,
    index
  ): Link
  abstract createLinkID(
    from: GraphNode,
    to: GraphNode,
    relation: NODE_LINK_TYPE
  ): string
}

/**
 * TODO make it a stream
 */
export abstract class JointDiffFactory<
  T extends INetworkJsonFactory<Json>,
  Json
> {
  diffpatcher: jsondiffpatch.IDiffPatch
  // TODO rename to json
  previous_json: Json

  constructor(public network: T) {
    assert(network)
    this.diffpatcher = jsondiffpatch.create({
      objectHash: this.objectHash(),
      propertyFilter(name, context) {
        // skip revision numbers
        return name != 'version'
      }
    })
  }

  objectHash(): (node: any) => any {
    return function(node) {
      return node.id
    }
  }

  generateJson() {
    // generate a new json and keep it as the last one
    return (this.previous_json = this.network.generateJson())
  }

  generateDiff(base_json?: Json) {
    base_json = base_json || this.previous_json

    assert(base_json, 'Base JSON required to create a diff')

    this.generateJson()

    // generate the diff
    return this.diffpatcher.diff(base_json, this.previous_json)
  }
}

export enum OBJECT_TYPE {
  MACHINE,
  STATE,
  LINK
}
