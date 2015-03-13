import am from 'asyncmachine'
import Graph from 'graphlib/lib/graph'
import uuid from 'node-uuid'
import assert from 'assert'
import d3 from 'd3'
import _ from 'underscore'

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
	this.nodes = {}
	this.machines = new Map()
	this.events = []
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
	  this.nodes[node.id] = node
	  this.graph.setNode(node.id, node)
	  new_nodes.push(node)
	}

	// get edges from relations
	for (let node of new_nodes)
	  this.getRelationsFromNode(node, machine)
  }

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
		this.graph.setEdge(node.id, target.id, relation)
	  }
	}
  }

  getNodeByName(name, machine) {
	for (let id in this.nodes) {
	  let node = this.nodes[id]
	  if (node.name === name && node.machine === machine)
		return node
	}
  }

  scanReferences() {
	// scan listeners, get edges from listener refs
  }
}

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export class VisualizerUi {

	constructor(network) {

        this.network = network

        this.width = 460,
        this.height = 250;

        this.color = d3.scale.category20()

        this.layout = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([this.width, this.height])

        this.bubble = d3.layout.pack()
            .value( (d) => { return d.children || 5 } )
            .sort(null)
            .size([this.width, this.height])
            .padding(1.5)

        this.container = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
    }

    get nodes() {
        return this.network.graph.nodes().map( id => {
            return this.network.nodes[id]
        })
    }

    get links() {
        var nodes = this.network.graph.nodes()
        var network = this.network
        return this.network.graph.edges().map( edge => {
            return {
                source: network.nodes[edge.v],
                target: network.nodes[edge.w],
                value: 1
            }
        })
    }

	render() {
        var nodes = this.nodes
        var links = this.links
        var color = d3.scale.category20c();

        let bubble_nodes = []
        let network = this.network
        for (let machine_id of this.network.machines.values()) {
            bubble_nodes.push({
                name: machine_id,
                children: _.values(network.nodes).filter( node => {
                    return node.machine_id == machine_id
                })
            })
        }

        var bubble = this.container.selectAll(".bubble")
            //.data(nodes)
            .data(this.bubble.nodes(bubble_nodes))
            .enter().append("g")
            .attr("class", "bubble")
            .attr("transform", function(d) {
                console.log(d)
                return "translate(" + d.x + "," + d.y + ")"; })
        bubble.append('circle').attr("r", function(d) { return d.r; });

        this.layout
            // TODO support the ID getter
            .nodes(nodes, (d) => { return d.id })
            .links(links)
            .start()

        var link = this.container.selectAll(".link")
            .data(links)
            .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", d => {
                    return d.value
                })

        var node = this.container.selectAll(".node")
            //.data(nodes)
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(this.layout.drag)

        node.append("circle").attr("r", 4.5)
            .style("fill", function(d) { return color(d.machine_id); });

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

            //node.attr("cx",  d => { return d.x; })
            //    .attr("cy",  d => { return d.y; })
            node.attr("transform", (d) => {
                return "translate(" + d.x + "," + d.y + ")"
            })
        })
	}
}
