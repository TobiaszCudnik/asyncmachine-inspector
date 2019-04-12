import { StateStructFields, TransitionStepTypes } from 'asyncmachine'
import {
  IStateStruct,
  MutationTypes,
  QueueRowFields,
  TAsyncMachine
} from 'asyncmachine/types'
import { Graph } from 'graphlib'
import * as EventEmitter from 'eventemitter3'
import { IEdge } from 'cinea-graphlib'
import * as deepCopy from 'deepcopy'

export type NodeGraph = Graph<Node | MachineNode, LinkNode, {}, NODE_LINK_TYPE>

export interface ILogEntry {
  id: string
  msg: string
  level: number
}

export interface ITransitionData {
  type: MutationTypes
  states: string[]
  queue_machine_id: string
  machine_id: string
  auto: boolean
  touched?: { [machine_id: string]: string[] }
}

export enum PatchType {
  STATE_CHANGED, // 0
  MACHINE_ADDED,
  TRANSITION_START,
  TRANSITION_END, // 3
  TRANSITION_STEP, // 4
  PIPE,
  FULL_SYNC,
  MACHINE_REMOVED,
  QUEUE_CHANGED,
  PIPE_REMOVED
}

export enum NODE_TYPE {
  MACHINE,
  STATE,
  LINK
}

export enum NODE_LINK_TYPE {
  REQUIRE,
  DROP,
  AFTER,
  ADD,
  PIPE
  // TODO figure out how to mark all the PipeFlags permutations
  // PIPE_INVERTED,
  // PIPE_NEGOTIATION,
  // PIPE_INVERTED_NEGOTIATION
}

export enum RELATION_TO_LINK_TYPE {
  require = NODE_LINK_TYPE.REQUIRE,
  drop = NODE_LINK_TYPE.DROP,
  add = NODE_LINK_TYPE.ADD,
  after = NODE_LINK_TYPE.AFTER
}

export class GraphNode {
  type: NODE_TYPE
  skip_fields = ['machine', 'machine_node']
  clone_fields = []

  export(): Object {
    const ret = {}
    for (const key of Object.keys(this)) {
      if (['skip_fields', 'clone_fields', ...this.skip_fields].includes(key)) {
        continue
      }
      ret[key] = this.clone_fields.includes(key)
        ? deepCopy(this[key])
        : this[key]
    }
    return ret
  }
}

export class LinkNode extends GraphNode {
  readonly type = NODE_TYPE.LINK
  link_type: NODE_LINK_TYPE
  is_touched = false
  to_id: string
  from_id: string

  get id() {
    return this.to_id + '::' + this.from_id + '::' + this.type
  }

  constructor(link_type: NODE_LINK_TYPE, from_id: string, to_id: string) {
    super()
    this.link_type = link_type
    this.from_id = from_id
    this.to_id = to_id
    this.link_type = link_type
  }
}

export class Node extends GraphNode {
  readonly type = NODE_TYPE.STATE
  name: string
  // TODO skip in export
  machine: TAsyncMachine
  // TODO skip in export
  machine_node: MachineNode
  machine_id: string
  /**
   * Bit mask with all the step types for this state during the current
   * transition.
   */
  step_style: TransitionStepTypes | null = null

  get id() {
    return `${this.machine_id}:${this.name.replace(/[^\w]/g, '-')}`
  }
  /**
   * Get the original state definition.
   */
  get state() {
    return this.machine.states_all.find(s => s.name === this.name)
  }
  /**
   * Is the state currently set?
   */
  get is_set(): boolean {
    // TODO make sure this shows proper states with "Transition steps"
    // granularity on both an external queue and a nested queue
    return this.machine.transition &&
      this.machine.transition.machine == this.machine
      ? this.machine.transition.before.includes(this.name)
      : // TODO use json, not a method
        this.machine.states_active.includes(this.name)
  }
  get is_multi(): boolean {
    // TODO use json, not a method
    return this.machine.states_all.find(r => r.name === this.name).multi
  }
  get is_auto(): boolean {
    // TODO use json, not a method
    return this.machine.states_all.find(r => r.name === this.name).auto
  }
  get full_name(): string {
    return `${this.machine_id}:${this.name}`
  }
  get clock(): number {
    // @ts-ignore
    return this.machine.clock_[this.name]
  }

  constructor(name: string, machine: MachineNode) {
    super()
    this.name = name
    this.machine = machine.machine
    this.machine_id = machine.id
    this.machine_node = machine
  }
}

export class MachineNode extends GraphNode {
  readonly type = NODE_TYPE.MACHINE
  machine: TAsyncMachine

