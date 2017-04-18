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
// TODO import only required parts
import * as joint from 'jointjs'
import 'jointjs/src/vectorizer';
declare const Vectorizer;
import * as $ from 'jquery'
import { throttle } from 'underscore'
import g from '../vendor/geometry'
import * as _ from 'underscore'
import * as assert from 'assert/'
import * as jsondiffpatch from 'jsondiffpatch'
import * as debounce from 'throttle-debounce/debounce'
import * as deepcopy from 'deepcopy'
import * as colors from 'material-ui/styles/colors'
import * as randomNumber from 'random-number'
import * as Stylesheet from 'stylesheet.js'
import GraphLayout from './joint-layout'
import * as svgPanZoom from 'svg-pan-zoom'
// import * as morphdom from 'morphdom'


type IDelta = jsondiffpatch.IDeltas

// simplify the link markup
// TODO put into the right place
joint.shapes.fsa.Arrow = joint.shapes.fsa.Arrow.extend({
  markup: '<path class="connection"/><path class="marker-target"/><g class="labels" />'
});

// distance between multiple links
const link_gap = 40

const log = (...args) => {}

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
	layout: GraphLayout;
	layout_worker;

	available_colors: string[] = [];
	group_colors = {};
	stylesheet: Stylesheet;

	// TODO responsive to the screen size
	width = 5000;
	height = 3500;

	zoom_max = 1.5;
	zoom_min = 0.5;
	zoom_factor = 30;
	drag_tick_ms = 10;
	drag_start_pos: {x: number, y: number};

	constructor(
			public data: INetworkJson) {
			
		super(data)
		this.graph = new joint.dia.Graph();
		this.initGraphLayout()
		this.stylesheet = new Stylesheet
		this.parseColors()
	}

	initGraphLayout() {
		this.layout = new GraphLayout(this.graph)
	}

	reset() {
		this.graph.clear()
		this.initGraphLayout();
		// TODO reset stylesheet and color assignments
	}

	async render(el) {
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
			})

			this.bindMouseZoom()

			var myAdjustVertices = _.partial(adjustVertices, this.graph);

			// adjust vertices when a cell is removed or its source/target
			// was changed
			this.graph.on('add remove change:source change:target', myAdjustVertices);

			// TODO bind to on machine drag

			// also when an user stops interacting with an element.
			this.paper.on('cell:pointerup', myAdjustVertices);
		}

		if (this.data)
			await this.setData(this.data)

		// let start = Date.now()
		// morphdom(this.container.get(0), this.vdom_container.get(0))
		// console.log(`DOM sync ${Date.now() - start}ms`)
	}

	// TODO layout_data?
	async setData(data: INetworkJson, layout_data,
			changed_cells: Iterable<string> = null) {
		const first_run = !this.data

		this.data = data
		let start = Date.now()

		// TODO async
		this.layout.setData(this.data, changed_cells)

		if (this.paper._frameId) {
			await new Promise(resolve => this.paper.once('render:done', () => {
				// TODO mutex on setdata till here
				resolve()
			}))
		}

		if (first_run) {
			for (const cell of this.graph.getCells())
				adjustVertices(this.graph, cell)
		}

		log(`Overall setData ${Date.now() - start}ms`)
	}

	async updateCells(cells: Iterable<string>, was_add_remove: boolean = false,
			layout_data) {
		if (!was_add_remove) {
			this.patchCells(cells)
		} else {
			await this.setData(this.data, layout_data, cells)
		}
		this.postUpdateLayout(cells)
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

		let graph_width = this.layout.clusters.graph().width
		let graph_height = this.layout.clusters.graph().height

		let scale = Math.min(
    	Math.min(this.maxScale, Math.max(this.minScale, visible_width / graph_width)),
    	Math.min(this.maxScale, Math.max(this.minScale, visible_height / graph_height))
		)
		this.paper.scale(scale, scale);
	}

	// TODO add scrolling by click-n-drag
	postUpdateLayout(cells?) {
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
		log(`Sync classes ${tmp2- tmp1}ms`)
		this.assignColors()
		tmp1 = tmp2
		tmp2 = Date.now()
		log(`Assign colors ${tmp2- tmp1}ms`)
		// tmp2 = Date.now()
		// this.autosize()
		// log(`Autosize ${Date.now() - tmp2}ms`)
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

	bindMouseZoom() {
		const drag_listener = throttle((e => this.dragScrollListener(e)),
			this.drag_tick_ms)
		let drag_enabled = false
		this.paper.on('blank:pointerdown', () => {
			drag_enabled = true
			this.container.mousemove(drag_listener)
		})
		this.container.on('mousedown', (event, x, y) => {
			if (!drag_enabled)
				return
			const el = this.container.get(0)
			this.drag_start_pos = {
				x: event.clientX + el.scrollLeft,
				y: event.clientY + el.scrollTop
			}
		})
		this.paper.on('cell:pointerup blank:pointerup', () => {
			this.drag_start_pos = null
			drag_enabled = false
			this.container.unbind('mousemove', drag_listener)
		})
		this.paper.$el.on('mousewheel DOMMouseScroll', (e) => this.mouseZoomListener(e))
	}

	dragScrollListener(e) {
		// assert(this.drag_start_pos)
		if (!this.drag_start_pos)
			return
		const el = this.container.get(0)
		el.scrollLeft += this.drag_start_pos.x - e.offsetX
		el.scrollTop += this.drag_start_pos.y - e.offsetY
				- $('.toolbar').get(0).clientHeight
	}

	mouseZoomListener(e) {
		e.preventDefault();
		let ev: MouseWheelEvent = e.originalEvent as MouseWheelEvent
		let delta = Math.max(-1, Math.min(1, (ev.wheelDelta || -ev.detail)))
			/ this.zoom_factor;
		let offsetX = (e.offsetX || e.clientX - $(this).offset().left);
		let offsetY = (e.offsetY || e.clientY - $(this).offset().top);
		let p = this.offsetToLocalPoint(offsetX, offsetY);
		let newScale = Vectorizer(this.paper.viewport).scale().sx + delta;
		if (newScale > this.zoom_min && newScale < this.zoom_max) {
			this.paper.setOrigin(0, 0);
			this.paper.scale(newScale, newScale, p.x, p.y);
		}
	}

	offsetToLocalPoint(x, y) {
		let svgPoint = this.paper.svg.createSVGPoint();
		svgPoint.x = x;
		svgPoint.y = y;

		let pointTransformed = svgPoint.matrixTransform(
			this.paper.viewport.getCTM().inverse());
		return pointTransformed;
	}
}


