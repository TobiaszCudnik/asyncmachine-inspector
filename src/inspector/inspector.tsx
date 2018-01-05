import renderLayout, { TLayoutProps } from './ui/layout'
// UI type
import Graph from './joint/joint'
import LayoutWorker from 'raw-loader!../../dist/am-inspector-layout-worker.umd.js'
import { INetworkJson } from './joint/network'
import * as io from 'socket.io-client'
import Network, { ILogEntry, IPatch } from '../network/network'
import * as jsondiffpatch from 'jsondiffpatch'
import { default as JointDataService, StepTypes } from './joint/data-service'
import { throttle } from 'underscore'
import States from './states'
import Settings from './settings'
import { ITransitions } from './states-types'
import workerio from 'workerio/src/workerio/index'
import * as url from 'url'
import Logger from '../logger/logger'
import * as downloadAsFile from 'download-as-file'
import * as onFileUpload from 'upload-element'
import * as bindKey from 'keymaster'
import deepMerge from 'deepmerge'
import keystrokes from './keystrokes'
import { JSONSnapshot } from '../network/network-json'

const log = (...args) => {}

export { Logger, Network }

export enum STEP_TYPE_CHANGE {
  TRANSITION = 'transitions',
  STATES = 'states',
  STEPS = 'steps'
}

export class Inspector implements ITransitions {
  states = new States(this)
  private data_service_: JointDataService
  settings = new Settings()
  graph = new Graph(null, this.settings)
  layout_data: TLayoutProps
  frametime = 0.5
  socket: io.Socket
  layout
  container: Element
  logger_id: string
  step_timer: number
  step_fn: Function
  differ: jsondiffpatch
  logs: ILogEntry[][] = []
  // TODO type
  layout_worker: any
  full_sync: INetworkJson
  last_render: number
  data_service_sync_max_skip = 500
  data_service_last_sync = 0
  rendering_position = 0
  overlayListener: EventListenerOrEventListenerObject

  get overlay_el() {
    return document.querySelector('#overlay')
  }

  set data_service(value) {
    log('synced the data_service', value)
    this.data_service_ = value
    this.updateTimelineStates()
  }

  get data_service() {
    return this.data_service_
  }

  constructor(public container_selector = '#am-inspector', debug = false) {
    this.states.id('Inspector')
    this.states.add(['TimelineOnFirst', 'Connecting'])
    if (this.settings.get().autoplay) {
      this.states.add('AutoplayOn')
    }
    if (debug) {
      this.states.logLevel(3)
    }

    this.layout_data = this.buildLayoutData()
    this.data_service = new JointDataService()

    if (document.readyState == 'complete') {
      this.states.add('DOMReady')
    } else {
      window.document.addEventListener(
        'DOMContentLoaded',
        this.states.addByListener('DOMReady')
      )
    }
  }

  Connect_state(url = 'http://localhost:3757/') {
    this.socket = io(`${url}/client`)
    this.socket.on('full-sync', this.states.addByListener('FullSync'))
    this.socket.on('diff-sync', this.states.addByListener('DiffSync'))
    this.socket.on('connect', this.states.addByListener('Connected'))
    // TODO connection_error event and bind retries to a state
    this.socket.on('disconnected', this.states.addByListener('Disconnected'))
  }

  // TODO support resetting
  // TODO basedir
  async InitializingLayoutWorker_state() {
    let worker, LayoutWorkerRemote
    // TODO https://github.com/stackblitz/core/issues/72
    if (!location.hostname.includes('stackblitz') && Worker) {
      // worker = new Worker('../../dist/am-inspector-layout-worker.umd.js')
      const blob = new Blob([LayoutWorker], { type: 'application/javascript' })
      worker = new Worker(URL.createObjectURL(blob))
      LayoutWorkerRemote = await workerio.getInterface(worker, 'api')
    } else {
      console.error('TODO')
      // TODO test
      eval(LayoutWorker)
      LayoutWorkerRemote = await workerio.getInterface(window, 'api')
    }
    // TODO keep in the graph class?
    this.layout_worker = new LayoutWorkerRemote()
    this.states.add('LayoutWorkerReady')
  }

  // TRANSITIONS

