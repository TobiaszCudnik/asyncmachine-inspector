import { AsyncMachine } from 'asyncmachine'
import { expect } from 'chai'
import { Visualizer } from '../src/visualizer'


describe("Single machine graph", function() {

  beforeEach( function() {
    this.machine = new AsyncMachine.factory(['A', 'B', 'C', 'D'])
    this.machine.A = {requires: ['B']}
    this.machine.C = {drops: ['B']}
    this.machine.D = {requires: ['C']}

    this.vis = new Visualizer
    this.vis.addMachine(this.machine)
  })

  it('should get all states as nodes', function() {
    console.dir(this.vis.graph.edges())
    debugger
  })

  it('should get all relations as edges')
})