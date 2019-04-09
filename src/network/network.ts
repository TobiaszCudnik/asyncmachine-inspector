import {
  StateStructFields,
  Transition,
  TransitionStepFields,
  TransitionStepTypes
} from 'asyncmachine'
import {
  IStateStruct,
  ITransitionStep,
  MutationTypes,
  QueueRowFields,
  TAsyncMachine
} from 'asyncmachine/types'
import { Graph } from 'graphlib'
import { difference } from 'lodash'
import * as uuid from 'uuid/v4'
import * as assert from 'assert/'
import * as EventEmitter from 'eventemitter3'
import { IDelta } from 'jsondiffpatch'
import { IEdge } from 'cinea-graphlib'

export type MachinesMap = Map<TAsyncMachine, string>
export type NodeGraph = Graph<Node | MachineNode, LinkNode, {}, NODE_LINK_TYPE>

// TODO rename to UIPatch, move to /src/network/json
export interface IPatch {
  diff: IDelta
  type: PatchType
  machine_id: string
  logs?: ILogEntry[]
  data?: ITransitionData
  summary?: string
  // TODO used?
  start_index?: number
  start_index_first?: number
}

export interface ITransitionData {
  type: MutationTypes
  states: string[]
  queue_machine_id: string
  machine_id: string
  auto: boolean
  touched?: { [machine_id: string]: string[] }
}

export interface ILogEntry {
  id: string
  msg: string
  level: number
}

// move to JSON
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

export interface GraphNode {
  type: NODE_TYPE
}

export class LinkNode implements GraphNode {
  readonly type = NODE_TYPE.LINK
  link_type: NODE_LINK_TYPE
  is_touched = false
  to_id: string
  from_id: string

  constructor(link_type: NODE_LINK_TYPE, from_id: string, to_id: string) {
    this.link_type = link_type
    this.from_id = from_id
    this.to_id = to_id
    this.link_type = link_type
  }
}

export class Node implements GraphNode {
  readonly type = NODE_TYPE.STATE
  name: string
  machine: TAsyncMachine
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
    this.name = name
    this.machine = machine.machine
    this.machine_id = machine.id
    this.machine_node = machine
  }
}

export class MachineNode implements GraphNode {
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
  // overrides for machines during transition
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

  // TODO move graph, use json
  get machines_during_transition(): MachineNode[] {
    const real = this.machine_nodes.filter(node => node.during_transition)
    const manual = this.machines_during_transition_manual.map(
      id => this.graph.node(id) as MachineNode
    )
    return [...real, ...manual]
  }

