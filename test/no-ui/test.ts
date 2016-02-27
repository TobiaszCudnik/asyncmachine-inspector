import 'source-map-support/register'
import { AsyncMachine } from 'asyncmachine'
import { expect } from 'chai'
import * as assert from 'assert'
import Network from '../../src/network'
import D3GraphJson, {
    D3JsonDiffFactory
} from '../../src/d3network'
import * as fs from 'fs'
import * as path from 'path'

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

describe("Network", function() {

    var stateGraph;

    before( function() {
        this.machine1 = AsyncMachine.factory(['A', 'B', 'C', 'D'])
        this.machine1.debug_prefix = 'machine1'
        this.machine1.C = {blocks: ['B']}
        this.machine1.A = {requires: ['B']}
        this.machine1.D = {requires: ['C']}

        this.machine2 = AsyncMachine.factory(['E', 'F', 'G'])
        this.machine2.debug_prefix = 'machine2'
        this.machine2.E = {blocks: ['F']}

        this.machine3 = AsyncMachine.factory(['E', 'F'])
        this.machine3.debug_prefix = 'machine3'
        this.machine3.E = {blocks: ['F']}

        this.machine4 = AsyncMachine.factory(['E', 'F'])
        this.machine4.debug_prefix = 'machine4'
        this.machine4.E = {blocks: ['F']}

        this.machine5 = AsyncMachine.factory(['E', 'F'])
        this.machine5.debug_prefix = 'machine5'
        this.machine5.E = {blocks: ['F']}

        this.machine1.pipe('A', this.machine2, 'E')
        this.machine2.pipe('E', this.machine1, 'B')
        this.machine2.pipe('F', this.machine1, 'B')
        this.machine2.pipe('E', this.machine3, 'F')
        this.machine2.pipe('G', this.machine4, 'F')
        this.machine5.pipe('F', this.machine3, 'E')

        this.machine1.debug('[1]', 2)
        //window.foo = this.machine1

        stateGraph = new Network
        stateGraph.addMachine(this.machine1)
        stateGraph.addMachine(this.machine2)
        stateGraph.addMachine(this.machine3)
        stateGraph.addMachine(this.machine4)
        stateGraph.addMachine(this.machine5)

    })

    describe('json factory', function() {
        var json;
        before(function() {
            this.jsonGenerator = new D3GraphJson(stateGraph)
            json = this.jsonGenerator.generateJson();
        })
        
        it('should produce json', function () {
            expect(json).to.eql(JSON.parse(
                fs.readFileSync('test/fixtures/1.json')))
        })

    })
    
    describe('diffs factory', function() {
        var json2;
        before(function() {
            let jsonGenerator = new D3GraphJson(stateGraph)
            var differ = new D3JsonDiffFactory(jsonGenerator)
            
            differ.generateJson()
            assert(differ.previous_json)
            
            this.machine1.add('C')
            this.machine2.pipe('E', this.machine1, 'C')
            
            this.diff = differ.generateDiff()
        })
        
        it('should produce diffs', function() {
            console.log(this.diff)
            throw new Error('not implemented')
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
