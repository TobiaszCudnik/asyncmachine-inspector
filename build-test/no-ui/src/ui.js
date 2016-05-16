'use strict';

var d3 = require('d3');
var cola = require('webcola');
// TODO this is so bad
window.d3 = d3;
/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
var Ui = (function () {
    function Ui(data) {
        this.data = data;
        this.pad = 3;
        this.width = 800;
        this.height = 600;
        this.machine_color = d3.scale.category10();
        this.state_color = d3.scale.category20c();
        for (var _i = 0, _a = this.data.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.width = node.name.length * 20;
            node.height = 25;
        }
        this.layout = cola.d3adaptor().linkDistance(100).avoidOverlaps(true).handleDisconnected(false).nodes(this.data.nodes).links(this.data.links).groups(this.data.groups).size([this.width, this.height]);
    }
    Ui.prototype.render = function () {
        // TODO customizable container
        this.container = d3.select("body").append("svg").attr("width", this.width).attr("height", this.height);
        this.layout.start();
        this.renderNodes();
    };
    Ui.prototype.renderNodes = function () {
        var _this = this;
        this.group = this.container.selectAll(".group").data(this.data.groups).enter().append("rect").attr("rx", 8).attr("ry", 8).attr("class", "group").style("fill", function (d) {
            return _this.machine_color(d.id);
        }).call(this.layout.drag);
        this.link = this.container.selectAll(".link").data(this.data.links).enter().append("line").attr("class", "link");
        this.node = this.container.selectAll(".node").data(this.data.nodes).enter().append("rect").attr("class", "node").attr("width", function (d) {
            return d.width - 2 * _this.pad;
        }).attr("height", function (d) {
            return d.height - 2 * _this.pad;
        }).attr("rx", 5).attr("ry", 5).style("fill", function (d) {
            return _this.state_color(d.name);
        }).call(this.layout.drag);
        this.label = this.container.selectAll(".label").data(this.data.nodes).enter().append("text").attr("class", "label").text(function (d) {
            return d.name;
        }).call(this.layout.drag);
        this.node.append("title").text(function (d) {
            return d.name;
        });
        this.layout.on("tick", this.redrawNodes.bind(this));
    };
    Ui.prototype.redrawNodes = function () {
        var _this = this;
        this.link.attr("x1", function (d) {
            return d.source.x;
        }).attr("y1", function (d) {
            return d.source.y;
        }).attr("x2", function (d) {
            return d.target.x;
        }).attr("y2", function (d) {
            return d.target.y;
        });
        this.node.attr("x", function (d) {
            return d.x - d.width / 2 + _this.pad;
        }).attr("y", function (d) {
            return d.y - d.height / 2 + _this.pad;
        });
        this.group.attr("x", function (d) {
            return d.bounds.x;
        }).attr("y", function (d) {
            return d.bounds.y;
        }).attr("width", function (d) {
            return d.bounds.width();
        }).attr("height", function (d) {
            return d.bounds.height();
        });
        this.label.attr("x", function (d) {
            return d.x;
        }).attr("y", function (d) {
            var h = this.getBBox().height;
            return d.y + h / 4;
        });
    };
    return Ui;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ui;
//# sourceMappingURL=ui.js.map