  get id(): string {
    return this.machine.id(true)
  }
  get name(): string {
    return this.machine.id()
  }
  get during_transition(): boolean {
    return this.machine.duringTransition()
  }
  get queue(): any {
    // TODO ID
    // @ts-ignore
    const id = QueueRowFields.ID
    // TODO cache
    return this.machine.queue().map(r => ({
      machine: (r[QueueRowFields.TARGET] || this.machine).id(true),
      states: r[QueueRowFields.STATES],
      type: r[QueueRowFields.STATE_CHANGE_TYPE],
      auto: r[QueueRowFields.AUTO],
      id: r[id]
    }))
  }
  get processing_queue(): boolean {
    return Boolean(this.machine.queue().length)
  }
  get listeners(): number {
    return (
      // @ts-ignore
      Object.values(this.machine._events || {})
        // @ts-ignore
        .map(e => e.length || 1)
        .reduce((count, num) => {
          return (count || 0) + num
        }, 0)
    )
  }
  get ticks(): number {
    // TODO expose as a property in AsyncMachine
    // @ts-ignore
    return Object.values(this.machine.clock_).reduce((r, n) => r + n, 0)
  }

  constructor(machine: TAsyncMachine) {
    super()
    this.machine = machine
  }
}

/**
 * Base class for representing the network graph which is able to be
 * un-serialized from and operate on pure JSON.
 *
 * Needed for jsondiff-based syncs across workers.
 *
 * Instances:
 * - server (logger)
 * - client (UI inspector)
 */
export class GraphNetwork extends EventEmitter {
  id: string
  graph: NodeGraph
  // buffer of logs since the last sync
  logs: ILogEntry[] = []
  // TODO remove
  machines_during_transition_manual: string[] = []

  // TODO move graph, use json
  get nodes(): (Node | MachineNode)[] {
    return Object.values(
      // @ts-ignore
      this.graph._nodes
    )
  }

  // TODO move graph, use json
  get links(): LinkNode[] {
    return Object.values(
      // @ts-ignore
      this.graph._edgeLabels
    )
  }

  // TODO move graph, use json
  get linksByType(): IEdge[] {
    return Object.values(
      // @ts-ignore
      this.graph._edgeObjs
    )
  }

  // TODO move graph, use json
  get states(): Node[] {
    return this.nodes.filter(node => node.type === NODE_TYPE.STATE) as Node[]
  }

  // TODO move graph, use json
  get machine_nodes(): MachineNode[] {
    return this.nodes.filter(
      node => node.type === NODE_TYPE.MACHINE
    ) as MachineNode[]
  }

  // TODO remove
  get machines_during_transition(): MachineNode[] {
    const real = this.machine_nodes.filter(node => node.during_transition)
    const manual = this.machines_during_transition_manual.map(
      id => this.graph.node(id) as MachineNode
    )
    return [...real, ...manual]
  }

  constructor() {
    super()
    this.graph = new Graph({ compound: true, directed: true, multigraph: true })
  }

  /**
   * Returns the type of the connection between 2 passed nodes. Only one
   * connection is supported.
   */
  getLinkType(source: Node, target: Node): NODE_LINK_TYPE | null {
    const edges = this.graph.outEdges(source.id, target.id)
    return edges.length ? edges[0].link_type : null
  }

  protected updateStepStyle(node: Node, type: TransitionStepTypes) {
    // add this step type to the bit mask
    node.step_style |= type
    let types = TransitionStepTypes
    // exceptions are SET and NO_SET which are mutually exclusive
    // with a latest-wins policy
    if (type == types.SET && node.step_style & types.NO_SET)
      node.step_style ^= types.NO_SET
    else if (type == types.NO_SET && node.step_style & types.SET)
      node.step_style ^= types.SET
  }

  // TODO move as a getter to the Link class
  // TODO create the Link class
  createLinkID(from, to, relation: NODE_LINK_TYPE) {
    return `${from.id}::${to.id}::${relation}`
  }

  getNodeByName(name: string, machine_id: string): Node {
    for (let node of this.graph.nodes().map(id => this.graph.node(id))) {
      if (
        node.type === NODE_TYPE.STATE &&
        node.name === name &&
        node.machine_id === machine_id
      ) {
        return node
      }
    }
    throw new Error(`Node not found '${name}' from '${machine_id}'`)
  }

  getNodeByStruct(state: IStateStruct): Node | null {
    return this.getNodeByName(
      state[StateStructFields.STATE_NAME],
      state[StateStructFields.MACHINE_ID]
    )
  }
}
