import renderLayout from './layout'
// UI type
import Graph from './joint'
import { INetworkJson } from './joint-network'
// import Graph from './cola'
// import { INetworkJson } from './cola-network'
// import * as io from 'socket.io-client'
import { ILogEntry, IPatch, PatchType } from '../network'
import * as jsondiffpatch from 'jsondiffpatch'
import 'core-js/es6/symbol'
import {
  default as JointDataService,
  Direction,
  StepTypes
} from './joint-data-service'
import { throttle } from 'underscore'
import { TLayoutProps } from './layout'
import States from './states'
import { ITransitions } from './states-types'
import workerio from 'workerio/src/workerio/index'
import * as url from 'url'
import Logger from '../logger-file'
import Network from '../network'
import * as deepcopy from 'deepcopy'
import * as downloadAsFile from 'download-as-file'
import * as onFileUpload from 'upload-element'
import * as key from 'keymaster'

const log = (...args) => {}

export enum STEP_TYPE_CHANGE {
  TRANSITION = 'transitions',
  STATES = 'states',
  STEPS = 'steps'
}

/**
 * TODO
 * - pre-render N next steps when playing (possibly in a pool of workers)
 * - longer delay for msgs than for a step they come from
 * - queue & merge scroll requests while rendering
 *   - ideally cancel the current rendering
 * - timers
 * - renderUI() as a state
 */
export class InspectorUI implements ITransitions {
  states = new States(this)
  private data_service_: JointDataService
  graph = new Graph(null)
  layout_data: TLayoutProps
  frametime = 0.5
  // TODO type
  // socket: io.Socket
  layout
  container: Element
  logger_id: string
  step_timer: number
  step_fn: Function
  differ: jsondiffpatch
  logs: ILogEntry[][] = []
  // kept for exporting
  full_sync: INetworkJson

  constructor(public host = 'localhost', public port = 3030) {
    this.states.id('Inspector')
    this.states.add(['AutoplayOn', 'Connecting'])

    // this.socket = io(`http://${this.host}:${this.port}/client`)
    // this.socket.on('full-sync', this.states.addByListener('FullSync'))
    // this.socket.on('diff-sync', this.states.addByListener('DiffSync'))
    // this.socket.on(
    //   'connect',
    //   this.states.addByListener(['Connected', 'Joined'])
    // )
    // TODO connection_error event and bind retries to a state
    // this.socket.on('disconnected', this.states.addByListener('Disconnected'))
    // this.socket.on('loggers', this.states.addByListener('Joining'))
    // predefined debugger port
    if (port != 4040 && window.location.search.match(/debug=1/)) {
      this.states.logLevel(3)
      const network = new Network()
      network.addMachine(this.states)
      const logger = new Logger(network, 'localhost:4040/logger')
    }
    window.document.addEventListener(
      'DOMContentLoaded',
      this.states.addByListener('DOMReady')
    )

    this.layout_data = this.buildLayoutData()
    this.data_service = new JointDataService()
  }

  // TODO type
  layout_worker: any

  set data_service(value) {
    log('synced the data_service', value)
    this.data_service_ = value
    this.updateTimelineStates()
  }

  get data_service() {
    return this.data_service_
  }

  // TODO support resetting
  async InitializingLayoutWorker_state() {
    // TODO basedir
    const worker = new Worker('../../dist/worker-layout.umd.js')
    let LayoutWorker = await workerio.getInterface(worker, 'api')
    // TODO keep in the graph class?
    this.layout_worker = new LayoutWorker()
    this.states.add('LayoutWorkerReady')
  }

  // TRANSITIONS

  async FullSync_state(graph_data: INetworkJson) {
    if (!this.states.to().includes('LayoutWorkerReady'))
      await this.states.when('LayoutWorkerReady')
    // TODO cancel the rendering here
    this.logger_id = graph_data.loggerId
    this.states.add(['Rendering'])
    // console.log('full-sync', Date.now() - start_join)
    log('full-sync', graph_data)
    this.full_sync = graph_data
    // TODO reset?
    this.data_service.data = graph_data
    let { layout_data, data_service } = await this.layout_worker.setData(
      graph_data
    )
    this.data_service = data_service
    await this.graph.setData(graph_data, layout_data)
    // TODO move it into the graph class
    this.graph.postUpdateLayout()
    this.states.add('Rendered')
    this.renderUI()
  }