// TODO separate file
// http://resources.jointjs.com/tutorial/multiple-links-between-elements
function adjustVertices(graph, cell) {

	// If the cell is a view, find its model.
	cell = cell.model || cell;

	if (cell instanceof joint.shapes.uml.State) {
    for (const child of cell.getEmbeddedCells())
      adjustVertices(graph, child)

    return;
	} else if (cell instanceof joint.dia.Element) {

		_.chain(graph.getConnectedLinks(cell)).groupBy(function(link) {
			// the key of the group is the model id of the link's source or target, but not our cell id.
			return _.omit([link.get('source').id, link.get('target').id], cell.id)[0];
		}).each(function(group, key) {
			// If the member of the group has both source and target model adjust vertices.
			if (key !== 'undefined') adjustVertices(graph, _.first(group));
		});

		return;
	}

	// The cell is a link. Let's find its source and target models.
	var srcId = cell.get('source').id || cell.previous('source').id;
	var trgId = cell.get('target').id || cell.previous('target').id;

	// If one of the ends is not a model, the link has no siblings.
	if (!srcId || !trgId) return;

	var siblings = _.filter(graph.getLinks(), function(sibling) {

		var _srcId = sibling.get('source').id;
		var _trgId = sibling.get('target').id;

		return (_srcId === srcId && _trgId === trgId) || (_srcId === trgId && _trgId === srcId);
	});

	switch (siblings.length) {

		case 0:
			// The link was removed and had no siblings.
			break;

		case 1:
			// There is only one link between the source and target. No vertices needed.
			cell.unset('vertices');
			break;

		default:

			// There is more than one siblings. We need to create vertices.

			// First of all we'll find the middle point of the link.
			var srcCenter = graph.getCell(srcId).getBBox().center();
			var trgCenter = graph.getCell(trgId).getBBox().center();
			var midPoint = g.line(srcCenter, trgCenter).midpoint();

			// Then find the angle it forms.
			var theta = srcCenter.theta(trgCenter);

			// This is the maximum distance between links
			var gap = link_gap;

			_.each(siblings, function(sibling, index) {

				// We want the offset values to be calculated as follows 0, 20, 20, 40, 40, 60, 60 ..
				var offset = gap * Math.ceil(index / 2);

				// Now we need the vertices to be placed at points which are 'offset' pixels distant
				// from the first link and forms a perpendicular angle to it. And as index goes up
				// alternate left and right.
				//
				//  ^  odd indexes
				//  |
				//  |---->  index 0 line (straight line between a source center and a target center.
				//  |
				//  v  even indexes
				var sign = index % 2 ? 1 : -1;
				var angle = g.toRad(theta + sign * 90);

				// We found the vertex.
				var vertex = g.point.fromPolar(offset, angle, midPoint);

				sibling.set('vertices', [{ x: vertex.x, y: vertex.y }]);
			});
	}
};
