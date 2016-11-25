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
import States from './states'
import { ITransitions } from './states-types'


/**
 * TODO
 * - all of this has to be seriously rewritten (using AM, ideally)
 * - longer delay for msgs than for a step they come from
 * - queue & merge scroll requests while rendering
 *   - ideally cancel the current rendering
 * - timers
 * - renderUI() as a state
 */
export class InspectorUI /*implements ITransitions*/ {
	states = new States(this);
	data_service: JointDataService
	graph = new Graph(null)
	layout_data: TLayoutProps;
	frametime = 0.5
	// TODO type
	socket: io.Socket;
	layout;
	container: Element
	logger_id: string;
	step_timer: number;
	step_fn: Function;

	constructor(
			public host = 'localhost',
			public port = 3030) {
    this.states.add(['AutoplayOn', 'Connecting'])
		this.states.logLevel(3)

		this.socket = io(`http://${this.host}:${this.port}/client`)
		this.socket.on('full-sync', this.states.addByListener('FullSync'))
		this.socket.on('diff-sync', this.states.addByListener('DiffSync'))
		this.socket.on('connect', this.states.addByListener('Connected'))
		// TODO connection_error event and bind retries to a state
		this.socket.on('disconnected', this.states.addByListener('Disconnected'))
		this.socket.on('loggers', this.states.addByListener('Joining'))

		window.document.addEventListener('DOMContentLoaded',
			this.states.addByListener('DOMReady'))

		this.data_service.on('scrolled', (position, changed_cells) => {
			if (this.data_service.is_latest)
				this.states.add('TimelineOnLast')
			else if (this.data_service.position == 0)
				this.states.add('TimelineOnFirst')
			else
				this.states.add('TimelineOnBetween')
			this.graph.updateCells(changed_cells,
				this.data_service.last_scroll_add_remove)
			this.states.add('Rendered')
			this.handleTransitionMessage()
		})
		this.layout_data = this.buildLayoutData()
	}

	buildLayoutData() {
		const self = this
		return {
			get position_max() { return self.data_service.position_max },
			get is_during_transition() { return self.data_service.during_transition },
			get position() { return self.data_service.position },
			get step_type() {
				let t = StepTypes
				switch (self.data_service.step_type) {
					case t.TRANSITIONS: return 'transition'
					case t.STEPS: return 'steps'
				}
				return 'states'
			},
			get logs() { return self.data_service.getLogs() },
			onTimelineSlider: debounce(500, false, (event, value) => {
				self.states.add('TimelineScrolled', value)
			}),
			onZoomSlider: null, // TODO
			onStepType: (event, value) => {
				if (self.data_service.step_type != value)
					self.states.add('StepTypeChanged', value)
			},
			msg: null,
			msgHidden: false,
			get is_playing() { return self.states.is('Playing') },
			onPlayButton: this.states.addByListener('PlayStopClicked')
		}
	}

	// TRANSITIONS

	async FullSync_state(graph_data: INetworkJson) {
		// TODO cancel the rendering here
		this.logger_id = graph_data.loggerId
		this.states.add(['Joined', 'Rendering'])
		// console.log('full-sync', Date.now() - start_join)
		console.log('full-sync', graph_data)
		this.data_service.data = graph_data
		await this.graph.setData(graph_data)
		this.states.add('Rendered')
  }

  Joining_state(ids: string[]) {
		let id = ids[0]
		if (this.logger_id != id)
			this.graph.reset()
		this.data_service = new JointDataService
		// TODO timer
		// start_join = Date.now()
		this.socket.emit('join', {
			loggerId: id
		})
	}
		
	DiffSync_state(packet: IPatch) {
		this.data_service.addPatch(packet)
		console.log('diff', packet)
	}

	async StepTypeChanged_state(value: 'transitions' | 'states' | 'steps') {
		if (this.states.is('Rendering')) {
			const abort = this.states.getAbort('StepTypeChanged')
			await this.states.when('Rendered')
			if (abort())
				return
		}
		const t = StepTypes
		const type = StepTypes[value.toUpperCase()]
		switch (type) {
			case t.STATES:
				this.states.add('StepByStates')
				break
			case t.TRANSITIONS:
				this.states.add('StepByTransitions')
				break
			case t.STEPS:
				this.states.add('StepBySteps')
				break
		}
		this.data_service.setStepType(type)
		this.renderUI()
		this.states.drop('StepTypeChanged')
	}

	DOMReady_state() {
		this.container = document.getElementById('app')
		this.renderUI()
		this.graph.render('#graph')
	}

  async PlayStopClicked_state() {
		const abort = this.states.getAbort('PlayStopClicked')
    if (this.states.is('AutoplayOn')) {
			await new Promise(resolve => {
				this.states.drop('AutoplayOn')
				this.states.once('AutoplayOn_end', resolve)
			})
			if (abort()) return
		} else
      this.states.add('AutoplayOn')
    this.states.drop('PlayStopClicked')
		this.renderUI()
  }

	TimelineScrolled_state(value: number) {
		// TODO debounce
		this.data_service.scrollTo(value)
		this.renderUI()
		this.states.drop('TimelineScrolled')
	}

	Playing_state() {
		const start = Date.now()
		this.step_fn = this.playStep.bind(this)
		const abort = this.states.getAbort('Playing')
		this.step_timer = setTimeout(this.step_fn, this.frametime*1000)
	}

	async playStep(abort: Function) {
		let last
		if (abort()) return;
		if (this.states.is('Rendering')) {
			await this.states.when('Rendered')
			if (abort()) return;
		}
		// merged-step to catch up with the skipped frames
		let framestimes_since_last = Math.round(
			(Date.now() - last) / (this.frametime*1000))
		this.data_service.scrollTo(Math.max(this.data_service.position_max,
			this.data_service.position + framestimes_since_last))
		this.renderUI()
		setTimeout(this.step_fn, this.frametime*1000)
	}

	Playing_end() {
		clearTimeout(this.step_timer)
		this.step_timer = null
	}

	Connected_state() {
		this.showMsg('Connected')
	}

	Connected_end() {
		this.showMsg('Disconnected')
	}

	// METHODS

	renderUI() {
		this.layout = renderLayout(this.container, this.layout_data)
	}

	showMsg(msg) {
		this.layout_data.msg = msg
		this.renderUI()
	}

	handleTransitionMessage() {
		// TODO highlight the involved parts of the log view
		// let reversed = (data_service.last_scroll_direction == Direction.BACK)
		let packet = this.data_service.current_patch
		let data = this.layout_data
		if (packet && packet.type == PatchType.TRANSITION_START) {
			data.msg = `Transition started on ${packet.machine_id}`
			data.msgHidden = false
		} else if (packet && packet.type == PatchType.TRANSITION_END) {
			data.msg = `Transition ended on ${packet.machine_id}`
			data.msgHidden = false
		} else
			data.msg = null
	}
}

export default function() {
	return new InspectorUI()
}

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
