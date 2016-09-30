import AsyncMachine, {
    StateStructFields,
    TransitionStepTypes,
    TransitionTouchFields
} from 'asyncmachine'
import {
    ITransitionTouch,
    IStateStruct
} from '../node_modules/asyncmachine/build/types'
// TODO remove once fixed in webstorm
import Transition from '../node_modules/asyncmachine/build/transition'
import Graph from 'graphs'
import * as uuid from 'node-uuid'
import * as assert from 'assert/'
import * as EventEmitter from 'eventemitter3'
import { IDelta as IJsonDiff } from 'jsondiffpatch'
import { NODE_LINK_TYPE } from "./network-json";

type MachinesMap = Map<AsyncMachine, string>;
type NodeGraph = Graph<Node>

export type Diff = {
    diff: IJsonDiff,
    type: ChangeType,
    logs: LogEntry[]
}

export type LogEntry = {
    id: string,
    msg: string
}

export interface ExternalNode {
    node: Node;
    machine: AsyncMachine;
}

export enum ChangeType {
    STATE,
    NEW_MACHINE,
    TRANSITION_START,
    TRANSITION_END,
    TRANSITION_STEP,
    PIPE
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
        return this.machine.is(this.name)
    }
    
    get full_name(): string {
        return `${this.machine_id}:${this.name}`
    }

    constructor(
        public name: string,
        public machine: AsyncMachine,
        public machine_id: string) {
    }

    /**
     * Bit mask with all the step types for this state during the current
     * transition.
     */
    step_style: TransitionStepTypes | null = null;

    updateStepStyle(type: TransitionStepTypes) {
        // add this step type to the bit mask
        this.step_style |= type
        // exceptions are SET and NO_SET which are mutually exclusive
        // with a latest-wins policy
        if (type == TransitionStepTypes.SET)
            this.step_style ^= TransitionStepTypes.NO_SET
        else if (type == TransitionStepTypes.NO_SET)
            this.step_style ^= TransitionStepTypes.SET
    }

    relations(node: Node | string): string[] {
        var name = node instanceof Node
            ? node.name : node.toString()
        return this.machine.getRelationsOf(this.name, name) as string[]
    }

    isFromState(state_struct: IStateStruct): boolean {
        let f = StateStructFields
        return (state_struct[f.MACHINE_ID] == this.machine_id
            && state_struct[f.STATE_NAME] == this.name)
    }
}


/**
 * TODO inherit from Graph
 */
export default class Network extends EventEmitter {
    id: string;
    graph: NodeGraph;
    machines: MachinesMap;
    machine_ids: { [index: string]: AsyncMachine };
    logs: LogEntry[] = []

    private transitionStepIndexes = new Map<Transition, number>()
    transitions: Transition[] = []
    private transition_links = new Map<Node, Set<Node>>()

    get states() {
        return [...this.graph.set]
    }

    constructor() {
        super()
        this.graph = new Graph() as NodeGraph
        this.machines = new Map() as MachinesMap
        this.machine_ids = {}
        this.id = uuid.v4()
    }

    addMachine(machine: AsyncMachine) {
        // TODO check for duplicates first
        // TODO deterministic IDs!!!
        var id = machine.id() || uuid.v4()
        this.machines.set(machine, id)
        this.machine_ids[id] = machine
        this.statesToNodes(machine.states_all, id)
        this.bindToMachine(machine)

        // TODO this is required, but should be checked
        for (let [machine, id] of this.machines) {
            this.linkPipedStates(machine)
        }

        this.emit('change', ChangeType.NEW_MACHINE)
    }

    isLinkTouched(from: Node, to: Node, relation: NODE_LINK_TYPE): boolean {
        // TODO handle the relation param
        return (this.transition_links.has(from)
            && this.transition_links.get(from).has(to))
    }

