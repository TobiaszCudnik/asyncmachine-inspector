'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inherits = require('inherits');

var _inherits2 = _interopRequireDefault(_inherits);

var _guardfn = require('guardfn');

var _guardfn2 = _interopRequireDefault(_guardfn);

var _afterfn = require('afterfn');

var _afterfn2 = _interopRequireDefault(_afterfn);

var _beforefn = require('beforefn');

var _beforefn2 = _interopRequireDefault(_beforefn);

var _sliced = require('sliced');

var _sliced2 = _interopRequireDefault(_sliced);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = function () {
    function Graph() {
        _classCallCheck(this, Graph);

        this.set = new Set();
        this.linkMap = new Map();
        aspectify(this);
        this.guard('add', function () {
            return arguments.length;
        });
        this.before('add', function fn() {
            fn.args = fn.args.filter(function (item) {
                return item && !this.has(item);
            }, this);
        });
        this.after('delete', function () {
            (0, _sliced2.default)(arguments).forEach(function (item) {
                this.unlinkAll(item);
            }, this);
        });
        this.after('link', function ensureAdded() {
            (0, _sliced2.default)(arguments).forEach(function (item) {
                this.add(item);
            }, this);
        });
    }

    _createClass(Graph, [{
        key: 'link',
        value: function link(from, to) {
            var linked = this._linked(from);
            linked.add(to);
            return true;
        }
    }, {
        key: 'unlink',
        value: function unlink(from, to) {
            var linked = this._linked(from);
            if (!linked.has(to)) return false;
            linked.delete(to);
            if (!linked.size) this.linkMap.delete(from);
            return true;
        }
    }, {
        key: 'unlinkAll',
        value: function unlinkAll(node) {
            this.from(node).forEach(function unlinkEachLinkedFrom(to) {
                this.unlink(node, to);
            }, this);
            this.to(node).forEach(function unlinkEachLinkedTo(from) {
                this.unlink(from, node);
            }, this);
        }
    }, {
        key: 'from',
        value: function from(_from) {
            return new Set(this._linked(_from));
        }
    }, {
        key: 'to',
        value: function to(_to) {
            var linked = new Set();
            this.linkMap.forEach(function (value, key) {
                if (value.has(_to)) linked.add(key);
            });
            return linked;
        }
    }, {
        key: '_linked',
        value: function _linked(from) {
            var linkedFrom = this.linkMap.get(from);
            if (!linkedFrom) {
                linkedFrom = new Set();
                this.linkMap.set(from, linkedFrom);
            }
            return linkedFrom;
        }
    }, {
        key: 'visit',
        value: function visit(root, fn, visited) {
            if (arguments.length == 1) {
                fn = root;
                return this.visitAll(fn);
            } else if (arguments.length == 2) {
                if (typeof fn === 'function') {
                    return this.visitFrom(root, fn);
                } else {
                    visited = fn;
                    fn = root;
                    return this.visitAll(fn, visited);
                }
            }
            return this.visitFrom(root, fn, visited);
        }
    }, {
        key: 'visitFrom',
        value: function visitFrom(root, fn, visited, previous) {
            visited = visited || new Set();
            if (!this.has(root)) return;
            if (visited.has(root)) return;
            visited.add(root);
            fn.call(this, root, previous);
            return this.from(root).forEach(function (linked) {
                this.visitFrom(linked, fn, visited, root);
            }, this);
        }
    }, {
        key: 'visitAll',
        value: function visitAll(fn, visited) {
            visited = visited || new Set();
            this.forEach(function (node) {
                this.visitFrom(node, fn, visited);
            }, this);
        }
    }, {
        key: 'traverse',
        value: function traverse(from, fn) {
            if (arguments.length === 1) return this.traverseAll(from);
            return this.traverseFrom(from, fn);
        }
    }, {
        key: 'traverseFrom',
        value: function traverseFrom(from, fn, visited) {
            visited = visited || new Map();
            var linked = visited.get(from);
            if (!linked) linked = new Set();
            visited.set(from, linked);
            this.from(from).forEach(function (to) {
                if (linked.has(to)) return;
                linked.add(to);
                fn.call(this, from, to);
                this.traverseFrom(to, fn, visited);
            }, this);
        }
    }, {
        key: 'traverseAll',
        value: function traverseAll(fn) {
            var self = this;
            this.linkMap.forEach(function (links, from) {
                links.forEach(function (to) {
                    fn.call(self, from, to);
                });
            });
        }
    }]);

    return Graph;
}();

exports.default = Graph;


proxyNativeSetProperty(Graph, 'size');
Graph.prototype.add = proxyNativeSet('add');
Graph.prototype.has = proxyNativeSet('has');
Graph.prototype.keys = proxyNativeSet('keys');
Graph.prototype.delete = proxyNativeSet('delete');
Graph.prototype.clear = proxyNativeSet('clear');
Graph.prototype.values = proxyNativeSet('values');
Graph.prototype.forEach = proxyNativeSet('forEach');
Graph.prototype.entries = proxyNativeSet('entries');

function proxyNativeSet(name) {
    return function () {
        return this.set[name].apply(this.set, arguments);
    };
}

function proxyNativeSetProperty(obj, name) {
    Object.defineProperty(obj, name, {
        get: function get() {
            return this.set[name];
        }
    });
}

// TODO use a module or an event emitter
function aspectify(target) {
    var _before = _beforefn2.default;
    var _after = _afterfn2.default;
    var _guard = _guardfn2.default;
    target.before = function before(name, fn) {
        this[name] = _before(this[name], fn);
        return this;
    };
    target.after = function after(name, fn) {
        this[name] = _after(this[name], fn);
        return this;
    };
    target.guard = function guard(name, fn) {
        this[name] = _guard(this[name], fn);
        return this;
    };
    return target;
}
