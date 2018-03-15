import renderLayout, { TLayoutProps } from './ui/layout'
// UI type
import Graph from './joint/graph'
// TODO loose this magic once worker modules are here
import * as LayoutWorker from 'raw-loader!../../dist/am-inspector-layout-worker.umd.js'
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
import Logger from '../logger/browser'
import LoggerRemote from '../logger/remote-browser'
import * as downloadAsFile from 'download-as-file'
import * as onFileUpload from 'upload-element'
import * as bindKey from 'keymaster'
import deepMerge from 'deepmerge'
import keystrokes from './keystrokes'
import { JSONSnapshot } from '../network/network-json'
import * as db from 'idb-keyval'
import { IDataServiceSync, ISync } from './joint/layout-worker'
import { isProd } from './utils'

// const log = (...args) => {}
const log = console.log.bind(console)

export { Logger, Network }

export enum STEP_TYPE_CHANGE {
  TRANSITION = 'transitions',
  STATES = 'states',
  STEPS = 'steps'
}

export class Inspector implements ITransitions {
  states = new States(this)
  protected _data_service: IDataServiceSync | null
  settings = new Settings()
  graph = new Graph(null, this.settings)
  layout_data: TLayoutProps
  frametime = 0.5
  socket: io.Socket
  layout
  container: Element
  step_timer: number
  step_fn: Function
  differ: jsondiffpatch
  logs: ILogEntry[][] = []
  // TODO type
  layout_worker: any
  full_sync: INetworkJson
  // last render time
  last_render: number
  playing_longest_empty_render = 500
  data_service_last_sync = 0
  rendering_position = 0
  rendered_patch = 0
  rendered_step_type: StepTypes
  overlayListener: EventListenerOrEventListenerObject
  worker_patches_pending: IPatch[] = []
  last_manual_scroll: number = null

  renderUIQueue: (() => void) | null

  get overlay_el() {
    return document.querySelector('#overlay')
  }

  set data_service(value) {
    // log(`synced the data_service, max: ${value.position_max}`, value)
    this._data_service = value
    this.updateTimelineStates()
  }

  get data_service() {
    return this._data_service
  }

  self_network: Network
  self_logger: LoggerRemote

