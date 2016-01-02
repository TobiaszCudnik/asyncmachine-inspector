import * as jsondiffpatch from 'jsondiffpatch'
import StateGraph, {
    Node as GraphNode
} from "./stategraph";
import assert from 'assert'



/**
 * Produce JSON from StateGraph, ready to be consumed by the D3 UI layer.
 */
export default class D3GraphJson {
    // list of created machine nodes
    machine_ids: Set<MachineId>;
    // map of machine IDs to machine nodes
    machine_nodes: {
        [index: string]: Machine
    };
    // map of graph nodes to their d3 nodes
    nodes: Map<GraphNode, State>;
    // map of created external nodes
    // also used for creating links between machine nodes
    externals: Map<GraphNode, Set<GraphNode>>;

    json: ID3GraphJson;

    // TODO use enum for the source relations
    relations_map = {
        requires: NODE_LINK_TYPE.REQUIRES,
        blocks: NODE_LINK_TYPE.BLOCKS,
        implies: NODE_LINK_TYPE.IMPLIES,
        order: NODE_LINK_TYPE.ORDER,
        piped: NODE_LINK_TYPE.PIPED_IN
    }
    
    constructor(
            public graph: StateGraph) {
        assert(graph)
    }

    generateJson(): ID3GraphJson {
        // TODO cleanup at the end
        this.json = {
            nodes: [],
            links: [],
            groups: []
        }
        this.machine_ids = new Set
        this.nodes = new Map
        this.machine_nodes = {}
        this.externals = new Map

        // process nodes
        this.graph.graph.forEach( node => this.parseNode(node) )
        this.graph.graph.traverseAll( (from, to) => this.parseLink(from, to) )

        return this.json;
    }

    parseNode(graph_node: GraphNode) {
        var machine = graph_node.machine
        var machine_node;

        // handle a machine node TODO extract
        if (!this.machine_ids.has(graph_node.machine_id)) {
            machine_node = {
                object_type: OBJECT_TYPE.MACHINE,
                name: this.getMachineName(machine),
                leaves: [],
                id: graph_node.machine_id
            }
            this.json.groups.push(machine_node)
            this.machine_ids.add(graph_node.machine_id)
            this.machine_nodes[graph_node.machine_id] = machine_node
        } else {
            machine_node = this.machine_nodes[graph_node.machine_id]
        }

        var node = {
            object_type: OBJECT_TYPE.STATE,
            name: graph_node.name,
            machine_id: graph_node.machine_id,
            auto: graph_node.state.auto,
            negotiating: false, // TODO
            is_set: graph_node.is_set,
            index: this.json.nodes.length
        }
        
        // add to json
        this.json.nodes.push(node)
        machine_node.leaves.push(node.index)
        
        // index the reference
        this.nodes.set(graph_node, node)
    }

    parseLink(from: GraphNode, to: GraphNode) {
        // create a link for every relation
        var relations = from.relations(to)
        for (let relation of from.relations(to)) {
            this.json.links.push({
                object_type: OBJECT_TYPE.LINK,
                source_name: from.name,
                target_name: to.name,
                source: this.nodes.get(from).index,
                target: this.nodes.get(to).index,
                type: this.relations_map[relation],
                active: false   // TODO
            })
        }
        // TODO support piping properly, distinguish types
        if (!relations.length) {
            this.json.links.push({
                object_type: OBJECT_TYPE.LINK,
                source_name: from.name,
                target_name: to.name,
                source: this.nodes.get(from).index,
                target: this.nodes.get(to).index,
                type: this.relations_map.piped,
                active: false   // TODO
            })
        }
    }

    protected getMachineName(machine) {
        return (machine.debug_prefix || '')
            .replace(['[', ']', ' '], '');
    }
}

/**
 * TODO make it a steram
 */
export class D3JsonDiffFactory {
    diffpatcher: jsondiffpatch;
    previous_json: ID3GraphJson;
    
    constructor(
            public graph: D3GraphJson) {
        this.diffpatcher = jsondiffpatch.create({
            objectHash: this.objectHash()
        })
    }

    objectHash() {
        return objectHash;
    }

    generateJson() {
        // generate a new json and keep it as the last one
        this.previous_json = this.graph.generateJson()
    }

    generateDiff(base_json?: ID3GraphJson) {
        base_json = base_json || this.previous_json

        assert(base_json, "Base JSON required to create a diff")

        this.generateJson()
        
        // generate the diff
        return this.diffpatcher.diff(base_json, this.previous_json)
    }
}

export function objectHash(obj) {
    switch(obj.type) {
        case OBJECT_TYPE.MACHINE:
            return obj.id
            break;
        case OBJECT_TYPE.STATE:
            return `${obj.name}`
            break;
            return `${obj.source_id}:${obj.target_id}`
            break;
        case OBJECT_TYPE.LINK:
            return `${obj.source_name}:${obj.target_name}`
            break;
    }
}

/* ---------- TYPES ---------- */

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

export type MachineId = string;
export type StateName = string;

export type Machine = {
    object_type: OBJECT_TYPE,
    name: string,
    leaves: number[],
    id: string
}

export type State = {
    object_type: OBJECT_TYPE,
    name: StateName;
    machine_id: MachineId;
    auto: boolean
    negotiating: boolean,
    is_set: boolean,
    index: number
}

export type Link = {
    object_type: OBJECT_TYPE,
    source_name: StateName,
    target_name: StateName,
    source: number,
    target: number,
    active: boolean,
    type: NODE_LINK_TYPE
}

export interface ID3GraphJson {
    nodes: Array<State>,
    links: Array<Link>,
    groups: Array<Machine>
}
