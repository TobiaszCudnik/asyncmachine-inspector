import 'source-map-support/register'
import Layout from '../../src/ui/joint-layout'
import { dia } from 'jointjs'
import { expect } from 'chai'
import graph_json from '../fixtures/data-joint-graph'


describe("Dagre", function() {

	let joint_graph: dia.Graph;
	let layout: Layout
	let clusters = 20

	before(function() {
		joint_graph = new dia.Graph()
		joint_graph.fromJSON(graph_json)
		layout = new Layout(joint_graph)
	})

	describe('convertion', function() {
		it('should convert the source JointJS graph')

		it('should produce a graph per each of the clusters', () => {
			let graphs = layout.sub_graphs
			expect(graphs.size).to.eql(clusters)
			for (let graph of graphs.values()) {
				expect(graph.edges().length).to.above(1)
			}
		})

		it('should produce a graph with merged cluster nodes', function() {
			let graph = layout.cluster_graph
			expect(graph.nodes()).to.have.lengthOf(clusters)
			expect(graph.edges()).to.have.lengthOf(12)
		})
	})

	describe('layout', function() {

		it('should layout all the graphs', function() {
			layout.layout()
			expect(layout.cluster_graph.nodes()).to.have.lengthOf(clusters)
			// console.log(JSON.stringify(layout.source_graph.toJSON()))
		})

		it('should propagate changes to the source grap')
	})

})