  FullSync_Joining() {
    // re-init the data service on re-joining
    // TODO async
    this.layout_worker.reset()
  }

  data_service_sync_max_skip = 500
  data_service_last_sync = 0

  async DiffSync_state(packet: IPatch) {
    const states = this.states
    const abort = states.getAbort('DiffSync')
    if (!states.to().includes('LayoutWorkerReady'))
      await states.when('LayoutWorkerReady')
    this.logs.push(packet.logs)
    const data_service = await this.layout_worker.addPatch(packet)
    const now = Date.now()
    const force_refresh =
      now - this.data_service_last_sync > this.data_service_sync_max_skip
    // TODO extract to AutoplayOn_DiffSync (and handle async dataservice sync)
    const play =
      states.is('AutoplayOn') &&
      (!this.data_service.position_max || states.is('TimelineOnLast'))
    log('play', play)
    if (abort() && !force_refresh) return
    this.data_service_last_sync = now
    this.data_service = data_service
    if (play) {
      log('Autoplay from DiffSync')
      states.add('Playing')
    }
    this.renderUI()
    // console.log('diff', packet)
    console.log('updated dataservice', data_service)
  }

  async StepTypeChanged_state(value: STEP_TYPE_CHANGE) {
    if (this.states.is('Rendering')) {
      const abort = this.states.getAbort('StepTypeChanged')
      await this.states.when('Rendered')
      if (abort()) return
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
    // TODO sync the data_servie, use abort
    let {
      layout_data,
      patch,
      data_service,
      changed_ids
    } = await this.layout_worker.setStepType(type)
    this.data_service = data_service
    await this.onDataServiceScrolled(layout_data, patch, changed_ids)
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
    if (this.states.is('Playing')) this.states.drop('Playing')
    else if (
      this.data_service.position_max &&
      !this.states.is('TimelineOnLast')
    )
      this.states.add('Playing')
    this.states.drop('PlayStopClicked')
  }

  rendering_position = 0

  Rendering_enter(position): boolean {
    if (this.states.from().includes('Rendering')) {
      if (this.rendering_position == position) {
        return false
      } else if (
        this.states.to().includes('Playing') &&
        position < this.rendering_position
      ) {
        return false
      } else {
        // TODO GC
        this.states.once(
          'Rendering_end',
          this.states.addByListener('Rendering', position)
        )
        return false
      }
    }
    return true
  }

  async Rendering_state(position) {
    if (position !== undefined) {
      this.rendering_position = position
      let {
        layout_data,
        patch,
        data_service,
        changed_ids
      } = await this.layout_worker.layout(position)
      this.data_service = data_service
      await this.onDataServiceScrolled(layout_data, patch, changed_ids)
      this.states.add('Rendered')
      this.renderUI()
    }
  }

  async TimelineScrolled_state(value: number) {
    // this.data_service.scrollTo(value)
    // TODO propagate the current position to the worker first
    // TODO merge the common parts with #playStep
    this.states.add('Rendering', value)
    this.states.drop('TimelineScrolled')
  }

  last_render: number

  Playing_enter() {
    return Boolean(this.data_service.position_max)
  }

  Playing_state() {
    this.last_render = Date.now()
    const abort = this.states.getAbort('Playing')
    this.step_fn = this.playStep.bind(this, abort)
    this.step_timer = setTimeout(this.step_fn, this.frametime * 1000)
    this.renderUI()
  }

  async playStep(abort: Function) {
    if (abort()) return
    if (this.states.is('Rendering')) {
      await this.states.when('Rendered')
      if (abort()) return
    }
    // merged-step to catch up with the skipped frames
    let framestimes_since_last = Math.round(
      (Date.now() - this.last_render) / (this.frametime * 1000)
    )
    let position = Math.min(
      this.data_service.position_max,
      this.data_service.position + framestimes_since_last
    )
    if (framestimes_since_last) {
      log('merge jump to position', position)
      this.states.add('Rendering', position)
      // TODO move to render
      this.last_render = Date.now()
    }
    if (
      this.data_service.position + framestimes_since_last <
      this.data_service.position_max
    ) {
      setTimeout(this.step_fn, this.frametime * 1000)
    }
  }

  Playing_end() {
    clearTimeout(this.step_timer)
    this.step_timer = null
    this.renderUI()
  }

  Connected_state() {
    this.showMsg('Connected')
  }

  Connected_end() {
    this.showMsg('Disconnected')
  }

  // METHODS

  buildLayoutData(): TLayoutProps {
    const self = this
    let playstop = this.states.addByListener('PlayStopClicked')
    let data: TLayoutProps = {
      get position_max() {
        return self.data_service.position_max
      },
      get is_during_transition() {
        return self.data_service.during_transition
      },
      get position() {
        return self.data_service.position
      },
      // TODO enum it
      get step_type() {
        let t = StepTypes
        // TODO enum
        switch (self.data_service.step_type) {
          case t.TRANSITIONS:
            return 'transitions'
          case t.STEPS:
            return 'steps'
        }
        return 'states'
      },
      get logs() {
        return self.logs.slice(0, self.data_service.patch_position)
      },
      get is_connected() {
        return self.states.is('Connected')
      },
      get on_last() {
        return self.data_service.is_latest
      },
      onDownloadSnapshot: async function() {
        const { patches } = await self.layout_worker.export()
        const content = JSON.stringify({
          full_sync: self.full_sync,
          patches,
          logs: this.logs
        })
        downloadAsFile({
          data: content,
          // TODO format the date
          filename: `inspector-snapshot-${Date.now()}.json`
        })
      },
      // TODO type the export data
      onTimelineSlider: throttle((event, value) => {
        self.states.add('TimelineScrolled', value)
      }, 100),
      onZoomSlider: null, // TODO
      onStepType: (event, index, value) => {
        if (self.data_service.step_type != value)
          self.states.add('StepTypeChanged', value)
      },
      msg: null,
      msgHidden: false,
      get is_playing() {
        return self.states.is('Playing')
      },
      onPlayButton: playstop,
      onAutoplayToggle: () => {
        if (this.states.is('AutoplayOn')) this.states.drop('AutoplayOn')
        else this.states.add('AutoplayOn')
      },
      is_snapshot: false,
      is_legend_visible: false
    }
    return data
  }

  renderUI() {
    const first = !this.layout
    this.layout = renderLayout(this.container, this.layout_data)
    if (first) {
      this.initSnapshotUpload()
      this.initKeystrokes()
    }
  }

  initKeystrokes() {
    key('shift + /', () => {
      this.layout_data.is_legend_visible = !this.layout_data.is_legend_visible
      this.renderUI()
    })
    key('left', () => {
      const val = this.data_service.position
      this.states.add('Rendering', val - 1)
    })
    key('right', () => {
      const val = this.data_service.position
      this.states.add('Rendering', val + 1)
    })
  }

  initSnapshotUpload() {
    onFileUpload(
      document.getElementById('snapshot-upload'),
      { type: 'text' },
      (err, files) => {
        for (const file of files) {
          const snapshot = JSON.parse(file.target.result)
          // TODO make it a state
          this.layout_data.is_snapshot = true
          this.states.drop('AutoplayOn')
          this.states.add('FullSync', snapshot.full_sync)
          for (const patch of snapshot.patches)
            this.states.add('DiffSync', patch)
          // TODO merge in the logs
          break
        }
      }
    )
    this.renderUI()
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
    } else data.msg = null
  }

  async onDataServiceScrolled(
    layout_data: TLayoutProps,
    patch,
    changed_cells: string[]
  ) {
    log('onDataServiceScrolled', deepcopy(this.data_service))
    this.updateTimelineStates()
    jsondiffpatch.patch(this.graph.data, patch)
    if (changed_cells && [...changed_cells].length) {
      await this.graph.updateCells(
        changed_cells,
        this.data_service.last_scroll_add_remove,
        layout_data
      )
      this.handleTransitionMessage()
    }
  }

  updateTimelineStates() {
    if (this.data_service.is_latest) this.states.add('TimelineOnLast')
    else if (this.data_service.position == 0) this.states.add('TimelineOnFirst')
    else this.states.add('TimelineOnBetween')
  }
}

export default function() {
  const { query } = url.parse(window.document.location.toString(), true)
  return new InspectorUI('localhost', query.port || 3030)
}
