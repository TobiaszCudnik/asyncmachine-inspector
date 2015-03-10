import { AsyncMachine } from 'asyncmachine'
import { expect } from 'chai'
import _ from 'underscore'
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
    expect(this.vis.graph.nodes().length).to.be.eql(5)
  })

  it('should get all relations as edges', function() {
    var nodes = this.vis.nodes
    let edges = _.map(this.vis.graph.edges(), edge => {
      return `${nodes[edge.v].name} ${nodes[edge.w].name}`
    })
    expect(edges).to.eql([
      'A B',
      'C B',
      'D C'
    ])
  })
})