  async FullSync_state(graph_data: INetworkJson) {
    if (!this.states.to().includes('LayoutWorkerReady'))
      await this.states.when('LayoutWorkerReady')
    // TODO check LayoutWorkerReady (use while)
    // TODO cancel the rendering here (if there was an existing FullSync)
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

  FullSync_exit() {
    this.layout_worker.reset()
  }

  InitialRenderDone_state() {
    if (this.states.is('AutoplayOn')) {
      this.states.add('Playing')
    }
  }

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
    const play = this.shouldPlay()
    log('play', play)
    if (abort() && !force_refresh) return
    this.data_service_last_sync = now
    this.data_service = data_service
    if (play) {
      log('Autoplay from DiffSync')
      states.add('Playing')
    } else if (states.is('InitialRenderDone') && !this.rendering_position) {
      this.states.add('Rendering', this.rendering_position)
    }
    this.renderUI()
    log('diff', packet)
    log('updated dataservice', data_service)
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
    this.container = document.querySelector(this.container_selector)
    this.renderUI()
    // TODO bind via a random ID
    this.graph.render('#graph')
  }

  async PlayStopClicked_state() {
    const abort = this.states.getAbort('PlayStopClicked')
    if (this.states.is('Playing')) {
      this.states.drop('Playing')
    } else if (
      this.data_service.position_max &&
      !this.states.is('TimelineOnLast')
    ) {
      this.states.add('Playing')
    }
    this.states.drop('PlayStopClicked')
  }

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
    this.states.add('Rendering', value)
    this.states.drop('TimelineScrolled')
  }

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

  Playing_end() {
    clearTimeout(this.step_timer)
    this.step_timer = null
    this.renderUI()
  }

  LegendVisible_state() {
    this.overlayListener = e => {
      this.states.drop('LegendVisible')
    }
    this.renderUI()
    this.overlay_el.addEventListener('click', this.overlayListener)
  }

  LegendVisible_end() {
    this.overlay_el.removeEventListener('click', this.overlayListener)
    this.renderUI()
  }

  ConnectionDialogVisible_state() {
    this.overlayListener = e => {
      this.states.drop('ConnectionDialogVisible')
    }
    this.renderUI()
    this.overlay_el.addEventListener('click', this.overlayListener)
  }

  ConnectionDialogVisible_end() {
    this.overlay_el.removeEventListener('click', this.overlayListener)
    this.renderUI()
  }

  // METHODS

  protected async playStep(abort: Function) {
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

  protected shouldPlay() {
    return (
      this.states.is('AutoplayOn') &&
      (!this.data_service.position_max || this.states.is('TimelineOnLast'))
    )
  }

  /**
   * Bind the inspector to a local logger's instance.
   */
  setLogger(logger: Logger) {
    this.states.add('FullSync', logger.full_sync)
    logger.on('diff-sync', this.states.addByListener('DiffSync'))
  }

  buildLayoutData(): TLayoutProps {
    const self = this
    let playstop = this.states.addByListener('PlayStopClicked')
    let data: TLayoutProps = {
      is_snapshot: false,
      get is_legend_visible() {
        return self.states.is('LegendVisible')
      },
      get is_connection_dialog_visible() {
        return self.states.is('ConnectionDialogVisible')
      },
      get position_max() {
        return self.data_service.position_max
      },
      get is_during_transition() {
        return Boolean(self.data_service.active_transitions.length)
      },
      get position() {
        return self.data_service.position
      },
      get step_type() {
        let t = StepTypes
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
      get machines() {
        // TODO dont query the layout graph directly
        let ret = {}
        if (!self.graph.data) return ret
        const machines = self.graph.data.cells.filter(
          c => c.type == 'uml.State'
        )
        for (let cell of machines) {
          ret[cell.id] = cell
        }
        return ret
      },
      get is_connected() {
        return self.states.is('Connected') || self.states.is('FullSync')
      },
      get on_last() {
        return self.data_service.is_latest
      },
      get is_playing() {
        return self.states.is('Playing')
      },
      get active_transitions() {
        return self.data_service.active_transitions
      },
      get active_transitions_touched() {
        // TODO dont query the layout graph directly
        let ret = {}
        if (!self.graph.data) return ret
        for (let cell of self.graph.data.cells) {
          if (cell.type == 'fsa.State') {
            if (!cell.step_style) continue
            const [machine_id] = cell.id.split(':')
            if (!ret[machine_id]) {
              ret[machine_id] = []
            }
            ret[machine_id].push(cell.attrs.text.text.replace('\n', ''))
          } else if (cell.type == 'uml.State') {
            if (!cell.is_touched) continue
            if (!ret[cell.id]) {
              ret[cell.id] = []
            }
          }
        }
        return ret
      },
      get prev_transitions() {
        return self.data_service.prev_transitions
      },
      get prev_transitions_touched() {
        let ret = {}
        function removeDuplicates(dest, src) {
          return _.uniq([...dest, src])
        }
        for (let transition of self.data_service.prev_transitions) {
          ret = deepMerge(ret, transition.touched, removeDuplicates)
        }
        return ret
      },
      get next_transitions() {
        return self.data_service.next_transitions
      },
      get next_transitions_touched() {
        let ret = {}
        function removeDuplicates(dest, src) {
          return _.uniq([...dest, src])
        }
        for (let transition of self.data_service.next_transitions) {
          ret = deepMerge(ret, transition.touched, removeDuplicates)
        }
        return ret
      },
      /**
       * TODO export log entires within the patch object
       */
      onDownloadSnapshot: async function() {
        const { patches } = await self.layout_worker.export()
        // TODO mixin logs into patches, based on the index position
        const content: JSONSnapshot = {
          full_sync: self.full_sync,
          patches,
          logs: self.logs
        }
        downloadAsFile(
          JSON.stringify({
            data: content,
            // TODO format the date
            filename: `inspector-snapshot-${Date.now()}.json`
          })
        )
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
      onPlayButton: playstop,
      onAutoplayToggle: () => {
        if (self.states.is('AutoplayOn')) {
          self.states.drop('AutoplayOn')
        } else {
          self.states.add('AutoplayOn')
        }
      },
      onHelpButton: () => {
        // TODO react repaints from ui events arent sync...
        self.states.addNext('LegendVisible')
      },
      onResetButton: () => {
        self.settings.reset()
      },
      onConnectButton: () => {
        // TODO react repaints from ui events arent sync...
        self.states.addNext('ConnectionDialogVisible')
      },
      onConnectSubmit: data => {
        self.states.drop('ConnectionDialogVisible')
        // TODO handle progress, errors
        self.states.add('Connect', data.url)
      },
      settings: this.settings
    }
    return data
  }

  renderUI() {
    const first = !this.layout
    this.layout = renderLayout(this.container, this.layout_data)
    if (first) {
      this.initSnapshotUpload()
      this.initKeystrokes()
      // TODO !this.states.willBe('FullSync')
      if (
        !this.states.is('FullSync') &&
        localStorage.getItem('last_snapshot')
      ) {
        this.loadSnapshot(JSON.parse(localStorage.getItem('last_snapshot')))
      }
    }
  }

  initKeystrokes() {
    for (let [key, fn] of Object.entries(keystrokes(this))) {
      bindKey(key, fn)
    }
  }

  initSnapshotUpload() {
    onFileUpload(
      document.getElementById('snapshot-upload'),
      { type: 'text' },
      (err, files) => {
        for (const file of files) {
          // TODO keep in the settings class
          localStorage.setItem('last_snapshot', file.target.result)
          const snapshot = JSON.parse(file.target.result)
          this.loadSnapshot(snapshot)
          break
        }
      }
    )
    this.renderUI()
  }

  loadSnapshot(snapshot) {
    // TODO make it a state
    this.layout_data.is_snapshot = true
    this.states.drop('AutoplayOn')
    this.states.add('FullSync', snapshot.full_sync)
    for (const patch of snapshot.patches) {
      this.states.add('DiffSync', patch)
    }
  }

  async onDataServiceScrolled(
    layout_data: TLayoutProps,
    patch,
    changed_cells: string[]
  ) {
    // log('onDataServiceScrolled', deepcopy(this.data_service))
    this.updateTimelineStates()
    jsondiffpatch.patch(this.graph.data, patch)
    if (changed_cells && [...changed_cells].length) {
      await this.graph.updateCells(
        changed_cells,
        this.data_service.last_scroll_add_remove,
        layout_data
      )
    }
  }

  updateTimelineStates() {
    if (this.data_service.is_latest) {
      this.states.add('TimelineOnLast')
    } else if (this.data_service.position == 0) {
      this.states.add('TimelineOnFirst')
    } else {
      this.states.add('TimelineOnBetween')
    }
  }
}

export default function(container_selector?) {
  const { query } = url.parse(window.document.location.toString(), true)
  const inspector = new Inspector(container_selector, query.debug)
  if (query.server) {
    inspector.states.add('Connect', query.server)
  }
  return inspector
}
