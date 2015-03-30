import am from 'asyncmachine'
import Graph from 'graphs'
import uuid from 'node-uuid'
import assert from 'assert'
import d3 from 'd3'
import {map, uniq, pluck} from './lib/lodash-oo'
import _ from 'lodash'

export class Node {

	constructor(name, machine, machines) {
		this.id = uuid.v4()
		this.machines = machines
		this.machine = machine
		this.name = name
		this.externals = []
	}

	get() {
		return this.machine.get(this.name)
	}

	get machine_id() {
		return this.machines.get(this.machine)
	}
}


export class Network {

	constructor() {
		this.graph = new Graph
		this.machines = new Map()
		this.events = []
	}

	get nodes() {
		var nodes = []
		for (let node of this.graph.set) {
			nodes.push(node)
		}
		return nodes
	}

	addMachine(machine) {
		this.machines.set(machine, uuid.v4())
		this.getNodesFromMachine(machine)
		for (let [machine, id] of this.machines) {
			this.bindToMachine(machine)
		}
		this.scanReferences()
	}

	bindToMachine(machine) {
		// TODO override event triggers to apply them on the UI immediate
		for (let state in machine.piped) {
			var data = machine.piped[state]

			let source_state = this.getNodeByName(state, machine)
			let target_state = this.getNodeByName(data.state, data.machine)
			if (!target_state)
				continue
			this.graph.link(source_state, target_state)
		}
	}

	getNodesFromMachine(machine) {
		// scan states
		let new_nodes = []
		for (let name of machine.states_all) {
			let node = new Node(name, machine, this.machines)
			this.graph.add(node)
			new_nodes.push(node)
		}

		// get edges from relations
		for (let node of new_nodes)
			this.getRelationsFromNode(node, machine)
		}

	// TODO support piping
	getRelationsFromNode(node, machine) {
		// TODO limit to 'requires' and 'drops' ?
		let state = node.get()
		assert(state)
		for (let relation in state) {
			if (relation == 'auto')
				continue

			let targets = state[relation]

			for (let target_name of targets) {
				let target = this.getNodeByName(target_name, machine)
				assert(target)
				this.graph.link(node, target)
			}
		}
	}

	getNodeByName(name, machine) {
		for (let node of this.graph.set) {
			if (node.name === name && node.machine === machine)
				return node
		}
	}

	scanReferences() {
		// scan listeners, get edges from listener refs
	}

