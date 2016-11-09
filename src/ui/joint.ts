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
import GraphLayout from './joint-layout-json'
// import * as morphdom from 'morphdom'


type IDelta = jsondiffpatch.IDeltas

// simplify the link markup
joint.shapes.fsa.Arrow = joint.shapes.fsa.Arrow.extend({
    markup: '<path class="connection"/><path class="marker-target"/><g class="labels" />'
});

/**
 * Fiddles:
 * http://jsfiddle.net/user/kumilingus/fiddles/3/
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 * TODO
 * - machine colors in the msg
 * - save calculated layout positions, so when scrolling theres no delay
 * - calculate positions using the WebCole library
 * - show the number of steps
 * - use cell highlighters `cellView.highlight();`
 * - update jointjs to 1.0
 * - switch autolayout to ciena-blueplanet/dagre
 * 
 * TODO
 * - slim links
 * http://jsfiddle.net/kumilingus/fjzvqhhk/
 * - clone cells from existing cells
 * http://jsfiddle.net/kumilingus/fjzvqhhk/
 */
export default class Ui extends UiBase<INetworkJson> {

	container: JQuery;

	paper: joint.dia.Paper
	graph: joint.dia.Graph
	graph_layout: GraphLayout;

	available_colors: string[] = [];
	group_colors = {};
	stylesheet: Stylesheet;

	width = 5000;
	height = 3500;

	minScale = 0.3;
	maxScale = 1.5;

	constructor(
			public data: INetworkJson) {
			
		super(data)
		this.graph = new joint.dia.Graph();
		this.graph_layout = new GraphLayout(this.graph)
		this.stylesheet = new Stylesheet
		this.parseColors()
	}

	render(el) {
		this.container = $(el)
		// this.container = $('<div/>')
		assert(this.container)

		if (!this.paper) {
			this.paper = new joint.dia.Paper({
				el: this.container,
				// TODO make it work
				async: true,
				gridSize: 1,
				model: this.graph,
				width: this.width,
				height: this.height,
				// TODO check these
				// defaultLink: new joint.dia.Link({
				// 	router: { name: 'manhattan', args: { step: 20 } },
				// 	connection: { name: 'orthogonal' },
				// 	attrs: {
				// 		'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#fff', stroke: '#000' },
				// 		'.link-tools .tool-remove circle, .marker-vertex': { r: 8 },
				// 		'.connection': {
				// 				stroke: '#000', 'stroke-width': 1
				// 		}
				// 	}
				// }),
				interactive: {
					vertexAdd: false
				}
			});
			// TODO debounce
			window.addEventListener('resize', debounce(500, false, 
				() => this.autosize() ))
		}

		if (this.data)
			this.setData(this.data, true)

		// let start = Date.now()
		// morphdom(this.container.get(0), this.vdom_container.get(0))
		// console.log(`DOM sync ${Date.now() - start}ms`)
	}

	// TODO buggy, the svg element doesnt get expanded after a min scale has been achieved
	autosize() {
		let visible_width = this.container.width()
		let visible_height = this.container.height()

		let graph_width = this.graph_layout.clusters.graph().width
		let graph_height = this.graph_layout.clusters.graph().height

		let scale = Math.min(
        	Math.min(this.maxScale, Math.max(this.minScale, visible_width / graph_width)),
        	Math.min(this.maxScale, Math.max(this.minScale, visible_height / graph_height))
		)
		this.paper.scale(scale, scale);
	}

	// TODO add scrolling by click-n-drag
	layout() {
		// lay out the graph
		// joint.layout.DirectedGraph.layout(this.graph, {
		// 	// TODO check verticles from dagre
		// 	// setLinkVertices: true,
		// 	// setVertices: (link, points) => {
		// 	// 	points[0] = link.findView(this.paper).sourcePoint
		// 	// 	points[points.length-1] = link.findView(this.paper).targetPoint
		// 	// 	link.set('vertices', points);
		// 	// },
		// 	rankDir: 'TB',
		// 	marginX: 50,
		// 	marginY: 50,
		// 	clusterPadding: {
		// 		top: 40, left: 20, right: 20, bottom: 20 }
		// 	// TODO check resizeClusters: true
		// })
		let start = Date.now()
		let tmp1 = start
		this.syncClasses()
		let tmp2 = Date.now()
		console.log(`Sync classes ${tmp2- tmp1}ms`)
		this.assignColors()
		tmp1 = tmp2
		tmp2 = Date.now()
		console.log(`Assign colors ${tmp2- tmp1}ms`)
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

	diffToCells(source, target, diff: IDelta): (State | Link | Machine)[] {
		if (!diff.cells)
			return []

		let changed = []
		for (let key of Object.keys(diff.cells)) {
			if (key == '_t')
				continue
			if (key[0] == '_')
				changed.push(source.cells[key.slice(1)])
			else
				changed.push(target.cells[key])
		}

		return changed
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
		let start = Date.now()
		let changed_cells
		let can_patch = false
		let diff

		if (!inital && this.data) {
			diff = jsondiffpatch.create({
				objectHash: (node) => node.id
			}).diff(this.data, data)
			console.log(`Diff ${Date.now() - start}ms`)
			if (!diff)
				return
			console.log('diff', diff)
			can_patch = !this.diffAddsRemovesElements(diff)
			changed_cells = this.diffToCells(this.data, data, diff)

			console.log(`${changed_cells.length} cells changed`)

			if (!changed_cells.length)
				return
		}

		if (can_patch) {
			// this.patchElements(changed_cells)
			let start = Date.now()
			this.patchElements(diff, data)
			console.log(`Patch elements ${Date.now() - start}ms`)
			this.data = deepcopy(data)
			this.syncClasses()
		} else {
			this.data = deepcopy(data)
			console.log(`clone ${Date.now() - start}ms`)
			this.graph_layout.fromJson(this.data)
			this.paper.on('render:done', () => {
				// TODO mutex on setdata till here
				this.layout()
				console.log(`Overall ${Date.now() - start}ms`)
			})

			let tmp2 = Date.now()
			this.autosize()
			console.log(`Autosize ${Date.now() - tmp2}ms`)
		}

		console.log(`setData ${Date.now() - start}ms`)
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

	// patchElements(changed_cells) {
	// 	this.graph.resetCells(changed_cells)
	// }

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
