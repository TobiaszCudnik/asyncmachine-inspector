import Graph from 'graphs'
import {
	INetworkJson,
	State
} from './joint-network'
import UiBase from './ui'
import * as joint from 'jointjs'
import * as $ from 'jquery'
import * as assert from 'assert/'
import { IDelta } from 'jsondiffpatch'

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui extends UiBase<INetworkJson> {

	container: JQuery;
	width = 800;
	height = 600;

	paper: joint.dia.Paper
	graph: joint.dia.Graph

	constructor(
			public data: INetworkJson) {
			
			super(data)
			this.graph = new joint.dia.Graph();
	}

	render(el) {
		this.container = $(el)
		assert(this.container)

		if (!this.paper) {
			this.paper = new joint.dia.Paper({
				el: this.container,
				width: 800,
				height: 600,
				gridSize: 1,
				model: this.graph
			});
		}

		this.graph.fromJSON(this.data)
		this.layout()
	}

	layout() {
		// lay out the graph
		joint.layout.DirectedGraph.layout(this.graph, {
			// setLinkVertices: true,
			// setVertices: (link, points) => {
			// 	points[0] = link.findView(this.paper).sourcePoint
			// 	points[points.length-1] = link.findView(this.paper).targetPoint
			// 	link.set('vertices', points);
			// },
			rankDir: 'TB',
			marginX: 50,
			marginY: 50,
			clusterPadding: {
				top: 30, left: 10, right: 10, bottom: 10 }
		})
		this.setActiveClass()
	}

	setActiveClass() {
		// set the active class 
		for (let cell of this.data.cells) {
			joint.V(this.paper.findViewByModel(cell).el)
				.toggleClass('is-set', cell.is_set);
		}
	}
	
	patch(diff: IDelta) {
		super.patch(diff)
		this.graph.fromJSON(this.data)
		this.layout()
		// this.render(this.container)
	}
}
