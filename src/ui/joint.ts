import Graph from 'graphs'
import {
	INetworkJson,
	State
} from './joint-network'
import UiBase from './graph'
import * as joint from 'jointjs'
import * as $ from 'jquery'
import * as assert from 'assert/'
import * as jsondiffpatch from 'jsondiffpatch'
import * as debounce from 'throttle-debounce/debounce'
import * as deepcopy from 'deepcopy'
import * as colors from 'material-ui/styles/colors' 
import * as randomNumber from 'random-number'
import * as Stylesheet from 'stylesheet.js'
// TODO shim Object.entries


type IDelta = jsondiffpatch.IDelta

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui extends UiBase<INetworkJson> {

	container: JQuery;

	paper: joint.dia.Paper
	graph: joint.dia.Graph

	available_colors: string[] = [];
	group_colors = {};
	stylesheet: Stylesheet;

	constructor(
			public data: INetworkJson) {
			
		super(data)
		this.graph = new joint.dia.Graph();
		this.stylesheet = new Stylesheet
		this.parseColors()
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

		this.setData(this.data, true)

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
			maxScale: 1.5,
			padding: 10
		})
		this.paper.setDimensions(width*2, height*2)
	}

	// TODO add scrolling by click-n-drag
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
		this.syncActiveClasses()
		this.assignColors()
		this.autosize()
	}

	parseColors() {
		// 37 colors, TODO find more
		this.available_colors = []
		for (let color of Object.keys(colors)) {
			if (color.slice(-3) != '100' || color.slice(-4) == 'A100')
				continue
			this.available_colors.push(color.slice(0, -3))
		}
	}

	getGroups() {
		return this.graph.attributes.cells.models.filter( node => (
			node.attributes.type == 'uml.State' ))
	}

	getRandomColor(): string {
		if (!this.available_colors.length)
			return null
		let index = randomNumber({
			min: 0,
			max: this.available_colors.length - 1,
			integer: true
		})
		let color = this.available_colors[index]
		// remove the color
		this.available_colors.splice(index, 1)
		return color
	}

	assignColors() {
		for (let group of this.getGroups()) {
			let id = group.get('id')
			if (this.group_colors[id])
				continue
			let color = this.getRandomColor()
			this.group_colors[id] = color
			this.applyColor(group, color)
		}
	}

	applyColor(group, color_name) {
		let fg = colors[color_name + '200']
		let bg = colors[color_name + '100']
		group.attr('path/stroke', fg)
		group.attr('rect/stroke', fg)
		group.attr('rect/fill', bg)
		this.stylesheet.addRule(
			`.group-${group.get('id')}`,
			`color: ${fg};`
		)
	}

	syncActiveClasses() {
		// TODO this should sync from models, not the JSON 
		this.data.cells.forEach( cell => this.setActiveClass(cell) )
	}

	setActiveClass(cell) {
		joint.V(this.paper.findViewByModel(cell).el)
			.toggleClass('is-set', Boolean(cell.is_set));
	}
	
	setData(data, inital = false) {
		var canPatch = false
		var diff
		if (!inital && this.data) {
			// TODO maybe setting all the cells with cell.set() will be faster?
			diff = jsondiffpatch.create({
					objectHash: (node) => node.id
				}).diff(this.data, data)
			if (!diff || !diff.cells)
				return
			// checks if the changes include only the states (not machines or links)
			// TODO support patching of more types
			canPatch = Object.keys(diff.cells).every( key => {
				if (key == '_t')
					return true
				return data.cells[key].type == "fsa.State"
			})
		}
		
		if (canPatch) {
			this.patchElements(diff, data)
			this.data = deepcopy(data)
		} else {
			this.data = deepcopy(data)
			this.graph.fromJSON(this.data)
			this.layout()
		}
	}

	patchElements(patch: IDelta, data: INetworkJson) {
		for (let key of Object.keys(patch.cells)) {
			if (key == '_t')
				continue
			// TODO assumes this.data didnt mutate
			let cell = this.graph.getCell(this.data.cells[key].id)
			cell.set(data.cells[key])
			this.setActiveClass(cell.attributes)
		}
	}
}
