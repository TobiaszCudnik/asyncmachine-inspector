import * as am from 'asyncmachine'
import Graph from 'graphs'
import * as uuid from 'node-uuid'
import * as assert from 'assert'
// TODO fix the declaration
// import * as EventEmitter from 'eventemitter3'
import * as EventEmitter from 'eventemitter3'

type MachinesMap = Map<am.AsyncMachine, string>;
type NodeGraph = Graph<Node>

export interface ExternalNode {
    node: Node;
    machine: am.AsyncMachine;
}

export class Node {

    /**
     * Get the original state definition.
     */
    get state(): am.IState {
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
        public machine: am.AsyncMachine,
        public machine_id: string) {
    }

    relations(node: Node | string): string[] {
        var name = node instanceof Node
            ? node.name : node.toString()
        return this.machine.getRelations(this.name, name)
    }
}


/**
 * TODO inherit from Graph
 */
export default class Network extends EventEmitter {
    id: string;
    graph: NodeGraph;
    machines: MachinesMap;
    machine_ids: { [index: string]: am.AsyncMachine };

    get states() {
        return [...this.graph.set]
    }

    constructor() {
        super()
        this.graph = <NodeGraph>new Graph()
        this.machines = <MachinesMap>new Map()
        this.machine_ids = {}
        this.id = uuid.v4()
    }

    addMachine(machine: am.AsyncMachine) {
        // TODO check for duplicates first
        // TODO deterministic IDs!!!
        var id = machine.debug_prefix || uuid.v4()
        this.machines.set(machine, id)
        this.machine_ids[id] = machine
        this.statesToNodes(machine.states_all, id)
        this.bindToMachine(machine)

        // TODO this is required, but should be checked
        for (let [machine, id] of this.machines) {
            this.linkPipedStates(machine)
        }
    }

    private bindToMachine(machine: am.AsyncMachine) {
        // bind to the state change
        // TODO bind to:
        // - piping (new and removed ones)
        // - transition start
        // - transition end / cancel
        // TODO unbind on dispose
        // TODO group the same changes emitted by couple of machines
        machine.on('change', () => this.emit('change'))
    }

    dispose() {
        // TODO unbind listeners
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
        for (let relation in state) {
            if (relation == 'auto')
                continue

            let targets = state[relation]

            for (let target_name of targets) {
                let target = this.getNodeByName(target_name, machine_id)
                assert(target)
                this.graph.link(node, target)
            }
        }
    }

    getNodeByName(name: string, machine_id: string) {
        // for (let node of this.graph.set) {
        var ret
        this.graph.set.forEach( node => {
            if (node.name === name && node.machine_id === machine_id)
                ret = node
        })
        return ret
    }

    protected linkPipedStates(machine: am.AsyncMachine) {
        for (let state in machine.piped) {
            var data = machine.piped[state]

            let source_state = this.getNodeByName(state, this.machines.get(machine))
            let target_state = this.getNodeByName(data.state,
                this.machines.get(data.machine))
            if (!target_state)
                continue
            this.graph.link(source_state, target_state)
        }
    }
}