  constructor(
    public container_selector = '#am-inspector',
    public server_url: string,
    debug: number,
    debug_server: string
  ) {
    this.states.id('Inspector')
    this.states.add(['TimelineOnFirst'])
    if (server_url) {
      this.states.add('Connecting', server_url)
    }
    if (this.settings.get().autoplay) {
      this.states.add('AutoplayOn')
    }
    if (debug) {
      this.states.logLevel(debug)
    }
    if (debug_server) {
      this.self_network = new Network()
      this.self_network.addMachine(this.states)
      this.self_logger = new LoggerRemote(this.self_network, debug_server)
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
    // setup the play interval
    this.step_fn = this.playStep.bind(this)
    this.step_timer = setInterval(this.step_fn, this.frametime * 1000)
    // throttle UI updates
    this.renderUIQueue = throttle(() => {
      this.renderUI()
    }, 100)
  }

  Connecting_state(url = 'http://localhost:3757') {
    url = url.replace(/\/$/, '')
    this.socket = io(`${url}/client`)
    this.socket.on('full-sync', sync => {
      // reset all the data
      this.states.drop('FullSync')
      this.states.add('FullSync', sync)
    })
    this.socket.on('diff-sync', this.states.addByListener('DiffSync'))
    this.socket.on('batch-sync', patches =>
      this.addPatches(patches)
    )
    this.socket.on('connect', this.states.addByListener('Connected'))
    // TODO connection_error event and bind retries to a state
    this.socket.on('disconnected', this.states.addByListener('Disconnected'))
  }

  // TODO support resetting
  // TODO basedir
  async InitializingLayoutWorker_state() {
    let worker, LayoutWorkerRemote
    // TODO https://github.com/stackblitz/core/issues/72
    if (Worker) {
      const blob = new Blob([LayoutWorker], { type: 'application/javascript' })
      worker = new Worker(URL.createObjectURL(blob))
      LayoutWorkerRemote = await workerio.getInterface(worker, 'api')
    } else {
      console.error('TODO inline worker')
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
    // TODO avoid duplication
    if (!this.states.is('AutoplayOn')) {
      this.last_manual_scroll = 0
    }
    if (!this.states.to().includes('LayoutWorkerReady'))
      await this.states.when('LayoutWorkerReady')
    if (!isProd()) console.time('FullSync_state')
    log('full-sync', graph_data)
    this.full_sync = graph_data

    if (!isProd()) console.time('layout_worker.fullSync')
    await db.set('full_sync', graph_data)
    let { layout_data, data_service } = await this.layout_worker.fullSync()
    if (!isProd()) console.timeEnd('layout_worker.fullSync')

    if (!isProd()) console.time('graph.setData')
    this.data_service = data_service
    // render
    await this.graph.setData(graph_data, layout_data)
    // TODO support rendering to the last position
    this.rendered_step_type = this.data_service.step_type
    this.rendered_patch = this.data_service.patch_position
    if (!isProd()) console.timeEnd('graph.setData')

    this.last_render = Date.now()
    if (!isProd()) console.timeEnd('postUpdateLayout')

    this.states.add('Rendered')
    this.renderUIQueue()
    if (!isProd()) console.timeEnd('FullSync_state')
  }

  async FullSync_end() {
    log('resetting everything...')
    this.last_manual_scroll = null
    this.layout_worker.reset()
    // TODO reset assigned colors
    this.graph.reset()
    this.logs = []
  }

  async LayoutWorkerReady_state() {
    if (!this.worker_patches_pending.length) return
    await this.addPatches(this.worker_patches_pending)
  }

  // Add patches in a bulk, but ending with a regular render
  // @param patches List of patches. MODIFIED by reference.
  async addPatches(patches: IPatch[]) {
    if (!this.states.is("LayoutWorkerReady")) {
      this.worker_patches_pending.push(...patches)
      return
    }
    const latest = patches.pop()
    console.time('addPatches')
    await this.layout_worker.addPatches(patches)
    console.timeEnd('addPatches')
    let patch
    while ((patch = patches.shift())) {
      this.logs.push(patch.logs)
    }
    log(`latest ${latest.type}`)
    // the last patch should trigger the regular procedure
    this.states.add('DiffSync', latest)
  }

  //   // TODO GC this.layout_worker
  // }

  async DiffSync_state(patch: IPatch) {
    // log(`patch type ${patch.type}`)
    const states = this.states
    // queue the patches until the worker is ready
    if (!states.to().includes('LayoutWorkerReady')) {
      this.worker_patches_pending.push(patch)
      // log(`worker not ready - patch postponed`)
      return
    }
    this.logs.push(patch.logs)
    const data_service = await this.layout_worker.addPatch(patch)
    this.data_service_last_sync = Date.now()
    this.data_service = data_service
    this.renderUIQueue()
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
    const update = await this.layout_worker.setStepType(type)
    this.data_service = update.data_service
    if (update.changed_ids && update.changed_ids.length) {
      await this.onDataServiceScrolled(update)
    }
    // TODO merge with DiffRendering and FullSync
    this.last_render = Date.now()
    this.rendered_step_type = this.data_service.step_type
    this.rendered_patch = this.data_service.patch_position
    this.renderUIQueue()
    this.states.drop('StepTypeChanged')
  }

  DOMReady_state() {
    this.container = document.querySelector(this.container_selector)
    this.renderUIQueue()
    // TODO bind via a random ID
    this.graph.render('#graph')
  }

  async PlayStopClicked_state() {
    // TODO should restart the playStep interval to react immediately
    const abort = this.states.getAbort('PlayStopClicked')
    this.last_manual_scroll = null
    this.states.drop('PlayStopClicked')
  }

  Rendering_enter(position): boolean {
    if (position === undefined) {
      log('no position')
      return false
    }
    if (this.states.from().includes('Rendering')) {
      if (this.rendering_position == position) {
        // duplicate scroll, ignore
        log('duplicate scroll, ignore')
        return false
      } else if (
        // backwards position while playing, ignore
        this.states.to().includes('Playing') &&
        position < this.rendering_position
      ) {
        log('backwards position while playing, ignore')
        return false
      }
    }
  }

  // TODO rename to DiffRendering and keep Rendering as:
  // (+FullSync-InitialRenderingDone) | DiffRendering
  async Rendering_state(position) {
    log('DiffRendering start')
    if (!isProd()) console.time('DiffRendering')
    const abort = this.states.getAbort('Rendering')
    // always get the diff from the last rendered position
    if (
      this.rendered_patch != this.data_service.patch_position ||
      this.rendered_step_type != this.data_service.step_type
    ) {
      log('fixing dataservice scroll position')
      // TODO no await needed?
      await this.layout_worker.blindSetPosition(
        this.data_service.step_type,
        this.rendered_patch
      )
      if (!isProd()) console.timeEnd('fixing dataservice scroll position')
      if (abort()) return
    }
    // TODO patch_position, step_type ???
    this.rendering_position = position
    if (!isProd()) console.time('layout_worker.layout')
    // TODO step_type ???
    let update: ISync = await this.layout_worker.diffSync(position)
    if (!isProd()) console.timeEnd('layout_worker.layout')
    if (abort()) return
    this.data_service = update.data_service
    // cant cancel after this point
    await this.onDataServiceScrolled(update)
    this.last_render = Date.now()
    this.rendered_step_type = this.data_service.step_type
    this.rendered_patch = this.data_service.patch_position
    this.states.add('Rendered')
    this.renderUIQueue()
    if (!isProd()) console.timeEnd('DiffRendering')
  }

  Rendering_exit() {
    const now = Date.now()
    const force_render =
      now - this.last_render > this.playing_longest_empty_render
    return !(this.states.is('Playing') && force_render)
  }

  async TimelineScrolled_state(value: number) {
    log('TimelineScrolled')
    this.last_manual_scroll = value
    if (this.states.is('InitialRenderDone')) {
      this.states.add('Rendering', value)
    } else {
      // TODO handle the rejection
    }
    this.states.drop('TimelineScrolled')
  }

  Playing_enter() {
    return Boolean(this.data_service.position_max)
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
    this.renderUIQueue()
    this.overlay_el.addEventListener('click', this.overlayListener)
  }

  ConnectionDialogVisible_end() {
    this.overlay_el.removeEventListener('click', this.overlayListener)
    this.renderUIQueue()
  }

  // METHODS

  // TODO merge with Render_exit
  protected async playStep() {
    if (!this.states.is('InitialRenderDone') || !this.states.is('FullSync'))
      return
    if (this.states.is('Rendering')) {
      await this.states.when('Rendered')
    }
    if (
      this.data_service.position == this.data_service.position_max ||
      (this.last_manual_scroll !== null &&
        this.last_manual_scroll != this.data_service.position_max)
    ) {
      if (this.states.is('Playing')) {
        this.states.drop('Playing')
      }
      return
    }
    let frames_since_last
    if (!this.states.is('Playing')) {
      // start playing
      this.states.add('Playing')
      frames_since_last = 1
    } else {
      // merged-step to catch up with the skipped frames
      frames_since_last = Math.round(
        (Date.now() - this.last_render) / (this.frametime * 1000)
      )
    }
    let position = Math.min(
      this.data_service.position_max,
      this.data_service.position + frames_since_last
    )
    log(`play to pos ${position} (${frames_since_last} skipped)`)
    this.states.add('Rendering', position)
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
          patches
        }
        downloadAsFile({
          data: JSON.stringify(content),
          // TODO format the date
          filename: `inspector-snapshot-${Date.now()}.json`
        })
      },
      onTimelineSlider: throttle((event, value) => {
        self.states.add('TimelineScrolled', value)
      }, 100),
      onZoomSlider: null, // TODO
      onStepType: (event, index, value) => {
        if (self.data_service.step_type != value)
          self.states.add('StepTypeChanged', value)
      },
      onPlayButton: playstop,
      onAutoplaySet: (state: boolean) => {
        if (state) {
          self.states.add('AutoplayOn')
        } else {
          self.states.drop('AutoplayOn')
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
        self.states.add('Connecting', data.url)
      },
      settings: this.settings
    }
    return data
  }

