import {
  StateStructFields,
  TransitionStepTypes,
  TransitionStepFields,
  StateRelations
} from 'asyncmachine/build/asyncmachine'
import Transition from 'asyncmachine/build/transition'
import {
  AsyncMachine,
  ITransitionStep,
  IStateStruct,
  StateChangeTypes
} from 'asyncmachine/src/types'
import Graph from 'graphs'
import * as uuid from 'uuid/v4'
import * as assert from 'assert/'
import * as EventEmitter from 'eventemitter3'
import { IDelta } from 'jsondiffpatch'
import { NODE_LINK_TYPE } from './network-json'

export type MachinesMap = Map<AsyncMachine, string>
export type NodeGraph = Graph<Node>

export interface IPatch {
  diff: IDelta
  type: PatchType
  machine_id: string
  logs?: ILogEntry[]
  data?: ITransitionData
  start_index?: number
  start_index_first?: number
}

export interface ITransitionData {
  type: StateChangeTypes
  states: string[]
  queue_machine_id: string
  machine_id: string
  auto: boolean
  touched?: { [machine_id: string]: string[] }
}

export interface ILogEntry {
  id: string
  msg: string
  level?: number
}

export enum PatchType {
  STATE_CHANGED,
  NEW_MACHINE,
  TRANSITION_START,
  TRANSITION_END,
  TRANSITION_STEP,
  PIPE,
  FULL_SYNC,
  MACHINE_REMOVED,
  QUEUE_CHANGED
}

// TODO not needed?
export interface ExternalNode {
  node: Node
  machine: AsyncMachine
}

export class Node {
  /**
   * Get the original state definition.
   */
  get state() {
    return this.machine.get(this.name)
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
      : this.machine.is(this.name)
  }

  get is_multi(): boolean {
    return this.machine.get(this.name).multi
  }

  get is_auto(): boolean {
    return this.machine.get(this.name).auto
  }

  get full_name(): string {
    return `${this.machine_id}:${this.name}`
  }

  constructor(
    public name: string,
    public machine: AsyncMachine,
    public machine_id: string
  ) {}

  /**
   * Bit mask with all the step types for this state during the current
   * transition.
   */
  step_style: TransitionStepTypes | null = null

  updateStepStyle(type: TransitionStepTypes) {
    // add this step type to the bit mask
    this.step_style |= type
    let types = TransitionStepTypes
    // exceptions are SET and NO_SET which are mutually exclusive
    // with a latest-wins policy
    if (type == types.SET && this.step_style & types.NO_SET)
      this.step_style ^= types.NO_SET
    else if (type == types.NO_SET && this.step_style & types.SET)
      this.step_style ^= types.SET
  }

  relations(node: Node | string): StateRelations[] {
    var name = node instanceof Node ? node.name : node.toString()
    return this.machine.getRelationsOf(this.name, name)
  }

  isFromState(state_struct: IStateStruct): boolean {
    let f = StateStructFields
    return (
      state_struct[f.MACHINE_ID] == this.machine_id &&
      state_struct[f.STATE_NAME] == this.name
    )
  }
}

/**
 * TODO inherit from Graph
 * TODO detect ID collisions
 * TODO switch the graph struct to cpettitt/graphlib
 *   maybe add support for the Map datastructure
 * TODO use jsongraph/json-graph-specification
 */
export default class Network extends EventEmitter {
  id: string
  graph: NodeGraph
  machines: MachinesMap
  machine_ids: { [index: string]: AsyncMachine }
  logs: ILogEntry[] = []
  machines_during_transition: Set<string> = new Set()
  private transition_links = new Map<Node, Set<Node>>()
  transition_origin: AsyncMachine

  get states() {
    return [...this.graph.set]
  }

  /**
   * TODO accept machines in the constructor
   */
  constructor() {
    super()
    this.graph = new Graph() as NodeGraph
    this.machines = new Map() as MachinesMap
    this.machine_ids = {}
    this.id = uuid()
  }

  addMachine(machine: AsyncMachine) {
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

    this.emit('change', PatchType.NEW_MACHINE, id)
  }

  // TODO
  removeMachine(machine: AsyncMachine) {
    assert(machine.id(), 'Machine ID required')
    const id = machine.id(true)
    if (!this.machine_ids[id]) return
    this.machines.delete(machine)
    delete this.machine_ids[id]
    this.unbindFromMachine(machine)
    this.unlinkPipedStates(machine)

    this.emit('change', PatchType.MACHINE_REMOVED, id)
  }

  isLinkTouched(from: Node, to: Node, relation: NODE_LINK_TYPE): boolean {
    // TODO handle the relation param
    return (
      this.transition_links.has(from) && this.transition_links.get(from).has(to)
    )
  }

