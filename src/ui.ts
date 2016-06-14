import * as d3 from 'd3'
import * as cola from 'webcola'
import Graph from 'graphs'
import {
	ID3NetworkJson,
	State
} from './d3network'
import * as jsondiffpatch from 'jsondiffpatch'

// TODO this is bad
window['d3'] = d3

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui {

	machine_color: D3.Scale.OrdinalScale;
	state_color: D3.Scale.OrdinalScale;
	layout: cola.LayoutAdaptor;
	container: D3.Selection;

	link: D3.Selection;
	node: D3.Selection;
	group: D3.Selection;
	label: D3.Selection;

	pad = 3;
	width = 800;
	height = 600;

	constructor(
			public data: ID3NetworkJson) {

		this.machine_color = d3.scale.category10()
		this.state_color = d3.scale.category20c()

		this.layout = cola.d3adaptor()
			.linkDistance(100)
			.avoidOverlaps(true)
			.handleDisconnected(false)
			.nodes(this.data.nodes)
			.links(this.data.links)
			.groups(this.data.groups)
			.size([this.width, this.height])
	}

	render() {
		// TODO customizable container
		this.container = d3.select("body").append("svg")
			.attr("width", this.width)
			.attr("height", this.height)

		this.updateSelection()
		this.updateData()
		this.renderNodes()
		this.layout.start()

		this.layout.on("tick", this.redrawNodes.bind(this));
	}
	
	patch(diff: ID3NetworkJson) {
		jsondiffpatch.patch(this.data, diff)
		this.updateData()
		this.renderNodes()
		this.layout.start()
		this.redrawNodes()
	}

	renderNodes() {
		this.group.enter().append("rect")
				.filter( x => x )
				.attr("rx", 8).attr("ry", 8)
				.attr("class", "group")
				.style("fill", (d) => this.machine_color(d.id) )
				.call(this.layout.drag);

		this.link.enter().append("line")
				.filter( x => x )
				.attr("class", "link");

		this.node.enter().append("rect")
				.filter( x => x )
				.attr("class", "node")
				.attr("width", d => d.width - 2 * this.pad )
				.attr("height", d =>  d.height - 2 * this.pad )
				.attr("rx", 5).attr("ry", 5)
				// .style("fill", d => this.state_color(d.name) )
				.call(this.layout.drag);

		this.label.enter().append("text")
				.filter( x => x )
				.attr("class", "label")
				.text(d => d.name )
				.call(this.layout.drag);

		this.node.append("title")
			.text(d => d.name )
	}
	
	updateData() {
		for (let node of this.data.nodes) {
			node.width = node.name.length * 20
			node.height = 25
		}
		
		this.layout
			.nodes(this.data.nodes)
			.links(this.data.links)
			.groups(this.data.groups)
			
		this.link = this.link.data(this.data.links)
		this.node = this.node.data(this.data.nodes)
		this.group = this.group.data(this.data.groups)
		this.label = this.label.data(this.data.nodes)
	}
	
	updateSelection() {
		this.group = this.container.selectAll(".group")
		this.link = this.container.selectAll(".link")
		this.node = this.container.selectAll(".node")
		this.label = this.container.selectAll(".label")
	}

	redrawNodes() {
		this.link
			.attr("x1", d => d.source.x )
			.attr("y1", d => d.source.y )
			.attr("x2", d => d.target.x )
			.attr("y2", d => d.target.y )

		this.node
			.attr("x", d => d.x - d.width / 2 + this.pad )
			.attr("y", d => d.y - d.height / 2 + this.pad )
			.attr("class", (d: State) => {
				return d.is_set ? 'node set' : 'node'
			})

		this.group
			.attr("x", d => d.bounds.x )
			.attr("y", d => d.bounds.y )
			.attr("width", d => d.bounds.width() )
			.attr("height", d => d.bounds.height() )

		this.label
			.attr("x", d => d.x )
			.attr("y", function(d) {
				var h = this.getBBox().height;
				return d.y + h/4;
			});
	}
}
