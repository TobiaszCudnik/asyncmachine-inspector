import { AsyncMachine } from 'asyncmachine'
import { expect } from 'chai'
import _ from 'lodash'
import { Network, VisualizerUi } from '../src/visualizer'


describe("Single machine graph", function() {

  beforeEach( function() {
    this.machine = new AsyncMachine.factory(['A', 'B', 'C', 'D'])
    this.machine.A = {requires: ['B']}
    this.machine.C = {drops: ['B']}
    this.machine.D = {requires: ['C']}

    this.network = new Network
    this.network.addMachine(this.machine)
  })

  it('should get all states as nodes', function() {
    expect(this.network.graph.nodes().length).to.be.eql(5)
  })

  it('should get all relations as edges', function() {
    var nodes = this.network.nodes
    let edges = _.map(this.network.graph.edges(), edge => {
      return `${nodes[edge.v].name} ${nodes[edge.w].name}`
    })
    expect(edges).to.eql([
      'A B',
      'C B',
      'D C'
    ])
  })


  describe('ui', function() {
    it('should render', function() {
      var ui = new VisualizerUi(this.network)
      ui.render()
    })

    afterEach(function() {
      "use strict";

    })
  })
})