  private bindToMachine(machine: AsyncMachine) {
    // bind to the state change
    // TODO bind to:
    // - piping (removed ones)
    // - transition start
    // - transition end / cancel
    // - adding / removing a state
    // TODO unbind on dispose
    // TODO group the same changes emitted by a couple of machines
    const id = machine.id(true)
    machine.on('change', () => this.emit('change', PatchType.STATE_CHANGED))
    machine.on('pipe', () => {
      this.linkPipedStates(machine)
      this.emit('change', PatchType.PIPE, id)
    })
    machine.on('transition-init', (transition: Transition) => {
      // TODO match both the machine and the transition (for lock based cancellation)
      if (!this.transition_origin) {
        this.transition_origin = machine
      }
      this.machines_during_transition.add(id)
      const transition_data: ITransitionData = {
        machine_id: transition.machine.id(true),
        queue_machine_id: transition.source_machine.id(true),
        states: transition.requested_states,
        auto: transition.auto,
        type: transition.type
      }
      // TODO this fires too early and produces an empty diff (reproduce)
      this.emit('change', PatchType.TRANSITION_START, id, transition_data)
    })
    machine.on('transition-end', (transition: Transition) => {
      let touched = {}
      // TODO match both the machine and the transition (for lock based cancellation)
      if (this.transition_origin === machine) {
        // if the first transition ended, cleanup everything
        this.transition_origin = null
        this.machines_during_transition.clear()
        this.transition_links.clear()
        // TODO potentially skips other queue sources (from nested transitions)
        const source_machine = transition.source_machine.id(true)
        if (!touched[source_machine]) touched[source_machine] = []
        for (let node of this.graph.values()) {
          if (!node.step_style) continue
          if (!touched[node.machine_id]) touched[node.machine_id] = []
          touched[node.machine_id].push(node.name)
          node.step_style = null
        }
      }
      const transition_data: ITransitionData = {
        machine_id: transition.machine.id(true),
        queue_machine_id: transition.source_machine.id(true),
        states: transition.requested_states,
        auto: transition.auto,
        type: transition.type,
        touched: touched
      }
      this.emit('change', PatchType.TRANSITION_END, id, transition_data)
    })
    machine.on('transition-step', (...steps) => {
      this.parseTransitionSteps(machine.id(true), ...steps)
    })
    machine.on('queue-changed', () =>
      this.emit('change', PatchType.QUEUE_CHANGED)
    )
    machine.logHandler((msg, level) => {
      machine.logHandlerDefault(msg.toString(), level)
      // TODO no hardcoded level
      if (level > 2) {
        return
      }
      this.logs.push({ id, msg, level })
    })
  }

  dispose() {
    // TODO unbind listeners
  }

  private parseTransitionSteps(
    machine_id: string,
    ...steps: ITransitionStep[]
  ) {
    let fields = TransitionStepFields
    let types = TransitionStepTypes
    for (let step of steps) {
      let type = step[fields.TYPE]

      let node = this.getNodeByStruct(step[fields.STATE])
      node.updateStepStyle(type)

      if (step[fields.SOURCE_STATE]) {
        // TODO handle the "Any" state
        let source_node = this.getNodeByStruct(step[fields.SOURCE_STATE])
        if (type != types.PIPE)
          // dont mark the source node as piped, as it already has
          // styles
          source_node.updateStepStyle(type)
        else
          // be a little ahead of time here, for better styling
          this.machines_during_transition.add(node.machine_id)

        // mark the link as touched
        // TODO create tmp links for active_transitions between states
        if (!this.transition_links.get(source_node))
          this.transition_links.set(source_node, new Set<Node>())
        this.transition_links.get(source_node).add(node)
      }
    }

    this.emit('change', PatchType.TRANSITION_STEP, machine_id)
  }

  private statesToNodes(names: string[], machine_id: string) {
    // scan states
    let new_nodes = []
    let machine = this.machine_ids[machine_id]
    for (let name of names) {
      let node = new Node(name, machine, machine_id)
      this.graph.add(node)
      new_nodes.push(node)
    }

    // get edges from relations
    // all the nodes have to be parsed prior to this
    for (let node of new_nodes) this.getRelationsFromNode(node, machine_id)
  }

  private getRelationsFromNode(node: Node, machine_id: string) {
    // TODO limit to 'requires' and 'drops' ?
    let machine = this.machine_ids[machine_id]
    let state = node.state
    assert(state)
    for (let relation of machine.getRelationsOf(node.name)) {
      for (let target_name of state[relation]) {
        let target = this.getNodeByName(target_name, machine_id)
        assert(target)
        this.graph.link(node, target)
      }
    }
  }

  getNodeByName(name: string, machine_id: string): Node {
    for (let node of this.graph.set) {
      if (node.name === name && node.machine_id === machine_id) {
        return node
      }
    }
    throw new Error(`Node not found ${name} from '${machine_id}'`)
  }

  getNodeByStruct(state: IStateStruct): Node | null {
    return this.getNodeByName(
      state[StateStructFields.STATE_NAME],
      state[StateStructFields.MACHINE_ID]
    )
  }

  protected linkPipedStates(machine: AsyncMachine) {
    for (let state in machine.piped) {
      for (let target of machine.piped[state]) {
        const source_state = this.getNodeByName(
          state,
          this.machines.get(machine)
        )
        const target_machine = this.machines.get(target.machine)
        if (!target_machine) continue
        let target_state = this.getNodeByName(
          target.state,
          this.machines.get(target.machine)
        )
        if (!target_state) continue
        this.graph.link(source_state, target_state)
      }
    }
  }
}