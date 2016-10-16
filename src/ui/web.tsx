import renderLayout from './layout'
// import Graph from './joint'
import Graph from './cola'
import * as io from 'socket.io-client'
import { IDelta } from 'jsondiffpatch'
// import { INetworkJson } from './joint-network'
import { INetworkJson } from './cola-network'
import {Diff, ChangeType} from '../network'
import * as jsondiffpatch from 'jsondiffpatch'
import 'core-js/es6/symbol'

/**
 * TODO
 * - all of this has to be seriously rewritten (using AM, ideally)
 * - longer delay for msgs than for a step they come from
 */
export default function() {
	var graph = new Graph(null)
	var socket = io('http://localhost:3030/client');
	var layout
	var container: Element
	let data: {
		graph: INetworkJson,
		patches: Diff[]
	} = {
		graph: null,
		patches: []
	};
	let autoplay_ = true
	let timer
	function autoplay(state?) {
		return false
		if (state === undefined)
			return autoplay_

		autoplay_ = state
		if (!state && timer)
			clearInterval(timer)
	}

	// global setter
	window.setJson = function(json) {
		data = json
		layoutData.graph = data.graph
		layoutData.diffs = data.patches
		layoutData.step = 0
		layoutData.duringTransition = false
		graph.setData(layoutData.graph)
	}

	window.getJson = function() {
		// TODO custom replaces for .leaves looking in indexOf(.nodes)
		console.log(JSON.stringify(data))
	}

	var layoutData = {
		diffs: data.patches,
		msg: null,
		graph: null,
		step: 0,
		onSlider: onSlider,
		duringTransition: false,
		msgHidden: false
	}

	function onSlider(event, value) {
		if (value < layoutData.step) {
			autoplay(false)
			// go back in time
			for (let i = layoutData.step; i > value; i--) {
				if (data.patches[i-1].diff)
					jsondiffpatch.unpatch(layoutData.graph, data.patches[i-1].diff)
				handleDuringTransition(data.patches[i-1], true)
			}
			graph.setData(layoutData.graph)
		} else if (value > layoutData.step) {
			// go fwd in time
			for (let i = layoutData.step; i < value; i++) {
				if (data.patches[i].diff)
					jsondiffpatch.patch(layoutData.graph, data.patches[i].diff)
				handleDuringTransition(data.patches[i])
			}
			graph.setData(layoutData.graph)
		}
		layoutData.step = value
		// autoplay turns ON on the last step of the slider
		if (layoutData.step == data.patches.length - 1)
			autoplay(true)
		render()
	}

	function showMsg(msg) {
		layoutData.msg = msg
		render()
	}

	function render() {
		layout = renderLayout(container, layoutData)
	}

	let transitionsCount = 0

	// TODO breaks when reversing inside nested active_transitions
	function handleDuringTransition(packet, reversed = false) {
		// TODO highlight the
		if (packet.type == ChangeType.TRANSITION_START) {
			transitionsCount += reversed ? -1 : 1
			layoutData.msg = `Transition started on ${packet.machine_id}`
			layoutData.msgHidden = false
		} else if (packet.type == ChangeType.TRANSITION_END) {
			transitionsCount += reversed ? 1 : -1
			layoutData.msg = `Transition ended on ${packet.machine_id}`
			layoutData.msgHidden = false
		} else
			layoutData.msg = null
		layoutData.duringTransition = !!transitionsCount
	}

	function patch(diff) {
		jsondiffpatch.patch(layoutData.graph, diff)
	}

	document.addEventListener('DOMContentLoaded', () => {
		container = document.getElementById('app')
		render()
		graph.render('#graph')

		socket.once('loggers', function(ids) {
			socket.emit('join', {
				loggerId: ids[0]
			})
		})

		socket.on('full-sync', (graph_data: INetworkJson) => {
			console.log('full-sync', data)
			data.graph = graph_data
			graph.setData(graph_data)
			layoutData.graph = graph_data
			showMsg('Connected')
		})

		socket.on('disconnected', function() {
			showMsg('Disconnected')
		})
		
		socket.on('diff-sync', function(packet: Diff) {
			data.patches.push(packet)
			console.log('diff', packet)
			// auto render if slider at the end
			if (autoplay() && !timer) {
				timer = setInterval( () => {

					if (layoutData.step < data.patches.length) {
						let i = layoutData.step
						if (data.patches[i].diff)
							jsondiffpatch.patch(layoutData.graph, data.patches[i].diff)
						handleDuringTransition(data.patches[i])
						// graph.setData(layoutData.graph)
						layoutData.step++
						// render()
					} else {
						clearInterval(timer)
						timer = null
					}
				}, 500)
			}
		})
	})
}
