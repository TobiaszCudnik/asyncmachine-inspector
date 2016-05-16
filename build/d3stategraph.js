import * as jsondiffpatch from 'jsondiffpatch';
import assert from 'assert';
/**
 * Produce JSON from StateGraph, ready to be consumed by the D3 UI layer.
 */
export default class D3GraphJson {
    constructor(graph) {
        this.graph = graph;
        // TODO use enum for the source relations
        this.relations_map = {
            requires: NODE_LINK_TYPE.REQUIRES,
            blocks: NODE_LINK_TYPE.BLOCKS,
            implies: NODE_LINK_TYPE.IMPLIES,
            order: NODE_LINK_TYPE.ORDER,
            piped: NODE_LINK_TYPE.PIPED_IN
        };
        assert(graph);
    }
    generateJson() {
        // TODO cleanup at the end
        this.json = {
            nodes: [],
            links: [],
            groups: []
        };
        this.machine_ids = new Set;
        this.nodes = new Map;
        this.machine_nodes = {};
        this.externals = new Map;
        // process nodes
        this.graph.graph.forEach(node => this.parseNode(node));
        this.graph.graph.traverseAll((from, to) => this.parseLink(from, to));
        return this.json;
    }
    parseNode(graph_node) {
        var machine = graph_node.machine;
        var machine_node;
        // handle a machine node TODO extract
        if (!this.machine_ids.has(graph_node.machine_id)) {
            machine_node = {
                object_type: OBJECT_TYPE.MACHINE,
                name: this.getMachineName(machine),
                leaves: [],
                id: graph_node.machine_id
            };
            this.json.groups.push(machine_node);
            this.machine_ids.add(graph_node.machine_id);
            this.machine_nodes[graph_node.machine_id] = machine_node;
        }
        else {
            machine_node = this.machine_nodes[graph_node.machine_id];
        }
        var node = {
            object_type: OBJECT_TYPE.STATE,
            name: graph_node.name,
            machine_id: graph_node.machine_id,
            auto: graph_node.state.auto,
            negotiating: false,
            is_set: graph_node.is_set,
            index: this.json.nodes.length
        };
        // add to json
        this.json.nodes.push(node);
        machine_node.leaves.push(node.index);
        // index the reference
        this.nodes.set(graph_node, node);
    }
    parseLink(from, to) {
        // create a link for every relation
        var relations = from.relations(to);
        for (let relation of from.relations(to)) {
            this.json.links.push({
                object_type: OBJECT_TYPE.LINK,
                source_name: from.name,
                target_name: to.name,
                source: this.nodes.get(from).index,
                target: this.nodes.get(to).index,
                type: this.relations_map[relation],
                active: false // TODO
            });
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
                active: false // TODO
            });
        }
    }
    getMachineName(machine) {
        return (machine.debug_prefix || '')
            .replace(['[', ']', ' '], '');
    }
}
/**
 * TODO make it a steram
 */
export class D3JsonDiffFactory {
    constructor(graph) {
        this.graph = graph;
        this.diffpatcher = jsondiffpatch.create({
            objectHash: this.objectHash()
        });
    }
    objectHash() {
        return objectHash;
    }
    generateJson() {
        // generate a new json and keep it as the last one
        this.previous_json = this.graph.generateJson();
    }
    generateDiff(base_json) {
        base_json = base_json || this.previous_json;
        assert(base_json, "Base JSON required to create a diff");
        this.generateJson();
        // generate the diff
        return this.diffpatcher.diff(base_json, this.previous_json);
    }
}
export function objectHash(obj) {
    switch (obj.type) {
        case OBJECT_TYPE.MACHINE:
            return obj.id;
            break;
        case OBJECT_TYPE.STATE:
            return `${obj.name}`;
            break;
            return `${obj.source_id}:${obj.target_id}`;
            break;
        case OBJECT_TYPE.LINK:
            return `${obj.source_name}:${obj.target_name}`;
            break;
    }
}
/* ---------- TYPES ---------- */
export var NODE_LINK_TYPE;
(function (NODE_LINK_TYPE) {
    NODE_LINK_TYPE[NODE_LINK_TYPE["REQUIRES"] = 0] = "REQUIRES";
    NODE_LINK_TYPE[NODE_LINK_TYPE["BLOCKS"] = 1] = "BLOCKS";
    NODE_LINK_TYPE[NODE_LINK_TYPE["ORDER"] = 2] = "ORDER";
    NODE_LINK_TYPE[NODE_LINK_TYPE["IMPLIES"] = 3] = "IMPLIES";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_IN"] = 4] = "PIPED_IN";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_OUT"] = 5] = "PIPED_OUT";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_INVERTED_IN"] = 6] = "PIPED_INVERTED_IN";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_INVERTED_OUT"] = 7] = "PIPED_INVERTED_OUT";
})(NODE_LINK_TYPE || (NODE_LINK_TYPE = {}));
export var OBJECT_TYPE;
(function (OBJECT_TYPE) {
    OBJECT_TYPE[OBJECT_TYPE["MACHINE"] = 0] = "MACHINE";
    OBJECT_TYPE[OBJECT_TYPE["STATE"] = 1] = "STATE";
    OBJECT_TYPE[OBJECT_TYPE["LINK"] = 2] = "LINK";
})(OBJECT_TYPE || (OBJECT_TYPE = {}));
//# sourceMappingURL=d3stategraph.js.map
