import * as jsondiffpatch from 'jsondiffpatch'
import * as assert from 'assert'
import Network, {
    Node as GraphNode
} from './network'
import AsyncMachine from 'asyncmachine'

/**
 * Produce JSON from a Network instance, ready to be consumed by the UI layer.
 */
export abstract class NetworkJsonFactory<Json, Machine, State, Link> {
    // list of created machine nodes
    machine_ids: Set<string>;
    // map of machine IDs to machine nodes
    machine_nodes: {
        [index: string]: Machine
    };
    // map of graph nodes to their d3 nodes
    nodes: Map<GraphNode, State>;
    // map of created external nodes
    // also used for creating links between machine nodes
    externals: Map<GraphNode, Set<GraphNode>>;

    json: Json;

    // TODO use enum for the source relations
    relations_map = {
        requires: NODE_LINK_TYPE.REQUIRES,
        drops: NODE_LINK_TYPE.BLOCKS,
        implies: NODE_LINK_TYPE.IMPLIES,
        order: NODE_LINK_TYPE.ORDER,
        piped: NODE_LINK_TYPE.PIPED_IN
    }
    
    constructor(
            public network: Network) {
        assert(network)
    }

    generateJson(): Json {
        // TODO cleanup at the end
        this.json = this.initJson()
        this.machine_ids = new Set
        this.nodes = new Map
        this.machine_nodes = {}
        this.externals = new Map

        // process nodes
        this.network.graph.forEach(
            node => this.parseNode(node) )
        this.network.graph.traverseAll(
            (from, to) => this.parseLink(from, to) )

        return this.json;
    }

    // TODO machine_id probably duplicates machine.id() now
    parseMachine(machine: AsyncMachine, machine_id: string) {
        var machine_node = this.createMachineNode(machine, machine_id)
        this.addMachineNode(machine_node)
        this.machine_ids.add(machine_id)
        this.machine_nodes[machine_id] = machine_node
    }

    parseNode(graph_node: GraphNode) {
        var machine = graph_node.machine
        var machine_node;

        // handle a machine node TODO extract
        if (!this.machine_ids.has(graph_node.machine_id)) {
            this.parseMachine(machine, graph_node.machine_id)
        } else {
            machine_node = this.machine_nodes[graph_node.machine_id]
        }

        var node = this.createStateNode(graph_node)
        
        // add to json
        this.addStateNode(node)
        
        // index the reference
        this.nodes.set(graph_node, node)
    }

    parseLink(from: GraphNode, to: GraphNode) {
        // create a link for every relation
        var relations = from.relations(to)
        for (let relation of relations) {
            let relation_type = this.relations_map[relation]
            assert(relation_type !== undefined)
            this.addLinkNode(this.createLinkNode(from, to, relation_type))
        }
        // TODO support piping properly, distinguish types
        if (!relations.length) {
            this.addLinkNode(this.createLinkNode(from, to, NODE_LINK_TYPE.PIPED_IN))
        }
    }

    protected getMachineName(machine) {
        return machine.id().replace(['[', ']', ' '], '');
    }
    
    abstract initJson(): Json;

    abstract addMachineNode(node: Machine);
    abstract addStateNode(node: State);
    abstract addLinkNode(node: Link);

    abstract createMachineNode(machine: AsyncMachine, machine_id: string): Machine;
    abstract createStateNode(node: GraphNode): State;
    abstract createLinkNode(from: GraphNode, to: GraphNode, relation: NODE_LINK_TYPE): Link;
}

/**
 * TODO make it a stream
 */
export abstract class JsonDiffFactory<T extends NetworkJsonFactory, Json> {
    diffpatcher: jsondiffpatch.IDiffPatch;
    previous_json: Json;
    
    constructor(
            public network: T) {
        assert(network)
        this.diffpatcher = jsondiffpatch.create({
            objectHash: this.objectHash()
        })
    }

    objectHash() {
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

        assert(base_json, "Base JSON required to create a diff")

        this.generateJson()
        
        // generate the diff
        return this.diffpatcher.diff(base_json, this.previous_json)
    }
}

export enum NODE_LINK_TYPE {
    REQUIRES,
    BLOCKS,
    ORDER,
    IMPLIES,
    PIPED_IN,
    PIPED_OUT,
    PIPED_INVERTED_IN,
    PIPED_INVERTED_OUT
}

export enum OBJECT_TYPE {
    MACHINE,
    STATE,
    LINK
}
