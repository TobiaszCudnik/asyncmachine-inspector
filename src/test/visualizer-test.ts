/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/mocha/mocha.d.ts" />


import * as am from 'asyncmachine'
import { expect } from 'chai'
import _ from 'lodash'
import { StateGraph, Ui } from '../visualizer'


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
  
    beforeEach( function() {
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
        this.machine1.add('B')
        window.foo = this.machine1

        this.stateGraph = new StateGraph
        this.stateGraph.addMachine(this.machine1)
        this.stateGraph.addMachine(this.machine2)
        this.stateGraph.addMachine(this.machine3)
        this.stateGraph.addMachine(this.machine4)
        this.stateGraph.addMachine(this.machine5)

    })

    describe('ui', function() {
        it('should render', function() {
          var ui = new Ui(this.stateGraph)
          ui.render()
        })

        afterEach(function() {

        })
    })
})
