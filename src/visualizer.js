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
		this.bindToMachine(machine)
		this.scanReferences()
	}

	bindToMachine(machine) {
		// TODO override event triggers to apply them on the UI immediate
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
			.linkDistance(30)
			.size([this.width, this.height])

		this.node_layouts = new Map
		for (let machine of this.machines) {
			let size = machine.states_all.length * 15
			this.node_layouts.set(machine,
				d3.layout.force()
					.charge(-120)
					.linkDistance(30)
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

	nodes(machines) {
		var nodes = []

		this.network.graph.forEach( node => nodes.push(node) )

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
			if (from.machine !== machine || to.machine !== machine)
				return

			links.push({
				source: from,
				target: to,
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
		var color = d3.scale.category20c();

		this.layout
			// TODO support the ID getter
			.nodes(machines)
			.links(links)
			.start()

		var node = this.container.selectAll(".node.machine")
				.data(machines)
				.enter().append("g")
					.attr("class", "node machine")
					.attr("id", d => { return this.network.machine_id(d) })
					.call(this.layout.drag)

		var link = this.container.selectAll(".link.machine")
			.data(links)
			.enter().append("line")
				.attr("class", "link machine")
				.style("stroke-width", d => {
					return d.value
				})

		node.append("circle")
			.attr("r", d => d.states_all.length * 20)
			.style("fill", d => { return color(this.network.machine_id(d)) });

		node.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function(d) { return d.name });

		node.append("title")
			.text( d => { return d.name; });

		this.layout.on("tick", () => {
			link.attr("x1",  d => { return d.source.x; })
				.attr("y1",  d => { return d.source.y; })
				.attr("x2",  d => { return d.target.x; })
				.attr("y2",  d => { return d.target.y; });

			//
			//node.attr("cx",  d => { return d.x; })
			//    .attr("cy",  d => { return d.y; })
			node.attr("transform", (d) => {
				return "translate(" + d.x + "," + d.y + ")"
			})
		})
	}


	renderNodes() {
		var machines = this.machines

		for (let machine of machines) {
			var nodes = this.nodes(machine)
			var node_links = this.node_links(machine)
			var layout = this.node_layouts.get(machine)

			layout
				.nodes(nodes)
				.links(node_links)
				.start()

			let node = this.container.select("#" + this.network.machine_id(machine))
				.selectAll('.nodes')
				.data(nodes)
				.enter().append("g")
					.attr("class", "node")
					.call(this.layout.drag)

			let link = this.container.select("#" + this.network.machine_id(machine))
					.selectAll(".link")
					.data(node_links)
					.enter().append("line")
						.attr("class", "link")
						.style("stroke-width", d => { return d.value } )

			node.append("circle")
				.attr("r", 3.5)

			node.append("text")
				.attr("dx", 12)
				.attr("dy", ".35em")
				.text(function(d) { return d.name });

			node.append("title")
				.text( d => { return d.name; });

			layout.on("tick", (link, node) => {

				node.attr("transform", (d) => {
					return "translate(" + (d.x - d.machine.states_all.length * 10) + "," + (d.y - d.machine.states_all.length * 10) + ")"
				})

				link.attr("x1",  d => { 
						return d.source.x - d.source.machine.states_all.length * 10 })
					.attr("y1",  d => { 
						return d.source.y - d.source.machine.states_all.length * 10 })
					.attr("x2",  d => {
						return d.target.x - d.target.machine.states_all.length * 10 })
					.attr("y2",  d => {
						return d.target.y - d.target.machine.states_all.length * 10 })
					
			}.bind(null, link, node))
		}
	}
}
