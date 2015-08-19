import * as am from 'asyncmachine'
import Graph from 'graphs'
import uuid from 'node-uuid'
import assert from 'assert'

interface MachinesMap
        extends Map<am.AsyncMachine, string> {}
    
interface NodeGraph
        extends Graph<Node> {}

export interface ExternalNode {
    node: Node;
    machine: am.AsyncMachine;
}

export class Node {

    externals: ExternalNode[];
    machines: MachinesMap;
    id: string;
    machine: am.AsyncMachine;
    name: string;
    state: boolean;

    constructor(name, machine, machines) {
        this.id = uuid.v4()
        this.machines = machines
        this.machine = machine
        this.name = name
        this.externals = []
        this.state = machine.is(name)
    }

    get() {
        return this.machine.get(this.name)
    }

    duringNegotiation() {
        // TODO
    }

    duringTransition() {
        // TODO
    }

    get machine_id() {
        return this.machines.get(this.machine)
    }
}


export default class StateGraph {

    // TODO this cant be extended
    graph: NodeGraph;
    machines: MachinesMap;
    events: string[];

    get nodes() {
        var nodes = []
        for (let node of this.graph.set) {
            nodes.push(node)
        }
        return nodes
    }

    constructor() {
        this.graph = <NodeGraph>new Graph();
        this.machines = <MachinesMap>new Map()
        this.events = []
    }

    addMachine(machine) {
        this.machines.set(machine, uuid.v4())
        this.statesToNodes(machine)
        for (let [machine, id] of this.machines) {
            this.bindToMachine(machine)
            // TODO support dynamic piping/unpiping
            this.scanReferences(machine)
        }
    }

    private bindToMachine(machine: am.AsyncMachine) {
        // bind to the state change
        machine.on('change', previous => {
            for (let state of machine.diffStates(previous, machine.is())) {
                var node = this.getNodeByName(state, machine)
                node.state = false;
            }
            for (let state of machine.diffStates(machine.is(), previous)) {
                var node = this.getNodeByName(state, machine)
                node.state = true;
            }
        })
    }

    dispose() {
        // TODO unbind listeners

    }

    private statesToNodes(machine) {
        // scan states
        let new_nodes = []
        for (let name of machine.states_all) {
            let node = new Node(name, machine, this.machines)
            this.graph.add(node)
            new_nodes.push(node)
        }

        // get edges from relations
        // all the nodes have to be parsed prior to this
        for (let node of new_nodes)
            this.getRelationsFromNode(node, machine)
    }

    private getRelationsFromNode(node: Node, machine: am.AsyncMachine) {
        // TODO limit to 'requires' and 'drops' ?
        let state = node.get()
        assert(state)
        for (let relation in state) {
            if (relation == 'auto')
                continue

            let targets = state[relation]

            for (let target_name of targets) {
                let target = this.getNodeByName(target_name, machine)
                assert(target)
                this.graph.link(node, target)
            }
        }
    }

    getNodeByName(name, machine) {
        for (let node of this.graph.set) {
            if (node.name === name && node.machine === machine)
                return node
        }
    }

    private scanReferences(machine: am.AsyncMachine) {
        for (let state in machine.piped) {
            var data = machine.piped[state]

            let source_state = this.getNodeByName(state, machine)
            let target_state = this.getNodeByName(data.state, data.machine)
            if (!target_state)
                continue
            this.graph.link(source_state, target_state)
        }
    }

    machine_id(machine) {
        return `machine-${this.machines.get(machine)}`
    }
}