	machine_id(machine) {
		return `machine-${this.machines.get(machine)}`
	}
}

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export class VisualizerUi {

	constructor(network) {

		this.network = network

		this.width = 800,
		this.height = 600;

		this.color = d3.scale.category20()

		this.layout = d3.layout.force()
			.charge(-120)
			.linkDistance(200)
			.size([this.width, this.height])
		this.node_color = d3.scale.category20c();

		this.node_layouts = new Map
		for (let machine of this.machines) {
			let size = machine.states_all.length * 8
			this.node_layouts.set(machine,
				d3.layout.force()
					.charge(-60)
					.linkDistance(50)
					.size([size, size])
			)
		}

		this.container = d3.select("body").append("svg")
			.attr("width", this.width)
			.attr("height", this.height)
	}

	get machines() {
		return _.chain(this.network.nodes).pluck('machine').uniq().value()
	}

	nodes(machine) {
		var nodes = []

		this.network.graph.forEach( node => {
			if (node.machine !== machine)
				return

			nodes.push(node)
			// Collect external nodes to which the current node points to
			var links_from = this.network.graph.from(node)
			for (let target of links_from) {
				if (target.machine !== machine) {
					node.externals.push({
						node: target,
						machine: node.machine
					})
				}
			}
			// Collect external nodes pointing to this one
			for (let source of this.network.graph.to(node)) {
				if (source.machine !== machine && !links_from.has(source)) {
					node.externals.push({
						node: source,
						machine: node.machine
					})
				}
			}
			nodes.push.apply(nodes, node.externals)
		})

		return nodes
	}

	get machine_links() {
		var links = []

		this.network.graph.traverse( (from, to) => {
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
		var links = []

		this.network.graph.traverse( (from, to) => {
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
		this.renderMachines()
		this.renderNodes()
	}

	renderMachines() {
		var machines = this.machines
		var links = this.machine_links
		var color = d3.scale.category20();

		this.layout
			// TODO support the ID getter
			.nodes(machines)
			.links(links)
			.start()

		this.machine_node = this.container.selectAll(".node.machine")
				.data(machines)
				.enter().append("g")
					.attr("class", "node machine")
					.attr("id", d => { return this.network.machine_id(d) })
					.call(this.layout.drag)

		//var link = this.container.selectAll(".link.machine")
		//	.data(links)
		//	.enter().append("line")
		//		.attr("class", "link machine")
		//		.style("stroke-width", d => {
		//			return d.value
		//		})

		this.machine_node.append("circle")
			.attr("r", d => d.states_all.length * 20)
			.style("fill", d => { return color(this.network.machine_id(d)) })

		this.machine_node.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function(d) { return d.name });

		this.machine_node.append("title")
			.text( d => { return d.name; });
	}


	renderNodes() {
		var machines = this.machines

		machines.forEach( machine => {
			var nodes = this.nodes(machine)
			var node_links = this.node_links(machine)
			var layout = this.node_layouts.get(machine)

			layout
				.nodes(nodes)
				.links(node_links)
				.start()

			var node = this.container.select("#" + this.network.machine_id(machine))
				.selectAll('.nodes')
				.data(nodes)
				.enter().append("g")
					.attr("class", "node")
					.call(this.layout.drag)

			var link = this.container.select("#" + this.network.machine_id(machine))
					.selectAll(".link")
					.data(node_links)
					.enter().append("line")
						.attr("class", "link")
						.style("stroke-width", d => { return d.value } )

			node.append("circle")
				.attr("r", d => { return d.node ? 2 : 7 } )
				.style("fill", d => { return d.node ? 'transparent' : this.node_color(d.name) })
				.style("stroke", d => { return d.node ? 'transparent' : 'white' })

			node.append("text")
				.attr("dx", (d) => {
					var name = d.node ? d.node.name : d.name
					return `-${name.length / 5}em`
				})
				.attr("dy", 25)
				.text(function(d) { return d.name });

			node.append("title")
				.text( d => { return d.name; });

			var machines = this.machines
			let updateLayout = () => {

				var q = d3.geom.quadtree(machines),
						i = 0,
						n = machines.length;

				while (++i < n) q.visit(collide(machines[i]));

				node.attr("transform", (d) => {
					return "translate(" + (d.x - machine.states_all.length * 4) + "," +
						(d.y - machine.states_all.length * 4) + ")"
				})

				var that = this

				link
					.attr("x1", this.linkCoords.bind(null, 'x1'))
					.attr("x2", this.linkCoords.bind(null, 'x2'))
					.attr("y1", this.linkCoords.bind(null, 'y1'))
					.attr("y2", this.linkCoords.bind(null, 'y2'))
					.attr("opacity", (d) => {
						if (d.source.node && this.style) {
							this.style.setProperty('opacity', 0)
						}
					})
					
				//var machine_layout = this.node_layouts.get(machine)
				this.node_layouts.get(machine).alpha(.1)
				this.machine_node.attr("transform", (d) => {
					return "translate(" + d.x + "," + d.y + ")"
				})
			}

			layout.on("tick", updateLayout)
			this.layout.on("tick", updateLayout)
		})
	}

	linkCoords(coord, d) {
		var circle_correction = d.source.machine.states_all.length * 4

		if (d.source.node) {
			var external = d.source.node
			var external_circle_correction = external.machine.states_all.length * 4

			var x2 = -d.source.machine.x + external.machine.x + external.x - external_circle_correction
			var y2 = -d.source.machine.y + external.machine.y + external.y - external_circle_correction

			d.source.x = Math.max(-circle_correction,
				Math.min(circle_correction, x2)) + circle_correction
			d.source.y = Math.max(-circle_correction,
				Math.min(circle_correction, y2)) + circle_correction

			return
		}
		
		if (!d.target.node) {
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

		var external = d.target.node
		var external_circle_correction = external.machine.states_all.length * 4

		var x2 = -d.source.machine.x + external.machine.x + external.x - external_circle_correction
		var y2 = -d.source.machine.y + external.machine.y + external.y - external_circle_correction

// 		var fn = function(x, x1, y1, x2, y2) {
// 			return y1 + ( (y2 - y1) / (x2 - x1) ) * (x - x1)
// 		}

		var range = 50

		d.target.x = Math.max(-circle_correction,
			Math.min(circle_correction, x2)) + circle_correction
		d.target.y = Math.max(-circle_correction,
			Math.min(circle_correction, y2)) + circle_correction
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

		this.node_layouts.get(external.machine).tick()
		// TODO position the fake node on the circle boundry
	}
}


function collide(node) {
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