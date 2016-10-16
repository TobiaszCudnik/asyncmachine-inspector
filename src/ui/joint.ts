import Graph from 'graphs'
import {
	INetworkJson,
	State,
	Machine,
	Link
} from './joint-network'
import { TransitionStepTypes } from 'asyncmachine'
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


type IDelta = jsondiffpatch.IDelta

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 * TODO
 * - machine colors in the msg
 * - save calculated layout positions, so when scrolling theres no delay
 * - calculate positions using the WebCole library
 * - show the number of steps
 * - use cell highlighters `cellView.highlight();`	
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

		if (this.data)
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
			padding: 10,
			// TODO this makes padding a bit less bad
			fittingBBox: { x: 0, y: 0 }
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
				top: 40, left: 20, right: 20, bottom: 20 }
		})
		this.syncClasses()
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

	getColor(group): string {
		// TODO constant color per group (by ID)
		if (!this.available_colors.length)
			return null
		let index = [...group.id]
			.map( a => a.charCodeAt(0) )
			.reduce( (prev, curr) => (prev || 0) * curr )
		index = index % (this.available_colors.length - 1)
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
			let color = this.getColor(group)
			this.group_colors[id] = color
			this.applyColor(group, color)
		}
	}

	applyColor(group, color_name) {
		let fg = colors[color_name + '200']
		let bg = colors[color_name + '100']
		this.stylesheet.addRule(
			`.group-${group.get('id')}`,
			`color: ${fg};`
		)
		this.stylesheet.addRule(
			`.group-${group.get('id')} path`,
			`stroke: ${fg};`
		)
		this.stylesheet.addRule(
			`.group-${group.get('id')} rect`,
			`stroke: ${fg}; fill: ${bg};`
		)
	}

	diffAddsRemovesElements(diff: IDelta) {
		return Object.keys(diff.cells).some( key => {
			if (key == '_t' || !(diff.cells[key] instanceof Array))
				return false

			// added elements have the length of 1 (replaced and removed have 2)
			return diff.cells[key].length !== 2
		})
	}
	
	setData(data, inital = false) {
		var canPatch = false
		var diff
		if (!inital && this.data) {
			// TODO avoid double diff
			// TODO maybe setting all the cells with cell.set() will be faster?
			diff = jsondiffpatch.create({
					objectHash: (node) => node.id
				}).diff(this.data, data)
			if (!diff || !diff.cells)
				return
			canPatch = !this.diffAddsRemovesElements(diff)
		}
		
		if (canPatch) {
			this.patchElements(diff, data)
			this.data = deepcopy(data)
			// TODO sync only altered elements
			this.syncClasses()
		} else {
			this.data = deepcopy(data)
			this.graph.fromJSON(this.data)
			this.layout()
		}
	}

	syncClasses() {
		this.syncMachineClasses()
		this.syncStateClasses()
		this.syncLinkClasses()
	}

	// TODO define class on the server
	// TODO this should sync from models, not JSON
	syncLinkClasses() {
		this.data.cells
				.filter( node => node.type == "fsa.Arrow" )
				.forEach( (link: Link) => {
			if (!this.paper.findViewByModel(link))
				return
			// handle link types
			let classNames = (link.labels["0"].attrs.text.text || 'pipe')
					.split(' ')
			let view = joint.V(this.paper.findViewByModel(link).el)
			for (let name of classNames)
				view.addClass(name)
			// handle the touched state
			view.toggleClass('is-touched', Boolean(link.is_touched))
		})
	}

	// TODO define class on the server
	// TODO this should sync from models, not JSON
	syncMachineClasses() {
		this.data.cells
				.filter( node => node.type == "uml.State" )
				.forEach( (machine: Machine) => {
			let view = joint.V(this.paper.findViewByModel(machine).el)
			// TODO edit the main template
			view.find('path')[0].attr('d',
				view.find('path')[0].attr('d').replace(/ 20 ?/g, ' 30'))
			if (!this.paper.findViewByModel(machine))
				return
			// handle the touched state
			view.toggleClass('is-touched', Boolean(machine.is_touched))
			view.addClass('group-' + machine.id)
		})
	}

	// TODO this should sync from models, not JSON
	syncStateClasses() {
		this.data.cells
				.filter( node => node.type == "fsa.State" )
				.forEach( (state: State) => {
			if (!this.paper.findViewByModel(state))
				return
			let view = joint.V(this.paper.findViewByModel(state).el)
			// active state
			view.toggleClass('is-set', Boolean(state.is_set))
			// touched state
			view.toggleClass('is-touched', Boolean(state.step_style))
			// step type classes
			for (let key of Object.keys(TransitionStepTypes)) {
				// skip labels
				if (typeof TransitionStepTypes[key] !== 'number')
					continue
				let classname = 'step-' + key.toLowerCase()
						.replace('_', '-')
				view.toggleClass(classname, Boolean(state.step_style & TransitionStepTypes[key]))
			}
		})
	}

	patchElements(patch: IDelta, data: INetworkJson) {
		for (let key of Object.keys(patch.cells)) {
			if (key == '_t')
				continue
			// TODO assumes this.data didnt mutate
			let cell = this.graph.getCell(this.data.cells[key].id)
			cell.set(data.cells[key])
			// this.setActiveClass(cell.attributes)
		}
	}
}