    private bindToMachine(machine: AsyncMachine) {
        // bind to the state change
        // TODO bind to:
        // - piping (removed ones)
        // - transition start
        // - transition end / cancel
        // - adding / removing a state
        // TODO unbind on dispose
        // TODO group the same changes emitted by couple of machines
        // machine.on('change', () => this.emit('change', ChangeType.STATE))
        machine.on('pipe', () => {
            this.linkPipedStates(machine)
            this.emit('change', ChangeType.PIPE, machine.id())
        })
        machine.on('transition-init', (transition) => {
            this.logTransition('start', transition)
            // TODO this fires too early and produces an empty diff
            this.emit('change', ChangeType.TRANSITION_START, machine.id())
        })
        machine.on('transition-end', (transition) => {
            // TODO highlight all the invoved state machines
            this.logTransition('end', transition)
            this.emit('change', ChangeType.TRANSITION_END, machine.id())
        })
        machine.logHandler( (msg, level) => {
            machine.logHandlerDefault(msg.toString(), level)
            if (level > 2)
                return
            this.logs.push({
                id: machine.id(),
                msg: msg
            })
        })
    }

    dispose() {
        // TODO unbind listeners
    }

    /**
     * TODO handle duplicates
     */
    private logTransition(type: 'start' | 'end', transition: Transition) {
        if (type == 'start') {
            // parse steps from the parent transition
            if (this.transitionStepIndexes.size) {
                this.parseTransitionSteps(this.transitions[this.transitions.length - 1])
            }
            this.transitionStepIndexes.set(transition, 0)
            this.transitions.push(transition)
        } else {
            // parse steps from transition which just ended and remove it
            this.parseTransitionSteps(transition)
            this.transitionStepIndexes.delete(transition)
            assert(transition === this.transitions.pop())
        }

        if (!this.transitions.length) {
            this.transition_links.clear()
            for (let node of this.graph.set)
                node.step_style = null
        }
    }

    private parseTransitionSteps(transition: Transition) {
        let index = this.transitionStepIndexes.get(transition)
        let steps = transition.steps.slice(index)
        let fields = TransitionTouchFields
        let types = TransitionStepTypes
        let prev_type: TransitionStepTypes
        for (let step of steps) {
            let type = step[fields.TYPE]
            if (prev_type === undefined || prev_type != types.REQUESTED || type != prev_type)
                this.emit('change', ChangeType.TRANSITION_STEP)

            let node = this.getNodeByStruct(step[fields.STATE])
            node.updateStepStyle(type)

            if (step[fields.SOURCE_STATE]) {
                // TODO handle the "Any" state
                let source_node = this.getNodeByStruct(step[fields.SOURCE_STATE])
                // dont mark the source node as piped, as it already has styles
                if (type != types.PIPE)
                    source_node.updateStepStyle(type)

                // add the link
                if (!this.transition_links.get(source_node))
                    this.transition_links.set(source_node, new Set<Node>())
                this.transition_links.get(source_node).add(node)
            }

            prev_type = type
        }

        this.emit('change', ChangeType.TRANSITION_STEP)
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
        for (let node of new_nodes)
            this.getRelationsFromNode(node, machine_id)
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

    getNodeByName(name: string, machine_id: string): Node | null {
        // for (let node of this.graph.set) {
        var ret
        this.graph.set.forEach( node => {
            if (node.name === name && node.machine_id === machine_id)
                ret = node
        })
        return ret
    }

    getNodeByStruct(state: IStateStruct): Node | null {
        return this.getNodeByName(
            state[StateStructFields.STATE_NAME],
            state[StateStructFields.MACHINE_ID])
    }

    protected linkPipedStates(machine: AsyncMachine) {
        for (let state in machine.piped) {
            for (let target of machine.piped[state]) {

                let source_state = this.getNodeByName(state, this.machines.get(machine))
                let target_state = this.getNodeByName(target.state,
                    this.machines.get(target.machine))
                if (!target_state)
                    continue
                this.graph.link(source_state, target_state)
            }
        }
    }
}
