import StateGraph, {
	Node,
	ExternalNode
} from './stategraph'
import d3 from 'd3'
import _ from 'lodash'
import * as am from 'asyncmachine'
import Graph from 'graphs'

export interface D3StateGraph extends StateGraph {
	graph: Graph<D3Node>
}

export interface D3AsyncMachine extends am.AsyncMachine, D3.Geom.Point {
	x: number;
	y: number;
}

export class D3Node extends Node implements D3.Geom.Point {
	machine: D3AsyncMachine;
    externals: D3ExternalNode[];
	x: number;
	y: number;
}

export class D3ExternalNode implements ExternalNode, D3.Geom.Point {
	x: number;
	y: number;
	constructor(
		public node: D3Node,
		public machine: D3AsyncMachine
		){}
}

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui {

	stateGraph: D3StateGraph;
	color: D3.Scale.OrdinalScale;
	node_color: D3.Scale.OrdinalScale;
	width: number;
	height: number;
	layout: D3.Layout.ForceLayout;
	node_layouts: Map<am.AsyncMachine, D3.Layout.ForceLayout>;
	container: D3.Selection;
	links: D3.Layout.GraphLinkForce[];
	machine_nodes: D3.Selection;
	ticksPerRender = 3;

	constructor(stateGraph: D3StateGraph) {

		this.stateGraph = stateGraph

		this.width = 800,
		this.height = 600;

		this.color = d3.scale.category20()

		this.layout = d3.layout.force()
			.charge(-120)
			.linkDistance(200)
			.size([this.width, this.height])
		this.node_color = d3.scale.category20c();

		this.node_layouts = new Map<am.AsyncMachine,
			D3.Layout.ForceLayout>();
			
		this.machines.forEach( (machine) => {
			let size = machine.states_all.length * 8
			var layout = d3.layout.force()
				.charge(-60)
				.linkDistance(50)
				.size([size, size])

			// redraw on changes
			machine.on('change', layout.tick.bind(layout))
			this.node_layouts.set(machine, layout)
		})

		this.container = d3.select("body").append("svg")
			.attr("width", this.width)
			.attr("height", this.height)
	}

	get machines(): D3AsyncMachine[] {
		return <D3AsyncMachine[]>_.chain(this.stateGraph.nodes)
			.pluck('machine').uniq().value()
	}

	nodes(machine) {
		var nodes = [];

		this.stateGraph.graph.forEach(node => {
			if (node.machine !== machine)
				return

			nodes.push(node)
			// Collect external nodes to which the current node points to
			var links_from = this.stateGraph.graph.from(node)
			for (let target of links_from) {
				if (target.machine !== machine) {
					node.externals.push(new D3ExternalNode(
						target, node.machine
					))
				}
			}

			// Collect external nodes pointing to this one
			for (let source of this.stateGraph.graph.to(node)) {
				if (source.machine !== machine && !links_from.has(source)) {
					node.externals.push(new D3ExternalNode(
						source, node.machine
					))
				}
			}

			nodes.push.apply(nodes, node.externals)
		})

		return nodes;
	}

	get machine_links(): D3.Layout.GraphLinkForce[] {
		var links = [];

		this.stateGraph.graph.traverse( (from, to) => {
			if (from.machine == to.machine)
				return

			// TODO duplicates
			links.push({
				source: from.machine,
				target: to.machine,
				value: 1
			})
		})

		return links
	}

	node_links(machine) {
		var links: D3.Layout.GraphLinkForce[] = []

		this.stateGraph.graph.traverse( (from, to) => {
			if (to.machine !== from.machine && to.machine === machine) {
				for (let external of to.externals) {
					if (external.node == to || external.node == from) {
						links.push({
							source: external,
							target: to,
							value: 1
						})
					}
				}
			}			

			if (from.machine !== machine)
				return

			if (to.machine !== from.machine) {
				for (let external of from.externals) {
					if (external.node == to || external.node == from) {
						var target = external
						// TODO support more
						break
					}
				}
			} else
				var target = to

			links.push({
				source: from,
				target: target,
				value: 1
			})
		})

		return links
	}

	render() {
		this.renderMachineNodes()
		this.renderStateNodes()
	}

	renderMachineNodes() {
		var machines = this.machines
		var links = this.machine_links
		var color = d3.scale.category20();

		this.layout
			// TODO support the ID getter
			.nodes(machines)
			.links(links)
			//.on('start', () => {
			//	requestAnimationFrame(this.redrawMachineNodes.bind(this))
			//})

		this.machine_nodes = this.container.selectAll(".node.machine")
			.data(machines)
			.enter().append("g")
				.attr("class", "node machine")
				.attr("id", d => { return this.stateGraph.machine_id(d) })
				.call(this.layout.drag)

		this.machine_nodes.append("circle")
			.attr("r", d => d.states_all.length * 20)
			.style("fill", d => { return color(this.stateGraph.machine_id(d)) })

		this.machine_nodes.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function(d) { return d.name });

		this.machine_nodes.append("title")
			.text( d => { return d.name; });

		this.layout.start()
			.on('tick', () => {
				requestAnimationFrame(this.redrawMachineNodes.bind(this))
			})
	}

	redrawMachineNodes() {
		this.machine_nodes.attr("transform", (d) => {
			return "translate(" + d.x + "," + d.y + ")"
		})
	}

	renderStateNodes() {
		this.machines.forEach( (machine: am.AsyncMachine) => {
			var nodes = this.nodes(machine)
			var node_links = this.node_links(machine)
			var layout = this.node_layouts.get(machine)

			layout
				.nodes(nodes)
				.links(node_links)
				//.on('start', () => {
				//	requestAnimationFrame(this.redrawStateNodes.bind(this, machine, node, link))
				//})

			var node = this.container.select("#" + this.stateGraph.machine_id(machine))
				.selectAll('.nodes')
				.data(nodes)
				.enter().append("g")
				.attr("class", "node")
				//.call(this.layout.drag)

			var circle = node.append("circle")
				.attr("r", d => { return d.node ? 2 : 7 } )
				.style("stroke", d => { return d.node ? 'transparent' : 'white' })

			var link = this.container.select("#" + this.stateGraph.machine_id(machine))
				.selectAll(".link")
				.data(node_links)
				.enter().append("line")
				// TODO use a separate color per relation
				.attr("class", "link")
				.style("stroke-width", d => { return d.value } )

			node.append("text")
				.attr("dx", (d) => {
					var name = d.node ? d.node.name : d.name
					return `-${name.length / 5}em`
				})
				.attr("dy", 25)
				.text(function(d) { return d.name });

			node.append("title")
				.text( d => { return d.name; });

			layout.start()
				.on('tick', () => {
					requestAnimationFrame(this.redrawStateNodes.bind(this, machine, node, link, circle))
				})
		})
	}

	redrawStateNodes(machine, node, link, circle) {
		//for (var i = 0; i < this.ticksPerRender; i++) {
		//	this.node_layouts.get(machine).tick();
		//}

		var q = d3.geom.quadtree(this.machines),
			i = 0,
			n = this.machines.length;

		while (++i < n)
			q.visit(collide(this.machines[i]));

		// update the position
		node.attr("transform", (d) => {
			return "translate(" + (d.x - machine.states_all.length * 4) + "," +
				(d.y - machine.states_all.length * 4) + ")"
		})

		// update the color
		circle.style("fill", d => {
			return d.node ? 'transparent' : (d.state ? 'red' : 'blue')
		})

		// update the edge coordinates
		link
			.attr("x1", this.linkCoords.bind(null, 'x1'))
			.attr("x2", this.linkCoords.bind(null, 'x2'))
			.attr("y1", this.linkCoords.bind(null, 'y1'))
			.attr("y2", this.linkCoords.bind(null, 'y2'))
			.attr("opacity", function(d) {
				if (d.source.node && this.style) {
					this.style.setProperty('opacity', 0)
				}
			})

		this.node_layouts.get(machine).alpha(.1)
	}

	linkCoords(coord, d: {
			source: D3Node | D3ExternalNode,
			target: D3Node | D3ExternalNode
			}) {
		var circle_correction = d.source.machine.states_all.length * 4

		if (d.source instanceof D3ExternalNode) {
			var external = d.source.node
			var external_circle_correction = external.machine.states_all.length * 4

			var x2 = -d.source.machine.x + external.machine.x + external.x - external_circle_correction
			var y2 = -d.source.machine.y + external.machine.y + external.y - external_circle_correction

			d.source.x = Math.max(-circle_correction*5,
				Math.min(circle_correction*5, x2)) + circle_correction
			d.source.y = Math.max(-circle_correction*5,
				Math.min(circle_correction*5, y2)) + circle_correction

			return
		}
		
		if (d.target instanceof D3Node && d.source instanceof D3Node) {
			switch(coord) {
				case 'x1':
					return d.source.x - circle_correction
					break;
				case 'y1':
					return d.source.y - circle_correction
					break;
				case 'x2':
					return d.target.x - circle_correction
					break;
				case 'y2':
					return d.target.y - circle_correction
					break;
			}
		}

		if (d.target instanceof D3ExternalNode) {
			var external = d.target.node
			var external_circle_correction = external.machine.states_all.length * 4
	
			var x2 = -d.source.machine.x + external.machine.x + external.x - external_circle_correction
			var y2 = -d.source.machine.y + external.machine.y + external.y - external_circle_correction
	
	// 		var fn = function(x, x1, y1, x2, y2) {
	// 			return y1 + ( (y2 - y1) / (x2 - x1) ) * (x - x1)
	// 		}
	
			var range = 50
	
			d.target.x = Math.max(-circle_correction*5,
				Math.min(circle_correction*5, x2)) + circle_correction
			d.target.y = Math.max(-circle_correction*5,
				Math.min(circle_correction*5, y2)) + circle_correction
	// 		d.target.y = fn(d.source.machine.y + circle_correction, d.source.machine.x, d.source.machine.y, x2, y2)
	
			switch(coord) {
				case 'x1':
					return d.source.x - circle_correction
					break;
				case 'y1':
					return d.source.y - circle_correction
					break;
				case 'x2':
					return x2
					break;
				case 'y2':
					return y2
					break;
			}

			// TODO position the fake node on the circle boundry
		}
	}
}


function collide(node: D3AsyncMachine) {
	// TODO radius calc
	var r = node.states_all.length * 25 + 16,
			nx1 = node.x - r,
			nx2 = node.x + r,
			ny1 = node.y - r,
			ny2 = node.y + r;
	return function(quad, x1, y1, x2, y2) {
		if (quad.point && (quad.point !== node)) {
			var x = node.x - quad.point.x,
					y = node.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = node.states_all.length * 25 + quad.point.states_all.length * 25;
			if (l < r) {
				l = (l - r) / l * .5;
				node.x -= x *= l;
				node.y -= y *= l;
				quad.point.x += x;
				quad.point.y += y;
			}
		}
		return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	};
}


interface NestedNode {
	
}