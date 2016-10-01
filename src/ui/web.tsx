import renderLayout from './layout'
import Graph from './joint'
import * as io from 'socket.io-client'
import { IDelta } from 'jsondiffpatch'
import { INetworkJson } from './joint-network'
import {Diff, ChangeType} from '../network'
import * as jsondiffpatch from 'jsondiffpatch'
import 'core-js/es6/symbol'

/**
 * TODO all of this has to be seriously rewritten
 */
export default function() {
	var graph: Graph;
	var socket = io('http://localhost:3030/client');
	var layout
	var container: Element
	var dataBase: INetworkJson
	var dataStep: INetworkJson
	var dataPatches: Diff[] = []
	let autoplay_ = true
	let timer
	function autoplay(state?) {
		if (state === undefined)
			return autoplay_

		autoplay_ = state
		if (!state && timer)
			clearInterval(timer)
	}

	var layoutData = {
		diffs: dataPatches,
		msg: null,
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
				if (dataPatches[i-1].diff)
					jsondiffpatch.unpatch(dataStep, dataPatches[i-1].diff)
				handleDuringTransition(dataPatches[i-1], true)
			}
			graph.setData(dataStep)
		} else if (value > layoutData.step) {
			// go fwd in time
			for (let i = layoutData.step; i < value; i++) {
				if (dataPatches[i].diff)
					jsondiffpatch.patch(dataStep, dataPatches[i].diff)
				handleDuringTransition(dataPatches[i])
			}
			graph.setData(dataStep)
		}
		layoutData.step = value
		// autoplay turns ON on the last step of the slider
		if (layoutData.step == dataPatches.length - 1)
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
		jsondiffpatch.patch(dataStep, diff)
	}

	document.addEventListener('DOMContentLoaded', () => {
			container = document.getElementById('app')
			render()

			socket.once('loggers', function(ids) {
					socket.emit('join', {
							loggerId: ids[0]
					})
			})

			socket.on('full-sync', (data: INetworkJson) => {
					console.log('full-sync', data)
					graph = new Graph(data)
					graph.render(document.getElementById('graph'))
					dataBase = 
						dataStep = data
					showMsg('Connected')
			})

			socket.on('disconnected', function() {
					showMsg('Disconnected')
			})
			
			socket.on('diff-sync', function(packet: Diff) {
					dataPatches.push(packet)
					console.log('diff', packet)
					// auto render if slider at the end
					if (autoplay() && !timer) {
						timer = setInterval( () => {

							if (layoutData.step < dataPatches.length) {
								let i = layoutData.step
								if (dataPatches[i].diff)
									jsondiffpatch.patch(dataStep, dataPatches[i].diff)
								handleDuringTransition(dataPatches[i])
								graph.setData(dataStep)
								layoutData.step++
								render()
							} else {
								clearInterval(timer)
								timer = null
							}
						}, 500)
					}
			})
	})
}
