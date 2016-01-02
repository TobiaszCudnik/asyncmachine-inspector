import d3 from 'd3'
import cola from 'webcola'
import * as am from 'asyncmachine'
import Graph from 'graphs'
import {
	ID3GraphJson
} from './d3stategraph'

// TODO this is so bad
window.d3 = d3

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
			public data: ID3GraphJson) {

		this.machine_color = d3.scale.category10()
		this.state_color = d3.scale.category20c()

		for (let node of this.data.nodes) {
			node.width = node.name.length * 20
			node.height = 25
		}

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

		this.layout.start()
		this.renderNodes()
	}

	renderNodes() {
		this.group = this.container.selectAll(".group")
			.data(this.data.groups)
			.enter().append("rect")
				.attr("rx", 8).attr("ry", 8)
				.attr("class", "group")
				.style("fill", (d) => this.machine_color(d.id) )
				.call(this.layout.drag);

		this.link = this.container.selectAll(".link")
			.data(this.data.links)
			.enter().append("line")
				.attr("class", "link");

		this.node = this.container.selectAll(".node")
			.data(this.data.nodes)
			.enter().append("rect")
				.attr("class", "node")
				.attr("width", d => d.width - 2 * this.pad )
				.attr("height", d =>  d.height - 2 * this.pad )
				.attr("rx", 5).attr("ry", 5)
				.style("fill", d => this.state_color(d.name) )
				.call(this.layout.drag);

		this.label = this.container.selectAll(".label")
			.data(this.data.nodes)
			.enter().append("text")
				.attr("class", "label")
				.text(d => d.name )
				.call(this.layout.drag);

		this.node.append("title")
			.text(d => d.name )

		this.layout.on("tick", this.redrawNodes.bind(this));
	}

	redrawNodes() {
		this.link.attr("x1", d => d.source.x )
			.attr("y1", d => d.source.y )
			.attr("x2", d => d.target.x )
			.attr("y2", d => d.target.y );

		this.node.attr("x", d => d.x - d.width / 2 + this.pad )
			.attr("y", d => d.y - d.height / 2 + this.pad );

		this.group.attr("x", d => d.bounds.x )
			.attr("y", d => d.bounds.y )
			.attr("width", d => d.bounds.width() )
			.attr("height", d => d.bounds.height() );

		this.label.attr("x", d => d.x )
			.attr("y", function(d) {
				var h = this.getBBox().height;
				return d.y + h/4;
			});
	}
}
