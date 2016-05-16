'use strict';

var jsondiffpatch = require('jsondiffpatch');
var assert = require('assert');
/**
 * Produce JSON from Network, ready to be consumed by the D3 UI layer.
 */
var D3NetworkJson = (function () {
    function D3NetworkJson(network) {
        this.network = network;
        // TODO use enum for the source relations
        this.relations_map = {
            requires: NODE_LINK_TYPE.REQUIRES,
            blocks: NODE_LINK_TYPE.BLOCKS,
            implies: NODE_LINK_TYPE.IMPLIES,
            order: NODE_LINK_TYPE.ORDER,
            piped: NODE_LINK_TYPE.PIPED_IN
        };
        assert(network);
    }
    D3NetworkJson.prototype.generateJson = function () {
        var _this = this;
        // TODO cleanup at the end
        this.json = {
            nodes: [],
            links: [],
            groups: []
        };
        this.machine_ids = new Set();
        this.nodes = new Map();
        this.machine_nodes = {};
        this.externals = new Map();
        // process nodes
        this.network.graph.forEach(function (node) {
            return _this.parseNode(node);
        });
        this.network.graph.traverseAll(function (from, to) {
            return _this.parseLink(from, to);
        });
        return this.json;
    };
    D3NetworkJson.prototype.parseNode = function (graph_node) {
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
        } else {
            machine_node = this.machine_nodes[graph_node.machine_id];
        }
        var node = {
            object_type: OBJECT_TYPE.STATE,
            name: graph_node.name,
            machine_id: graph_node.machine_id,
            auto: Boolean(graph_node.state.auto),
            negotiating: false,
            is_set: graph_node.is_set,
            index: this.json.nodes.length
        };
        // add to json
        this.json.nodes.push(node);
        machine_node.leaves.push(node.index);
        // index the reference
        this.nodes.set(graph_node, node);
    };
    D3NetworkJson.prototype.parseLink = function (from, to) {
        // create a link for every relation
        var relations = from.relations(to);
        for (var _i = 0; _i < relations.length; _i++) {
            var relation = relations[_i];
            var relation_type = this.relations_map[relation];
            assert(relation_type !== undefined);
            this.json.links.push({
                object_type: OBJECT_TYPE.LINK,
                source_name: from.full_name,
                target_name: to.full_name,
                source: this.nodes.get(from).index,
                target: this.nodes.get(to).index,
                type: relation_type,
                active: false // TODO
            });
        }
        // TODO support piping properly, distinguish types
        if (!relations.length) {
            this.json.links.push({
                object_type: OBJECT_TYPE.LINK,
                source_name: from.full_name,
                target_name: to.full_name,
                source: this.nodes.get(from).index,
                target: this.nodes.get(to).index,
                type: this.relations_map.piped,
                active: false // TODO
            });
        }
    };
    D3NetworkJson.prototype.getMachineName = function (machine) {
        return (machine.debug_prefix || '').replace(['[', ']', ' '], '');
    };
    return D3NetworkJson;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = D3NetworkJson;
/**
 * TODO make it a steram
 */
var D3JsonDiffFactory = (function () {
    function D3JsonDiffFactory(network) {
        this.network = network;
        assert(network);
        this.diffpatcher = jsondiffpatch.create({
            objectHash: this.objectHash()
        });
    }
    D3JsonDiffFactory.prototype.objectHash = function () {
        return objectHash;
    };
    D3JsonDiffFactory.prototype.generateJson = function () {
        // generate a new json and keep it as the last one
        this.previous_json = this.network.generateJson();
    };
    D3JsonDiffFactory.prototype.generateDiff = function (base_json) {
        base_json = base_json || this.previous_json;
        assert(base_json, "Base JSON required to create a diff");
        this.generateJson();
        // generate the diff
        return this.diffpatcher.diff(base_json, this.previous_json);
    };
    return D3JsonDiffFactory;
})();
exports.D3JsonDiffFactory = D3JsonDiffFactory;
// TODO type obj
function objectHash(obj) {
    var key;
    switch (obj.object_type) {
        case OBJECT_TYPE.MACHINE:
            key = obj.id;
            break;
        case OBJECT_TYPE.STATE:
            key = obj.machine_id + ":" + obj.name;
            break;
        case OBJECT_TYPE.LINK:
            key = obj.source_name + ":" + obj.target_name;
            break;
        default:
            throw new Error('unknown object type');
    }
    return key;
}
exports.objectHash = objectHash;
/* ---------- TYPES ---------- */
(function (NODE_LINK_TYPE) {
    NODE_LINK_TYPE[NODE_LINK_TYPE["REQUIRES"] = 0] = "REQUIRES";
    NODE_LINK_TYPE[NODE_LINK_TYPE["BLOCKS"] = 1] = "BLOCKS";
    NODE_LINK_TYPE[NODE_LINK_TYPE["ORDER"] = 2] = "ORDER";
    NODE_LINK_TYPE[NODE_LINK_TYPE["IMPLIES"] = 3] = "IMPLIES";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_IN"] = 4] = "PIPED_IN";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_OUT"] = 5] = "PIPED_OUT";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_INVERTED_IN"] = 6] = "PIPED_INVERTED_IN";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_INVERTED_OUT"] = 7] = "PIPED_INVERTED_OUT";
})(exports.NODE_LINK_TYPE || (exports.NODE_LINK_TYPE = {}));
var NODE_LINK_TYPE = exports.NODE_LINK_TYPE;
(function (OBJECT_TYPE) {
    OBJECT_TYPE[OBJECT_TYPE["MACHINE"] = 0] = "MACHINE";
    OBJECT_TYPE[OBJECT_TYPE["STATE"] = 1] = "STATE";
    OBJECT_TYPE[OBJECT_TYPE["LINK"] = 2] = "LINK";
})(exports.OBJECT_TYPE || (exports.OBJECT_TYPE = {}));
var OBJECT_TYPE = exports.OBJECT_TYPE;
//# sourceMappingURL=d3network.js.map
