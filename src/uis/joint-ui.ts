
import Graph from 'graphs'
import {
	JsonDiffFactory,
	INetworkJson,
	State
} from './joint-network'
import * as jsondiffpatch from 'jsondiffpatch'
import UiBase from './ui'
import * as joint from 'jointjs'
import * as $ from 'jquery'

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui extends UiBase<JsonDiffFactory> {

	container: Element;
	width = 800;
	height = 600;

	paper: joint.dia.Paper
	graph: joint.dia.Graph

	constructor(
			public data: JsonDiffFactory) {
			
			super(data)
			this.graph = new joint.dia.Graph();
	}

	render(el) {
		// TODO customizable container
		this.container = $(el)
		assert(el)

		this.paper = new joint.dia.Paper({
				el: el,
				width: 800,
				height: 600,
				gridSize: 1,
				model: this.graph
		});
	}
	
	patch(diff: INetworkJson) {
		jsondiffpatch.patch(this.data, diff)
		this.render(this.container)
	}
}
