'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Node = undefined;

var _graphs = require('graphs');

var _graphs2 = _interopRequireDefault(_graphs);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = exports.Node = (function () {
    function Node(name, machine, machine_id) {
        _classCallCheck(this, Node);

        this.name = name;
        this.machine = machine;
        this.machine_id = machine_id;
    }
    /**
     * Get the original state definition.
     */

    _createClass(Node, [{
        key: 'relations',
        value: function relations(node) {
            var name = node instanceof Node ? node.name : node.toString();
            return this.machine.getRelations(this.name, name);
        }
    }, {
        key: 'state',
        get: function get() {
            return this.machine.get(this.name);
        }
        /**
         * Is the state currently set?
         */

    }, {
        key: 'is_set',
        get: function get() {
            return this.machine.is(this.name);
        }
    }]);

    return Node;
})();
/**
 * TODO inherit from Graph
 */

var StateGraph = (function (_EventEmitter) {
    _inherits(StateGraph, _EventEmitter);

    function StateGraph() {
        _classCallCheck(this, StateGraph);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StateGraph).call(this));

        _this.graph = new _graphs2.default();
        _this.machines = new Map();
        _this.machine_ids = {};
        return _this;
    }

    _createClass(StateGraph, [{
        key: 'addMachine',
        value: function addMachine(machine) {
            // TODO check for duplicates first
            var id = _nodeUuid2.default.v4();
            this.machines.set(machine, id);
            this.machine_ids[id] = machine;
            this.statesToNodes(machine.states_all, id);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.machines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2);

                    var _machine = _step$value[0];
                    var _id = _step$value[1];

                    this.bindToMachine(_machine);
                    this.linkPipedStates(_machine);
                }
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
        }
    }, {
        key: 'bindToMachine',
        value: function bindToMachine(machine) {
            var _this2 = this;

            // bind to the state change
            // TODO bind to:
            // - piping (new and removed ones)
            // - transition start
            // - transition end / cancel
            // TODO unbind on dispose
            machine.on('change', function () {
                return _this2.emit('change');
            });
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            // TODO unbind listeners
        }
    }, {
        key: 'statesToNodes',
        value: function statesToNodes(names, machine_id) {
            // scan states
            var new_nodes = [];
            var machine = this.machine_ids[machine_id];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = names[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var name = _step2.value;

                    var node = new Node(name, machine, machine_id);
                    this.graph.add(node);
                    new_nodes.push(node);
                }
                // get edges from relations
                // all the nodes have to be parsed prior to this
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = new_nodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var node = _step3.value;

                    this.getRelationsFromNode(node, machine_id);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: 'getRelationsFromNode',
        value: function getRelationsFromNode(node, machine_id) {
            // TODO limit to 'requires' and 'drops' ?
            var machine = this.machine_ids[machine_id];
            var state = node.state;
            (0, _assert2.default)(state);
            for (var relation in state) {
                if (relation == 'auto') continue;
                var targets = state[relation];
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = targets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var target_name = _step4.value;

                        var target = this.getNodeByName(target_name, machine_id);
                        (0, _assert2.default)(target);
                        this.graph.link(node, target);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }
        }
    }, {
        key: 'getNodeByName',
        value: function getNodeByName(name, machine_id) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.graph.set[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var node = _step5.value;

                    if (node.name === name && node.machine_id === machine_id) return node;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }, {
        key: 'linkPipedStates',
        value: function linkPipedStates(machine) {
            for (var state in machine.piped) {
                var data = machine.piped[state];
                var source_state = this.getNodeByName(state, this.machines.get(machine));
                var target_state = this.getNodeByName(data.state, this.machines.get(data.machine));
                if (!target_state) continue;
                this.graph.link(source_state, target_state);
            }
        }
    }, {
        key: 'states',
        get: function get() {
            return [].concat(_toConsumableArray(this.graph.set));
        }
    }]);

    return StateGraph;
})(_eventemitter2.default);

exports.default = StateGraph;
//# sourceMappingURL=stategraph.js.map
