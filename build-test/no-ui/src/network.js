'use strict';

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Graph = require('graphs');
var uuid = require('node-uuid');
var assert = require('assert');
// TODO fix the declaration
// import * as EventEmitter from 'eventemitter3'
var EventEmitter = require('eventemitter3');
var Node = (function () {
    function Node(name, machine, machine_id) {
        this.name = name;
        this.machine = machine;
        this.machine_id = machine_id;
    }
    Object.defineProperty(Node.prototype, "state", {
        /**
         * Get the original state definition.
         */
        get: function get() {
            return this.machine.get(this.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "is_set", {
        /**
         * Is the state currently set?
         */
        get: function get() {
            return this.machine.is(this.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "full_name", {
        get: function get() {
            return this.machine_id + ":" + this.name;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.relations = function (node) {
        var name = node instanceof Node ? node.name : node.toString();
        return this.machine.getRelations(this.name, name);
    };
    return Node;
})();
exports.Node = Node;
/**
 * TODO inherit from Graph
 */
var Network = (function (_super) {
    __extends(Network, _super);
    function Network() {
        _super.call(this);
        this.graph = new Graph();
        this.machines = new Map();
        this.machine_ids = {};
        this.id = uuid.v4();
    }
    Object.defineProperty(Network.prototype, "states", {
        get: function get() {
            return this.graph.set.slice();
        },
        enumerable: true,
        configurable: true
    });
    Network.prototype.addMachine = function (machine) {
        // TODO check for duplicates first
        // TODO deterministic IDs!!!
        var id = machine.debug_prefix || uuid.v4();
        this.machines.set(machine, id);
        this.machine_ids[id] = machine;
        this.statesToNodes(machine.states_all, id);
        this.bindToMachine(machine);
        // TODO this is required, but should be checked
        for (var _i = 0, _a = this.machines; _i < _a.length; _i++) {
            var _b = _a[_i],
                machine_1 = _b[0],
                id_1 = _b[1];
            this.linkPipedStates(machine_1);
        }
    };
    Network.prototype.bindToMachine = function (machine) {
        var _this = this;
        // bind to the state change
        // TODO bind to:
        // - piping (new and removed ones)
        // - transition start
        // - transition end / cancel
        // TODO unbind on dispose
        // TODO group the same changes emitted by couple of machines
        machine.on('change', function () {
            return _this.emit('change');
        });
    };
    Network.prototype.dispose = function () {
        // TODO unbind listeners
    };
    Network.prototype.statesToNodes = function (names, machine_id) {
        // scan states
        var new_nodes = [];
        var machine = this.machine_ids[machine_id];
        for (var _i = 0; _i < names.length; _i++) {
            var name = names[_i];
            var node = new Node(name, machine, machine_id);
            this.graph.add(node);
            new_nodes.push(node);
        }
        // get edges from relations
        // all the nodes have to be parsed prior to this
        for (var _a = 0; _a < new_nodes.length; _a++) {
            var node = new_nodes[_a];
            this.getRelationsFromNode(node, machine_id);
        }
    };
    Network.prototype.getRelationsFromNode = function (node, machine_id) {
        // TODO limit to 'requires' and 'drops' ?
        var machine = this.machine_ids[machine_id];
        var state = node.state;
        assert(state);
        for (var relation in state) {
            if (relation == 'auto') continue;
            var targets = state[relation];
            for (var _i = 0; _i < targets.length; _i++) {
                var target_name = targets[_i];
                var target = this.getNodeByName(target_name, machine_id);
                assert(target);
                this.graph.link(node, target);
            }
        }
    };
    Network.prototype.getNodeByName = function (name, machine_id) {
        // for (let node of this.graph.set) {
        var ret;
        this.graph.set.forEach(function (node) {
            if (node.name === name && node.machine_id === machine_id) ret = node;
        });
        return ret;
    };
    Network.prototype.linkPipedStates = function (machine) {
        for (var state in machine.piped) {
            var data = machine.piped[state];
            var source_state = this.getNodeByName(state, this.machines.get(machine));
            var target_state = this.getNodeByName(data.state, this.machines.get(data.machine));
            if (!target_state) continue;
            this.graph.link(source_state, target_state);
        }
    };
    return Network;
})(EventEmitter);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Network;
//# sourceMappingURL=network.js.map
