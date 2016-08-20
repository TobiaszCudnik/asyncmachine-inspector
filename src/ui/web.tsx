import renderLayout from './layout'
import Graph from './joint'
import * as io from 'socket.io-client'
import { IDelta } from 'jsondiffpatch'
import { INetworkJson } from './joint-network'
import { Diff } from '../network'
import * as jsondiffpatch from 'jsondiffpatch'


export default function() {
	var graph: Graph;
	var socket = io('http://localhost:3030/client');
	var layout
	var container: Element
	var dataBase: INetworkJson
	var dataStep: INetworkJson
	var dataPatches: Diff[] = []

	var layoutData = {
			diffs: dataPatches,
			msg: null,
			step: 0,
			onSlider: onSlider
	}

	function onSlider(event, value) {
		console.log('slider', value)
		console.log('step', layoutData.step)

		if (value < layoutData.step) {
			// go back in time
			for (let i = layoutData.step; i > value; i--) {
				if (dataPatches[i-1].diff)
					jsondiffpatch.unpatch(dataStep, dataPatches[i-1].diff)
			}
			graph.setData(dataStep)
		} else if (value > layoutData.step) {
			// go fwd in time
			for (let i = layoutData.step; i < value; i++) {
				if (dataPatches[i].diff)
					jsondiffpatch.patch(dataStep, dataPatches[i].diff)
			}
			graph.setData(dataStep)
		}
		layoutData.step = value
		render()
	}

	function showMsg(msg) {
		layoutData.msg = msg
		render()
	}

	function render() {
		layout = renderLayout(container, layoutData)
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
					if (layoutData.step == dataPatches.length - 1) {
						if (packet.diff) {
								patch(packet.diff)
								graph.setData(dataStep)
						}
						layoutData.step++
						render()
					}
			})
	})
}
