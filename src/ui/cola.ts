import * as d3 from 'd3'
import * as cola from 'webcola'
import Graph from 'graphs'
import {
	INetworkJson,
	State
} from './cola-network'
import * as jsondiffpatch from 'jsondiffpatch'
import UiBase from './ui'

// TODO this is bad
window['d3'] = d3

/**
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 */
export default class Ui extends UiBase<INetworkJson> {

	machine_color: d3.scale.Ordinal<string, string>;
	state_color: d3.scale.Ordinal<string, string>;
	layout: cola.Layout;
	container: d3.Selection<Node>;

	link_selection: d3.Selection<Node>;
	node_selection: d3.Selection<Node>;
	group_selection: d3.Selection<Node>;
	label_selection: d3.Selection<Node>;
	group_label_selection: d3.Selection<Node>;

	link: d3.selection.Update<any>;
	node: d3.selection.Update<any>;
	group: d3.selection.Update<any>;
	label: d3.selection.Update<any>;
	group_label: d3.selection.Update<any>;

	pad = 3;
	width = 800;
	height = 600;

	constructor(
			public data: INetworkJson) {
		super(data)

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

	render(el?: Element) {
		// TODO customizable container
		this.container = d3.select("body").append("svg")
			.attr("width", this.width)
			.attr("height", this.height)

		this.initialSelection()
		this.updateData()
		this.renderNodes()
		this.layout.start()

		this.layout.on("tick", this.redrawNodes.bind(this));
	}
	
	patch(diff: jsondiffpatch.IDelta) {
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

		this.group_label.enter().append("text")
				.filter( x => x )
				.attr("class", "group-label")
				.text(d => d.name )

		this.node.append("title")
			.text(d => d.name )
	}
	
	initialSelection() {
		this.group_selection = this.container.selectAll(".group")
		this.link_selection = this.container.selectAll(".link")
		this.node_selection = this.container.selectAll(".node")
		this.label_selection = this.container.selectAll(".label")
		this.group_label_selection = this.container.selectAll(".group-label")
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

		this.link = this.link
			? this.link.data(this.data.links)
			: this.link_selection.data(this.data.links)
		this.node = this.node 
			? this.node.data(this.data.nodes)
			: this.node_selection.data(this.data.nodes)
		this.group = this.group
			? this.group.data(this.data.groups)
			: this.group_selection.data(this.data.groups)
		this.label = this.label
			? this.label.data(this.data.nodes)
			: this.label_selection.data(this.data.nodes)
		this.group_label = this.group_label
			? this.group_label.data(this.data.groups)
			: this.group_label_selection.data(this.data.groups)
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

		this.group_label
			.attr("x", d => d.bounds.x )
			.attr("y", function(d) {
				var h = this.getBBox().height;
				return d.bounds.y + h/4;
			});
	}
}
