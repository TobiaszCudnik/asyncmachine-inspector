import Graph from 'graphs'
import {
	INetworkJson,
	TState,
	TMachine,
	TLink,
	TCell
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
import GraphLayout from './joint-layout'
// import * as morphdom from 'morphdom'


type IDelta = jsondiffpatch.IDeltas

// simplify the link markup
// TODO put into the right place
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
 * - hightlight/strike through required dependencies of auto states
 * - mark which machines queue is currently executing
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
			window.addEventListener('resize', debounce(500, false, 
				() => this.autosize() ))
		}

		if (this.data)
			this.setData(this.data)

		// let start = Date.now()
		// morphdom(this.container.get(0), this.vdom_container.get(0))
		// console.log(`DOM sync ${Date.now() - start}ms`)
	}
	
	async setData(data: INetworkJson, changed_cells: Iterable<string> = null) {
		this.data = data
		let start = Date.now()

		// TODO async
		this.graph_layout.setData(this.data, changed_cells)

		if (this.paper._frameId) {
			await new Promise(resolve => this.paper.once('render:done', () => {
				// TODO mutex on setdata till here
				resolve()
			}))
		}
		
		this.layout(changed_cells)

		console.log(`Overall setData ${Date.now() - start}ms`)
	}

	updateCells(cells: Iterable<string>, was_add_remove: boolean = false) {
		if (!was_add_remove) {
			this.patchCells(cells)
			this.layout(cells)
		} else {
			this.setData(this.data, cells)
		}
	}

	patch_fields = ['step_style', 'is_set', 'is_touched']

	patchCells(cell_ids: Iterable<string>) {
		for (let cell of this.getDataCellsByIds(cell_ids)) {
			let model = this.graph.getCell(cell.id)
			for (let field of this.patch_fields) {
				if (!cell.hasOwnProperty(field))
					continue
				model.set(field, cell[field])
			}
		}
	}

	getDataCellsByIds(cell_ids: Iterable<string>): TCell[] {
		let ids = [...cell_ids]
		return this.data.cells.filter( cell => ids.includes(cell.id))
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
	layout(cells?) {
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
		this.syncClasses(cells ? [...cells] : null)
		let tmp2 = Date.now()
		console.log(`Sync classes ${tmp2- tmp1}ms`)
		this.assignColors()
		tmp1 = tmp2
		tmp2 = Date.now()
		console.log(`Assign colors ${tmp2- tmp1}ms`)
		tmp2 = Date.now()
		this.autosize()
		console.log(`Autosize ${Date.now() - tmp2}ms`)
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

	syncClasses(changed_cells?) {
		if (!changed_cells)
			changed_cells = this.data.cells.map( cell => cell.id ) 
		this.syncMachineClasses(changed_cells)
		this.syncStateClasses(changed_cells)
		this.syncLinkClasses(changed_cells)
	}

	// TODO define class on the server
	// TODO this should sync from models, not JSON
	syncLinkClasses(changed_cells: string[]) {
		changed_cells
				.map( id => this.graph.getCell(id) )
				.filter( node => node && node.get('type') == "fsa.Arrow" )
				.forEach( link => {
			if (!this.paper.findViewByModel(link))
				return
			// handle link types
			let classNames = (link.get('labels')["0"].attrs.text.text || 'pipe')
					.split(' ')
			let view = joint.V(this.paper.findViewByModel(link).el)
			for (let name of classNames)
				view.addClass(name)
			// handle the touched state
			view.toggleClass('is-touched', Boolean(link.get('is_touched')))
		})
	}

	// TODO define class on the server
	// TODO this should sync from models, not JSON
	syncMachineClasses(changed_cells: string[]) {
		changed_cells
				.map( id => this.graph.getCell(id) )
				.filter( node => node && node.get('type') == "uml.State" )
				.forEach( machine => {
			if (!this.paper.findViewByModel(machine))
				return
			let view = joint.V(this.paper.findViewByModel(machine).el)
			// TODO edit the main template
			// view.find('path')[0].attr('d',
			// 	view.find('path')[0].attr('d').replace(/ 20 ?/g, ' 30'))
			if (!this.paper.findViewByModel(machine))
				return
			// handle the touched state
			view.toggleClass('is-touched', Boolean(machine.get('is_touched')))
			view.addClass('group-' + machine.id)
		})
	}

	// TODO this should sync from models, not JSON
	syncStateClasses(changed_cells: string[]) {
		changed_cells
				.map( id => this.graph.getCell(id) )
				.filter( node => node && node.get('type') == "fsa.State" )
				.forEach( state => {
			// state = state as joint.dia.Cell
			if (!this.paper.findViewByModel(state))
				return
			let view = joint.V(this.paper.findViewByModel(state).el)
			// active state
			view.toggleClass('is-set', Boolean(state.get('is_set')))
			// touched state
			view.toggleClass('is-touched', Boolean(state.get('step_style')))
			// step type classes
			for (let key of Object.keys(TransitionStepTypes)) {
				// skip labels
				if (typeof TransitionStepTypes[key] !== 'number')
					continue
				let classname = 'step-' + key.toLowerCase()
						.replace('_', '-')
				view.toggleClass(classname, Boolean(state.get('step_style') & TransitionStepTypes[key]))
			}
		})
	}
}
