import renderLayout from './layout'
// UI type
import Graph from './joint'
import { INetworkJson } from './joint-network'
// import Graph from './cola'
// import { INetworkJson } from './cola-network'
import * as io from 'socket.io-client'
import { IDelta } from 'jsondiffpatch'
import {
	IPatch,
	PatchType
} from '../network'
import * as jsondiffpatch from 'jsondiffpatch'
import 'core-js/es6/symbol'
// import IterableEmitter from '../../../async-iterators/iterable-emitter'
import {
	default as JointDataService,
	Direction
} from './joint-data-service'
import * as debounce from 'throttle-debounce/debounce'
import { TLayoutProps } from './layout'

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
	let autoplay_ = true
	let timer
	let data_service = new JointDataService
	function autoplay(state?) {
		if (state === undefined)
			return autoplay_

		autoplay_ = state
		if (!state && timer)
			clearInterval(timer)
	}
	
	data_service.on('scrolled', (position, changed_cells) => {
		graph.updateCells(changed_cells, data_service.last_scroll_add_remove)
		handleTransitionMessage(data_service)
	})

	// global setter
	// window.setJson = function(json) {
	// 	data = json
	// 	layoutData.graph = data.graph
	// 	layoutData.diffs = data.patches
	// 	layoutData.step = 0
	// 	layoutData.duringTransition = false
	// 	graph.setData(layoutData.graph)
	// }

	// window.getJson = function() {
	// 	// TODO custom replaces for .leaves looking in indexOf(.nodes)
	// 	console.log(JSON.stringify(data))
	// }

	var layoutData: TLayoutProps = {
		getPatchesCount() { return data_service.patches.length },
		isDuringTransition() { return data_service.during_transition },
		getPosition() { return data_service.step },
		getLogs() { return data_service.getLogs() },
		onSlider: onSlider,
		msg: null,
		msgHidden: false
	}

	// const onSlider = debounce(500, false, FUNC ))
	function onSlider(event, value) {
		// TODO debounce
		data_service.scrollTo(value)
		// autoplay turns ON on the last step of the slider
		if (data_service.is_latest)
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

	// TODO breaks when reversing inside nested active_transitions
	function handleTransitionMessage(data_service) {
		// TODO highlight the involved parts of the log view
		// let reversed = (data_service.last_scroll_direction == Direction.BACK)
		let packet = data_service.current_patch
		if (packet && packet.type == PatchType.TRANSITION_START) {
			layoutData.msg = `Transition started on ${packet.machine_id}`
			layoutData.msgHidden = false
		} else if (packet && packet.type == PatchType.TRANSITION_END) {
			layoutData.msg = `Transition ended on ${packet.machine_id}`
			layoutData.msgHidden = false
		} else
			layoutData.msg = null
	}

	document.addEventListener('DOMContentLoaded', () => {
		container = document.getElementById('app')
		render()
		graph.render('#graph')

		let start_join
		socket.once('loggers', function (ids) {
			start_join = Date.now()

			socket.emit('join', {
				loggerId: ids[0]
			})

			// TODO stream-based full-sync
			// let full_sync_stream = new IterableEmitter<TCell>(
			// 	socket as any as EventEmitter, 'full-sync')
			// isSyncing = true

			// socket.on('full-sync', data) {
			// 	if (!data)
			// 		isSyncing = false
			// }

			// await graph.setData(full_sync_stream, true)
			// layoutData.graph =
			// 	data.graph = graph.data
			// showMsg('Connected')
		})

		socket.on('full-sync', (graph_data: INetworkJson) => {
			console.log('full-sync', Date.now() - start_join)
			console.log('full-sync', graph_data)
			data_service.data = graph_data
			graph.setData(graph_data)
			showMsg('Connected')
		})

		socket.on('disconnected', function() {
			showMsg('Disconnected')
		})
		
		socket.on('diff-sync', function(packet: IPatch) {
			data_service.addPatch(packet)
			console.log('diff', packet)
			// auto render if slider at the end
			if (autoplay() && !timer) {
				// TODO setTimeout
				timer = setInterval( () => {

					if (!data_service.is_latest) {
						data_service.scrollOne()
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
