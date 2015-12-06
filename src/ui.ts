import d3 from 'd3'
import _ from 'lodash'
import * as am from 'asyncmachine'
import Graph from 'graphs'
import {
	D3Node,
	D3Machine,
	D3NodeLink,
	OBJECT_TYPE,
	NODE_LINK_TYPE
} from './d3stategraph'

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui {

	color: D3.Scale.OrdinalScale;
	node_color: D3.Scale.OrdinalScale;
	layout: D3.Layout.ForceLayout;
	container: D3.Selection;
	links: D3.Layout.GraphLinkForce[];
	machine_nodes: D3.Selection;
	ticksPerRender = 3;
	width = 800;
	height = 600;

	constructor(
			public data: D3StateGraph) {

		this.color = d3.scale.category20()

		this.layout = d3.layout.force()
			.charge(-120)
			.linkDistance(this.linkDistance.bind(this))
			.size([this.width, this.height])
			.nodes(this.data.nodes)
			.links(this.data.links)

		this.node_color = d3.scale.category20c();

		//let size = machine.states_all.length * 8
		//var layout = d3.layout.force()
		//	.charge(-60)
		//	.linkDistance(50)
		//	.size([size, size])

	}

	render() {
		// TODO customizable container
		this.container = d3.select("body").append("svg")
			.attr("width", this.width)
			.attr("height", this.height)
		this.renderMachineNodes()
		this.renderStateNodes()
	}

	linkDistance(link) {
		switch(link.source.object_type) {
			case OBJECT_TYPE.MACHINE:
				return 5
			break;
			case OBJECT_TYPE.STATE:
				return (link.source.machine_id == link.target.machine_id)
					? 50 : 250;
			break;
		}
	}

	renderMachineNodes() {
		var color = d3.scale.category20();

		this.machine_nodes = this.container.selectAll(".node.machine")
			.data(this.data.nodes.filter( node => {
				return node.object_type == OBJECT_TYPE.MACHINE
			}))
			.enter().append("g")
				.attr("class", "node machine")
				.attr("id", d => { return d.id })
				.call(this.layout.drag)

		this.machine_nodes.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function(d) { return d.name });

		this.machine_nodes.append("title")
			.text( d => { return d.name; });

		this.layout.start()
			.on('tick', () => {
				requestAnimationFrame(this.redrawNodes.bind(this))
			})
	}

	redrawNodes() {
		this.machine_nodes.attr("transform", (d) => {
			// TODO move the circle
			//this.machine_nodes.append("circle")
			//	.attr("r", node => {
			//		var children_count = this.data.links.filter( link => {
			//			return link.source_id == node.id
			//		}).length
			//		// TODO to the config
			//		return 20 * children_count
			//	})
			//	.style("fill", d => { return color(d.id) })
			return "translate(" + d.x + "," + d.y + ")"
		})
		this.state_nodes.attr("transform", (d) => {
			return "translate(" + d.x + "," + d.y + ")"
		})

		this.links
			.attr("x1", link => link.source.x)
			.attr("x2", link => link.target.x)
			.attr("y1", link => link.source.y)
			.attr("y2", link => link.target.y)
			.attr("opacity", function(link) {
				if (link.type == NODE_LINK_TYPE.PIPED_IN) {
					this.style.setProperty('opacity', 0)
				}
			})
	}

	renderStateNodes() {
		this.state_nodes = this.container.selectAll('.node.state')
			.data(this.data.nodes.filter( node => {
				return node.object_type == OBJECT_TYPE.STATE
			}))
			.enter()
				.append("g")
				.attr("class", "node state")
				.call(this.layout.drag)

		var circle = this.state_nodes.append("circle")
			.attr("r", d => { return d.node ? 2 : 7 } )
			.style("stroke", d => { return d.node ? 'transparent' : 'white' })

		var links = this.data.links.filter( link => {
			return link.object_type == OBJECT_TYPE.STATE_LINK
		})
		this.links = this.container
			.selectAll(".link")
			.data(links)
			.enter()
				.append("line")
				// TODO use a separate color per relation
				.attr("class", "link")
				.style("stroke-width", 5 )

		this.state_nodes.append("text")
			.attr("dx", (d) => {
				return `-${d.name.length / 5}em`
			})
			.attr("dy", 25)
			.text(function(d) { return d.name });

		this.state_nodes.append("title")
			.text( d => { return d.name; });
	}

	//redrawStateNode(machine, node, link, circle) {
	//	//for (var i = 0; i < this.ticksPerRender; i++) {
	//	//	this.node_layouts.get(machine).tick();
	//	//}
    //
	//	var q = d3.geom.quadtree(this.machines),
	//		i = 0,
	//		n = this.machines.length;
    //
	//	while (++i < n)
	//		q.visit(collide(this.machines[i]));
    //
	//	// update the position
	//	node.attr("transform", (d) => {
	//		return "translate(" + (d.x - machine.nodes.length * 4) + "," +
	//			(d.y - machine.nodes.length * 4) + ")"
	//	})
    //
	//	// update the color
	//	circle.style("fill", d => {
	//		return d.object_type == OBJECT_TYPE.NODE_EXTERNAL ? 'transparent' : (d.state ? 'red' : 'blue')
	//	})
    //
	//	// update the edge coordinates
	//	link
	//		// TODO string enum
	//		.attr("x1", this.linkCoords.bind(null, 'x1', machine))
	//		.attr("x2", this.linkCoords.bind(null, 'x2', machine))
	//		.attr("y1", this.linkCoords.bind(null, 'y1', machine))
	//		.attr("y2", this.linkCoords.bind(null, 'y2', machine))
	//		.attr("opacity", function(d) {
	//			if (d.type == NODE_LINK_TYPE.PIPED_IN) {
	//				this.style.setProperty('opacity', 0)
	//			}
	//		})
    //
	//	this.layout.get(machine).alpha(.1)
	//}
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