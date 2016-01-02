import 'source-map-support/register'
import * as am from 'asyncmachine'
import { expect } from 'chai'
import assert from 'assert'
import StateGraph from '../../src/stategraph'
import D3GraphJson, {
    D3JsonDiffFactory
} from '../../src/d3stategraph'

// describe("Single machine graph", function() {

//   beforeEach( function() {
//     this.machine = new AsyncMachine.factory(['A', 'B', 'C', 'D'])
//     this.machine.A = {requires: ['B']}
//     this.machine.C = {drops: ['B']}
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

describe("Multi machine graph", function() {

    var stateGraph;

    before( function() {
        this.machine1 = am.AsyncMachine.factory(['A', 'B', 'C', 'D'])
        this.machine1.C = {drops: ['B']}
        this.machine1.A = {requires: ['B']}
        this.machine1.D = {requires: ['C']}

        this.machine2 = am.AsyncMachine.factory(['E', 'F', 'G'])
        this.machine2.E = {drops: ['F']}

        this.machine3 = am.AsyncMachine.factory(['E', 'F'])
        this.machine3.E = {drops: ['F']}

        this.machine4 = am.AsyncMachine.factory(['E', 'F'])
        this.machine4.E = {drops: ['F']}

        this.machine5 = am.AsyncMachine.factory(['E', 'F'])
        this.machine5.E = {drops: ['F']}

        this.machine1.pipe('A', this.machine2, 'E')
        this.machine2.pipe('E', this.machine1, 'B')
        this.machine2.pipe('F', this.machine1, 'B')
        this.machine2.pipe('E', this.machine3, 'F')
        this.machine2.pipe('G', this.machine4, 'F')
        this.machine5.pipe('F', this.machine3, 'E')

        this.machine1.debug('[1]', 2)
        //window.foo = this.machine1

        stateGraph = new StateGraph
        stateGraph.addMachine(this.machine1)
        stateGraph.addMachine(this.machine2)
        stateGraph.addMachine(this.machine3)
        stateGraph.addMachine(this.machine4)
        stateGraph.addMachine(this.machine5)

    })

    describe('json', function() {
        var json;
        before(function() {
            this.jsonGenerator = new D3GraphJson(stateGraph)
            json = this.jsonGenerator.generateJson();
        })
        it('should create json', function () {
            console.dir(JSON.stringify(json))
            expect(json.nodes.length).to.be.greaterThan(0)
        })

        describe('diffs', function() {
            var json2;
            before(function() {
                var differ = new D3JsonDiffFactory(this.jsonGenerator)
                differ.generateJson()
                debugger;
                assert(differ.previous_json)
                this.machine1.add('C')
                this.machine2.pipe('E', this.machine1, 'C')
                
                this.diff = differ.generateDiff()
            })
            it('should produce diffs', function() {
                console.log(this.diff)
                expect(this.diff).to.be.greaterThan(0)
            })
        })
        
    })

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
})
