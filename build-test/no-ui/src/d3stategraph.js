'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OBJECT_TYPE = exports.NODE_LINK_TYPE = exports.objectHash = exports.D3JsonDiffFactory = undefined;

var _jsondiffpatch = require('jsondiffpatch');

var jsondiffpatch = _interopRequireWildcard(_jsondiffpatch);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Produce JSON from StateGraph, ready to be consumed by the D3 UI layer.
 */

var D3GraphJson = (function () {
    function D3GraphJson(graph) {
        _classCallCheck(this, D3GraphJson);

        this.graph = graph;
        // TODO use enum for the source relations
        this.relations_map = {
            requires: NODE_LINK_TYPE.REQUIRES,
            blocks: NODE_LINK_TYPE.BLOCKS,
            implies: NODE_LINK_TYPE.IMPLIES,
            order: NODE_LINK_TYPE.ORDER,
            piped: NODE_LINK_TYPE.PIPED_IN
        };
        (0, _assert2.default)(graph);
    }

    _createClass(D3GraphJson, [{
        key: 'generateJson',
        value: function generateJson() {
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
            this.graph.graph.forEach(function (node) {
                return _this.parseNode(node);
            });
            this.graph.graph.traverseAll(function (from, to) {
                return _this.parseLink(from, to);
            });
            return this.json;
        }
    }, {
        key: 'parseNode',
        value: function parseNode(graph_node) {
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
    }, {
        key: 'parseLink',
        value: function parseLink(from, to) {
            // create a link for every relation
            var relations = from.relations(to);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = from.relations(to)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var relation = _step.value;

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
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

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
    }, {
        key: 'getMachineName',
        value: function getMachineName(machine) {
            return (machine.debug_prefix || '').replace(['[', ']', ' '], '');
        }
    }]);

    return D3GraphJson;
})();
/**
 * TODO make it a steram
 */

exports.default = D3GraphJson;

var D3JsonDiffFactory = exports.D3JsonDiffFactory = (function () {
    function D3JsonDiffFactory(graph) {
        _classCallCheck(this, D3JsonDiffFactory);

        this.graph = graph;
        this.diffpatcher = jsondiffpatch.create({
            objectHash: this.objectHash()
        });
    }

    _createClass(D3JsonDiffFactory, [{
        key: 'objectHash',
        value: function objectHash() {
            return _objectHash;
        }
    }, {
        key: 'generateJson',
        value: function generateJson() {
            // generate a new json and keep it as the last one
            this.previous_json = this.graph.generateJson();
        }
    }, {
        key: 'generateDiff',
        value: function generateDiff(base_json) {
            base_json = base_json || this.previous_json;
            (0, _assert2.default)(base_json, "Base JSON required to create a diff");
            this.generateJson();
            // generate the diff
            return this.diffpatcher.diff(base_json, this.previous_json);
        }
    }]);

    return D3JsonDiffFactory;
})();

function _objectHash(obj) {
    switch (obj.type) {
        case OBJECT_TYPE.MACHINE:
            return obj.id;
            break;
        case OBJECT_TYPE.STATE:
            return '' + obj.name;
            break;
            return obj.source_id + ':' + obj.target_id;
            break;
        case OBJECT_TYPE.LINK:
            return obj.source_name + ':' + obj.target_name;
            break;
    }
}
/* ---------- TYPES ---------- */
exports.objectHash = _objectHash;
var NODE_LINK_TYPE = exports.NODE_LINK_TYPE = undefined;
(function (NODE_LINK_TYPE) {
    NODE_LINK_TYPE[NODE_LINK_TYPE["REQUIRES"] = 0] = "REQUIRES";
    NODE_LINK_TYPE[NODE_LINK_TYPE["BLOCKS"] = 1] = "BLOCKS";
    NODE_LINK_TYPE[NODE_LINK_TYPE["ORDER"] = 2] = "ORDER";
    NODE_LINK_TYPE[NODE_LINK_TYPE["IMPLIES"] = 3] = "IMPLIES";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_IN"] = 4] = "PIPED_IN";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_OUT"] = 5] = "PIPED_OUT";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_INVERTED_IN"] = 6] = "PIPED_INVERTED_IN";
    NODE_LINK_TYPE[NODE_LINK_TYPE["PIPED_INVERTED_OUT"] = 7] = "PIPED_INVERTED_OUT";
})(NODE_LINK_TYPE || (exports.NODE_LINK_TYPE = NODE_LINK_TYPE = {}));
var OBJECT_TYPE = exports.OBJECT_TYPE = undefined;
(function (OBJECT_TYPE) {
    OBJECT_TYPE[OBJECT_TYPE["MACHINE"] = 0] = "MACHINE";
    OBJECT_TYPE[OBJECT_TYPE["STATE"] = 1] = "STATE";
    OBJECT_TYPE[OBJECT_TYPE["LINK"] = 2] = "LINK";
})(OBJECT_TYPE || (exports.OBJECT_TYPE = OBJECT_TYPE = {}));
//# sourceMappingURL=d3stategraph.js.map
