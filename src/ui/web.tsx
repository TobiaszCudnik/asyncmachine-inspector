import renderLayout from './layout'
import '../polyfill'
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
	Direction,
	StepTypes
} from './joint-data-service'
import * as debounce from 'throttle-debounce/debounce'
import { TLayoutProps } from './layout'


/**
 * TODO
 * - all of this has to be seriously rewritten (using AM, ideally)
 * - longer delay for msgs than for a step they come from
 * - queue & merge scroll requests while rendering
 *   - ideally cancel the current rendering
 */
export default function() {
	const frametime = 0.5
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

	let is_rendering = false

	// const onSlider = debounce(500, false, FUNC ))
	let onSlider = debounce(500, false, (event, value) => {
		// TODO handle is_rendering
		// autoplay turns ON on the last step of the slider
		if (data_service.is_latest)
			autoplay(true)
		else 
			autoplay_ = false
		// TODO debounce
		data_service.scrollTo(value)
		render()
	})

	var layoutData: TLayoutProps = {
		get position_max() { return data_service.position_max },
		get is_during_transition() { return data_service.during_transition },
		get position() { return data_service.position },
		get step_type() {
			let t = StepTypes
			switch (data_service.step_type) {
				case t.TRANSITIONS: return 'transition'
				case t.STEPS: return 'steps'
			}
			return 'states'
		},
		get logs() { return data_service.getLogs() },
		onStepSlider: onSlider,
		onZoomSlider: null, // TODO
		onStepType: (event, value) => {
			data_service.setStepType(value)
			render()
		},
		msg: null,
		msgHidden: false,
		get is_playing() { return timer && autoplay() },
		onPlayButton() {
			if (!timer)
				play()
			else
				stop()
			render()
		}
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

	function play() {
		if (autoplay() && !timer) {
			const start = Date.now()
			let last
			let timer_fn
			timer = setTimeout( timer_fn = () => {
				if (!autoplay()) {
					timer = null
					return
				}
				if (is_rendering) {
					setTimeout(timer_fn, frametime*1000)
					return
				}
				// merged-step to catch up with the skipped frames
				let framestimes_since_last = Math.round(
					(Date.now() - last) / (frametime*1000))
				if (framestimes_since_last > 1) {
					data_service.scrollTo(Math.max(data_service.position_max,
						data_service.position + framestimes_since_last))
					render()
					setTimeout(timer_fn, frametime*1000)
				} else if (!data_service.is_latest) {
					data_service.scrollOne()
					render()
					setTimeout(timer_fn, frametime*1000)
				} else {
					timer = null
				}
			}, frametime*1000)
		}
	}

	function stop() {
		if (!timer)
			return
		autoplay_ = false
		clearTimeout(timer)
		timer = null
	}

	document.addEventListener('DOMContentLoaded', () => {
		container = document.getElementById('app')
		render()
		graph.render('#graph')

		let start_join
		socket.on('loggers', function (ids) {
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

		socket.on('full-sync', async (graph_data: INetworkJson) => {
			is_rendering = true
			console.log('full-sync', Date.now() - start_join)
			console.log('full-sync', graph_data)
			data_service.data = graph_data
			await graph.setData(graph_data)
			showMsg('Connected')
			is_rendering = false
		})

		socket.on('disconnected', function() {
			showMsg('Disconnected')
		})
		
		socket.on('diff-sync', function(packet: IPatch) {
			data_service.addPatch(packet)
			console.log('diff', packet)
			// auto render if slider at the ended
			play()
		})
	})
}
