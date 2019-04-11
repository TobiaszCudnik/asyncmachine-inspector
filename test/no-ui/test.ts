import 'source-map-support/register'
import AsyncMachine, { machine } from 'asyncmachine'
import * as jsondiffpatch from 'jsondiffpatch'
import { expect } from 'chai'
import * as assert from 'assert'
// import GraphJson, {
//     JsonDiffFactory
// } from '../../src/ui/cola-network'
import * as fs from 'fs'
import * as path from 'path'
import MachineNetwork from '../../src/network/machine-network'
import { GraphNetworkDiffer } from '../../src/network/graph-network-differ'

// describe("Single machine graph", function() {

//   beforeEach( function() {
//     machine = new factory(['A', 'B', 'C', 'D'])
//     machine.A = {requires: ['B']}
//     machine.C = {blocks: ['B']}
//     machine.D = {requires: ['C']}

//     this.stateGraph = new Network
//     this.stateGraph.addMachine(machine)
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

describe('Network', function() {
  var stateGraph
  let machine1: AsyncMachine<any, any, any>
  let machine2: AsyncMachine<any, any, any>
  let machine3: AsyncMachine<any, any, any>
  let machine4: AsyncMachine<any, any, any>
  let machine5: AsyncMachine<any, any, any>

  before(function() {
    machine1 = machine(['A', 'B', 'C', 'D'])
    debugger
    machine1.id('machine1')
    // @ts-ignore
    machine1.C = { blocks: ['B'] }
    // @ts-ignore
    machine1.A = { requires: ['B'] }
    // @ts-ignore
    machine1.D = { requires: ['C'] }

    machine2 = machine(['E', 'F', 'G'])
    machine2.id('machine2')
    // @ts-ignore
    machine2.E = { blocks: ['F'] }

    machine3 = machine(['E', 'F'])
    machine3.id('machine3')
    // @ts-ignore
    machine3.E = { blocks: ['F'] }

    machine4 = machine(['E', 'F'])
    machine4.id('machine4')
    // @ts-ignore
    machine4.E = { blocks: ['F'] }

    machine5 = machine(['E', 'F'])
    machine5.id('machine5')
    // @ts-ignore
    machine5.E = { blocks: ['F'] }

    machine1.log('[1]', 2)
    //window.foo = machine1

    stateGraph = new MachineNetwork()
    stateGraph.addMachine(machine1)
    stateGraph.addMachine(machine2)
    stateGraph.addMachine(machine3)
    stateGraph.addMachine(machine4)
    stateGraph.addMachine(machine5)

    machine1.pipe(
      'A',
      machine2,
      'E'
    )
    machine2.pipe(
      'E',
      machine1,
      'B'
    )
    machine2.pipe(
      'F',
      machine1,
      'B'
    )
    machine2.pipe(
      'E',
      machine3,
      'F'
    )
    machine2.pipe(
      'G',
      machine4,
      'F'
    )
    machine5.pipe(
      'F',
      machine3,
      'E'
    )
  })

  describe('json factory', () => {
    var json
    before(() => {
      this.differ = new GraphNetworkDiffer(stateGraph, new Logger())
      json = this.differ.generateJson()
    })

    it('should produce json', () => {
      // console.log(JSON.stringify(json))
      expect(json).to.eql(
        JSON.parse(fs.readFileSync('test/fixtures/1.json').toString())
      )
    })

    it('should support cross-machine connections')
  })

  describe('diffs factory', function() {
    var json2
    before(function() {
      let differ = new GraphNetworkDiffer(stateGraph, new Logger)

      differ.generatePatch()
      var prev = differ.previous_json
      assert(differ.previous_json)
      // console.log(differ.previous_json)

      machine1.add('C')
      machine2.pipe(
        'E',
        machine1,
        'C'
      )

      this.diff = differ.generatePatch()
      // console.log(differ.previous_json)
      // expect(prev).to.eql(differ.previous_json)
    })

    it('should produce diffs', function() {
      let expected_diff = { nodes: { '3': { is_set: [false, true] }, _t: 'a' } }
      expect(this.diff).to.eql(expected_diff)
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
