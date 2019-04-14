import {
  TAsyncMachine,
  Transition,
  TransitionStepFields,
  TransitionStepTypes
} from 'asyncmachine'
import * as assert from 'assert/'
import { difference } from 'lodash'
import { ITransitionStep } from 'asyncmachine/types'
import {
  GraphNetwork,
  ITransitionData,
  LinkNode,
  MachineNode,
  StateNode,
  NODE_LINK_TYPE,
  PatchType,
  RELATION_TO_LINK_TYPE
} from './graph-network'

export type MachinesMap = Map<TAsyncMachine, string>

/**
 * Network class is responsible for syncing machines with their graph
 * representation. It has full access to the observed machines. It's used by
 * the logger module.
 *
 * Instances:
 * - server (logger)
 *
 * TODO extract to machine-network.ts
 * TODO detect ID collisions ?
 */
export default class MachineNetwork extends GraphNetwork {
  machines: MachinesMap
  machine_ids: { [index: string]: TAsyncMachine }
  transition_origin: TAsyncMachine

  constructor(machines?: TAsyncMachine[]) {
    super()
    this.machines = new Map() as MachinesMap
    this.machine_ids = {}
    if (machines) {
      for (const machine of machines) {
        this.addMachine(machine)
      }
    }
  }

  // TODO remove from BaseNetwork
  addMachine(machine: TAsyncMachine) {
    const id = machine.id(true)
    assert(id, 'Machine ID required')
    if (this.machine_ids[id]) return
    this.machines.set(machine, id)
    this.graph.setNode(id, new MachineNode(machine))
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
          // TODO keep in the MachineNode
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
    assert(names)
    // scan states
    let new_nodes = []
    let machine = this.machine_ids[machine_id]
    for (const name of names) {
      const machine_node = this.graph.node(machine.id(true)) as MachineNode
      assert(machine_node, 'machine node missing')
      const node = new StateNode(name, machine_node)

      this.graph.setNode(node.id, node)
      this.graph.setParent(node.id, machine.id(true))

      new_nodes.push(node)
    }

    // get edges from relations
    // all the nodes have to be parsed prior to this
    for (let node of new_nodes) {
      this.getRelationsFromNode(node, machine_id)
    }
  }

  private getRelationsFromNode(node: StateNode, machine_id: string) {
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
