'use strict';

require('source-map-support/register');
var asyncmachine_1 = require('asyncmachine');
var chai_1 = require('chai');
var assert = require('assert');
var network_1 = require('../../src/network');
var d3network_1 = require('../../src/d3network');
var fs = require('fs');
// describe("Single machine graph", function() {
//   beforeEach( function() {
//     this.machine = new AsyncMachine.factory(['A', 'B', 'C', 'D'])
//     this.machine.A = {requires: ['B']}
//     this.machine.C = {blocks: ['B']}
//     this.machine.D = {requires: ['C']}
//     this.stateGraph = new Network
//     this.stateGraph.addMachine(this.machine)
//   })
//   it('should get all states as nodes', function() {
//     expect(this.stateGraph.graph.nodes().length).to.be.eql(5)
//   })
//   it('should get all relations as edges', function() {
//     var nodes = this.stateGraph.nodes
//     let edges = _.map(this.stateGraph.graph.edges(), edge => {
//       return `${nodes[edge.v].name} ${nodes[edge.w].name}`
//     })
//     expect(edges).to.eql([
//       'A B',
//       'C B',
//       'D C'
//     ])
//   })
// })
describe("Network", function () {
    var _this = this;
    var stateGraph;
    before(function () {
        this.machine1 = asyncmachine_1.AsyncMachine.factory(['A', 'B', 'C', 'D']);
        this.machine1.debug_prefix = 'machine1';
        this.machine1.C = { blocks: ['B'] };
        this.machine1.A = { requires: ['B'] };
        this.machine1.D = { requires: ['C'] };
        this.machine2 = asyncmachine_1.AsyncMachine.factory(['E', 'F', 'G']);
        this.machine2.debug_prefix = 'machine2';
        this.machine2.E = { blocks: ['F'] };
        this.machine3 = asyncmachine_1.AsyncMachine.factory(['E', 'F']);
        this.machine3.debug_prefix = 'machine3';
        this.machine3.E = { blocks: ['F'] };
        this.machine4 = asyncmachine_1.AsyncMachine.factory(['E', 'F']);
        this.machine4.debug_prefix = 'machine4';
        this.machine4.E = { blocks: ['F'] };
        this.machine5 = asyncmachine_1.AsyncMachine.factory(['E', 'F']);
        this.machine5.debug_prefix = 'machine5';
        this.machine5.E = { blocks: ['F'] };
        this.machine1.pipe('A', this.machine2, 'E');
        this.machine2.pipe('E', this.machine1, 'B');
        this.machine2.pipe('F', this.machine1, 'B');
        this.machine2.pipe('E', this.machine3, 'F');
        this.machine2.pipe('G', this.machine4, 'F');
        this.machine5.pipe('F', this.machine3, 'E');
        this.machine1.debug('[1]', 2);
        //window.foo = this.machine1
        stateGraph = new network_1.default();
        stateGraph.addMachine(this.machine1);
        stateGraph.addMachine(this.machine2);
        stateGraph.addMachine(this.machine3);
        stateGraph.addMachine(this.machine4);
        stateGraph.addMachine(this.machine5);
    });
    describe('json factory', function () {
        var json;
        before(function () {
            _this.jsonGenerator = new d3network_1.default(stateGraph);
            json = _this.jsonGenerator.generateJson();
        });
        it('should produce json', function () {
            // console.log(JSON.stringify(json))
            chai_1.expect(json).to.eql(JSON.parse(fs.readFileSync('test/fixtures/1.json').toString()));
        });
        it('should support cross-machine connections', function () {
            throw new Error();
        });
    });
    describe('diffs factory', function () {
        var json2;
        before(function () {
            var jsonGenerator = new d3network_1.default(stateGraph);
            var differ = new d3network_1.D3JsonDiffFactory(jsonGenerator);
            differ.generateJson();
            var prev = differ.previous_json;
            assert(differ.previous_json);
            // console.log(differ.previous_json)
            this.machine1.add('C');
            this.machine2.pipe('E', this.machine1, 'C');
            this.diff = differ.generateDiff();
            // console.log(differ.previous_json)
            // expect(prev).to.eql(differ.previous_json)
        });
        it('should produce diffs', function () {
            var expected_diff = { nodes: { '3': { is_set: [false, true] }, _t: 'a' } };
            chai_1.expect(this.diff).to.eql(expected_diff);
        });
    });
    //describe('ui', function() {
    //    it('should render', function() {
    //      var ui = new Ui(this.stateGraph)
    //      ui.render()
    //    })
    //
    //    afterEach(function() {
    //
    //    })
    //})
});
//# sourceMappingURL=test.js.map