  renderUI() {
    log('Render UI')
    const first = !this.layout
    this.layout = renderLayout(this.container, this.layout_data)
    if (first) {
      this.initSnapshotUpload()
      this.initKeystrokes()
      // auto load the latest snapshot
      // TODO should be somewhere else
      if (
        !(this.states.is('FullSync') || this.states.is('Connecting')) &&
        this.settings.get().last_snapshot &&
        !this.server_url
      ) {
        setTimeout(() => {
          this.loadSnapshot(this.settings.get().last_snapshot)
        })
      }
    }
  }

  protected initKeystrokes() {
    for (let [key, fn] of Object.entries(keystrokes(this))) {
      bindKey(key, fn)
    }
  }

  protected initSnapshotUpload() {
    onFileUpload(
      document.getElementById('snapshot-upload'),
      { type: 'text' },
      (err, files) => {
        for (const file of files) {
          const snapshot = JSON.parse(file.target.result)
          this.settings.set('last_snapshot', snapshot)
          this.loadSnapshot(snapshot)
          break
        }
      }
    )
  }

  async loadSnapshot(snapshot: JSONSnapshot) {
    // TODO make it a state
    this.layout_data.is_snapshot = true
    this.states.drop('FullSync')
    this.states.add('FullSync', snapshot.full_sync)
    if (this.states.is('LayoutWorkerReady')) {
      // TODO maybe snapshot shouldnt be mutated?
      await this.addPatches(snapshot.patches)
    } else {
      this.worker_patches_pending.push(...snapshot.patches)
    }
  }

  async onDataServiceScrolled(update: ISync) {
    if (!isProd()) console.time('onDataServiceScrolled')
    this.updateTimelineStates()
    if (update.diff) {
      jsondiffpatch.patch(this.graph.data, update.diff)
    } else if (update.rev_diff) {
      jsondiffpatch.unpatch(this.graph.data, update.rev_diff)
    } else if (update.db_key) {
      this.graph.data = await db.get(update.db_key)
    }

    if (update.changed_ids && update.changed_ids.length) {
      await this.graph.updateCells(
        update.changed_ids,
        this.data_service.last_scroll_add_remove,
        update.layout_data
      )
    }
    if (!isProd()) console.timeEnd('onDataServiceScrolled')
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
  return new Inspector(
    container_selector,
    query.server,
    parseInt(query.debug, 10),
    query.debug_server
  )
}
