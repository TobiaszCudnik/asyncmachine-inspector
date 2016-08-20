import Graph from 'graphs'
import {
	INetworkJson,
	State
} from './joint-network'
import UiBase from './graph'
import * as joint from 'jointjs'
import * as $ from 'jquery'
import * as assert from 'assert/'
import { IDelta } from 'jsondiffpatch'
import * as debounce from 'throttle-debounce/debounce'

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui extends UiBase<INetworkJson> {

	container: JQuery;

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
				gridSize: 1,
				model: this.graph
			});
		}

		this.setData(this.data)

		// TODO debounce
		window.addEventListener('resize', debounce(500, false, 
			() => this.autosize() ))
	}

	// TODO buggy, the svg element doesnt get expanded after a min scale has been achieved
	autosize() {
		let width = this.container.width() - 2
		let height = this.container.height() - 2
		this.paper.setDimensions(width, height)
		this.paper.scaleContentToFit({
			minScale: 0.5,
			padding: 10
		})
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
		this.autosize()
	}

	setActiveClass() {
		// set the active class 
		for (let cell of this.data.cells) {
			joint.V(this.paper.findViewByModel(cell).el)
				.toggleClass('is-set', cell.is_set);
		}
	}
	
	setData(data) {
		this.data = data
		this.graph.fromJSON(this.data)
		this.layout()
	}
}