  constructor() {
    super()
    this.graph = new Graph()
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

/**
 * Network class is responsible for syncing machines with their graph
 * representation. It has full access to the observed machines. It's used by
 * the logger module.
 *
 * Instances:
 * - server (logger)
 *
 * TODO detect ID collisions
 */
export default class Network extends GraphNetwork {
  machines: MachinesMap
  machine_ids: { [index: string]: TAsyncMachine }
  transition_origin: TAsyncMachine

  constructor(machines?: TAsyncMachine[]) {
    super()
    this.machines = new Map() as MachinesMap
    this.machine_ids = {}
    this.id = uuid()
    if (machines) {
      for (const machine of machines) {
        this.addMachine(machine)
      }
    }
  }

  // TODO remove from BaseNetwork
  addMachine(machine: TAsyncMachine) {
    assert(machine.id(), 'Machine ID required')
    const id = machine.id(true)
    if (this.machine_ids[id]) return
    this.machines.set(machine, id)
    this.machine_ids[id] = machine
    this.statesToNodes(machine.states_all, id)
    this.bindToMachine(machine)

    for (let [machine, id] of this.machines) {
      this.linkPipedStates(machine)
    }

    if (this.machines.size == 1) {
      this.emit('ready')
    }
    this.emit('change', PatchType.MACHINE_ADDED, id)
  }

  // TODO remove from BaseNetwork
  removeMachine(machine: TAsyncMachine) {
    assert(machine.id(), 'Machine ID required')
    const id = machine.id(true)
    if (!this.machine_ids[id]) return
    this.machines.delete(machine)
    delete this.machine_ids[id]
    this.unbindFromMachine(machine)
    this.unlinkPipedStates(machine)

    this.emit('change', PatchType.MACHINE_REMOVED, id)
  }

  unbindFromMachine(machine: TAsyncMachine) {
    throw new Error('not implemented')
  }

  unlinkPipedStates(machine: TAsyncMachine) {
    throw new Error('not implemented')
    // TODO this.emit('change', PatchType.PIPE_REMOVED, machine_id)
  }

  // isLinkTouched(from: Node, to: Node, relation: NODE_LINK_TYPE): boolean {
  //   // TODO handle the relation param
  //   return (
  //     this.transition_links.has(from) && this.transition_links.get(from).has(to)
  //   )
  // }

  private bindToMachine(machine: TAsyncMachine) {
    // bind to the state change
    // TODO bind to:
    // - piping (removed ones)
    // - transition start
    // - transition end / cancel
    // - adding / removing a state
    // TODO unbind on dispose
    // TODO group the same changes emitted by a couple of machines
    const machine_id = machine.id(true)
    machine.on('tick', (states_before: string[]) => {
      const changed_ids = [
        ...difference(states_before, machine.is()),
        ...difference(machine.is(), states_before)
      ].map(id => {
        return this.getNodeByName(id, machine_id).full_name
      })
      this.emit('change', PatchType.STATE_CHANGED, machine_id, changed_ids)
    })
    machine.on('pipe', () => {
      const links = this.linkPipedStates(machine)
      // TODO add the ID of the link itself to the IDs of the linked nodes
      this.emit('change', PatchType.PIPE, machine_id, links)
    })
    machine.on('transition-init', (transition: Transition) => {
      // TODO match both the machine and the transition (for lock based cancellation)
      if (!this.transition_origin) {
        this.transition_origin = machine
      }
      const transition_data: ITransitionData = {
        machine_id: transition.machine.id(true),
        queue_machine_id: transition.source_machine.id(true),
        states: transition.requested_states,
        auto: transition.auto,
        type: transition.type
      }
      // TODO this fires too early and produces an empty diff (reproduce)
      this.emit(
        'change',
        PatchType.TRANSITION_START,
        machine_id,
        transition_data
      )
    })
    machine.on('transition-end', (transition: Transition) => {
      // TODO match both the machine and the transition (for lock based cancellation)
      if (this.transition_origin === machine) {
        // if the first transition ended, cleanup everything
        this.transition_origin = null
        // TODO outer transition happens to finish BEFORE the inner ones
        //  honor parent transition ID?
        // manually clear touch flags for all the edges
        for (const edge of this.graph.edges()) {
          this.graph.edge(edge).is_touched = false
        }
        // TODO potentially skips other queue sources (from nested transitions)
      }
      const transition_data: ITransitionData = {
        machine_id: transition.machine.id(true),
        queue_machine_id: transition.source_machine.id(true),
        states: transition.requested_states,
        auto: transition.auto,
        type: transition.type
      }
      this.emit('change', PatchType.TRANSITION_END, machine_id, transition_data)
    })
    machine.on('transition-step', (...steps) => {
      this.parseTransitionSteps(machine_id, ...steps)
    })
    machine.on('queue-changed', () =>
      this.emit('change', PatchType.QUEUE_CHANGED, machine_id)
    )
    // TODO dispose
    machine.log_handlers.push((msg, level) => {
      // TODO accept all the logs once Inspector supports filtering
      if (level > 2) return
      this.logs.push({ id: machine_id, msg, level })
    })
  }

  protected parseTransitionSteps(
    machine_id: string,
    ...steps: ITransitionStep[]
  ) {
    const fields = TransitionStepFields
    const types = TransitionStepTypes
    const changed_nodes = new Set<string>()
    for (let step of steps) {
      let type = step[fields.TYPE]

      let node = this.getNodeByStruct(step[fields.STATE])
      changed_nodes.add(node.full_name)
      this.updateStepStyle(node, type)

      if (step[fields.SOURCE_STATE]) {
        // TODO handle the "Any" state
        let source_node = this.getNodeByStruct(step[fields.SOURCE_STATE])
        if (type != types.PIPE) {
          changed_nodes.add(source_node.full_name) // TODO id?
          // dont mark the source node as piped, as it already has
          // styles
          this.updateStepStyle(source_node, type)
        }
        // stay a little bit ahead of time here, for better styling
        else {
          // TODO
          this.machines_during_transition_manual.push(node.machine_id)
        }

        // mark the link as touched
        const edge = this.graph.outEdges(source_node.id, node.id)
        // TODO check if not null
        edge[0].is_touched = true
        const link_type = this.getLinkType(source_node, node)
        changed_nodes.add(this.createLinkID(source_node, node, link_type))
      }
    }

    this.emit('change', PatchType.TRANSITION_STEP, machine_id, [
      ...changed_nodes
    ])
  }

  dispose() {
    // TODO unbind listeners
  }

  private statesToNodes(names: string[], machine_id: string) {
    // scan states
    let new_nodes = []
    let machine = this.machine_ids[machine_id]
    for (let name of names) {
      let node = new Node(name, this.nodes[machine.id()])
      this.graph.setNode(node.id, node)
      new_nodes.push(node)
    }

    // get edges from relations
    // all the nodes have to be parsed prior to this
    for (let node of new_nodes) {
      this.getRelationsFromNode(node, machine_id)
    }
  }

  private getRelationsFromNode(node: Node, machine_id: string) {
    let machine = this.machine_ids[machine_id]
    let state = node.state
    assert(state)
    for (const relation of machine.getRelationsOf(node.name)) {
      const link_type = RELATION_TO_LINK_TYPE[
        relation.toString()
      ] as NODE_LINK_TYPE
      for (const target_name of state[relation]) {
        const target = this.getNodeByName(target_name, machine_id)
        assert(target)
        const edge = {
          v: node.id,
          w: target.id,
          name: link_type.toString()
        }
        this.graph.setEdge(edge, new LinkNode(link_type, node.id, target.id))
      }
    }
  }

  protected linkPipedStates(machine: TAsyncMachine): [string, string][] {
    const linked = []
    for (let state in machine.piped) {
      for (let target of machine.piped[state]) {
        const source_state = this.getNodeByName(
          state,
          this.machines.get(machine)
        )
        const target_machine = this.machines.get(target.machine)
        if (!target_machine) {
          continue
        }
        let target_state = this.getNodeByName(
          target.state,
          this.machines.get(target.machine)
        )
        if (!target_state) {
          continue
        }
        // TODO from(source_state).has(target_state)
        // @ts-ignore
        const hasEdge = this.graph.hasEdge(
          source_state.id,
          target_state.id,
          NODE_LINK_TYPE.PIPE
        )
        if (!hasEdge) {
          this.graph.setEdge(
            source_state.id,
            target_state.id,
            new LinkNode(NODE_LINK_TYPE.PIPE, source_state.id, target_state.id),
            NODE_LINK_TYPE.PIPE
          )
          linked.push([source_state.id, target_state.id])
        }
      }
    }
    return linked
  }

  toString() {
    return [...this.machines.keys()].map(m => m.toString()).join('')
  }
}
