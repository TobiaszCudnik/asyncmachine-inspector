// TODO rename to joint/graph.ts and joint/graph.css
import { INetworkJson, TState, TMachine, TLink, TCell } from './joint-network'
import { TransitionStepTypes } from 'asyncmachine'
import UiBase from '../graph'
import * as joint from 'jointjs'
import * as vectorizer from 'jointjs/dist/vectorizer'
import * as $ from 'jquery'
import { throttle } from 'underscore'
import * as _ from 'underscore'
import * as assert from 'assert/'
import * as jsondiffpatch from 'jsondiffpatch'
import * as colors from 'material-ui/styles/colors'
import * as Stylesheet from 'stylesheet.js'
import * as hexRGB from 'hex-rgb'
import GraphLayout from './graph-layout'
import adjustVertices from './vendor/adjust-vertices'
import Settings from '../settings'
import { colorIsDark, hexToRgb, isProd } from '../utils'
import { StepTypes } from './data-service'
import { orderBy } from 'lodash'
import * as moment from 'moment'
import * as radiansDegrees from 'radians-degrees'

type IDelta = jsondiffpatch.IDeltas

// simplify the link markup
// TODO move to shapes.ts
joint.shapes.fsa.Arrow = joint.shapes.fsa.Arrow.extend({
  markup:
    '<path class="connection"/><path class="marker-target"/><g class="labels" />'
})
const oldLinkClassName = joint.dia.LinkView.prototype.className
joint.dia.LinkView.prototype.className = function() {
  let class_names: string = oldLinkClassName.apply(this, arguments)
  const types = this.model.get('labels')['0'].attrs.text.text || 'pipe'
  class_names += ' ' + types
  if (this.model.get('is_touched')) {
    class_names += ' is-touched'
  }
  return class_names
}
const oldElementClassName = joint.dia.ElementView.prototype.className
joint.dia.ElementView.prototype.className = function() {
  let class_names: string = oldElementClassName.apply(this, arguments)
  const model = this.model
  const type = model.get('type')
  // STATES
  if (type == 'fsa.State') {
    // active state
    for (const type of ['set', 'multi', 'auto']) {
      if (model.get('is_' + type)) {
        class_names += ' is-' + type
      }
    }
    // touched state
    if (model.get('step_style')) {
      class_names += ' is-touched'
    }
    // step type classes
    for (let key of Object.keys(TransitionStepTypes)) {
      // skip labels
      if (typeof TransitionStepTypes[key] !== 'number') continue
      let classname = 'step-' + key.toLowerCase().replace('_', '-')
      if (model.get('step_style') & TransitionStepTypes[key]) {
        class_names += ' ' + classname
      }
    }
    // MACHINES
  } else if (type == 'uml.State') {
    class_names += ' joint-group-' + model.id
    if (model.get('is_touched')) {
      class_names += ' is-touched'
    }
  }
  return class_names
}
// joint.shapes.ami = {}
// joint.shapes.ami.Link = joint.shapes.fsa.Arrow.extend({
//   // initialize: function() {
//   //   joint.shapes.fsa.Arrow.prototype.initialize.apply(this, arguments)
//   //   debugger
//   // },
//   markup:
//     '<path class="connection"/><path class="marker-target"/><g class="labels" />',
//
//   render: function() {
//     this.$el.empty();
//
//     this.renderMarkup();
//     debugger
//     this.rotatableNode = this.vel.findOne('.rotatable');
//     var scalable = this.scalableNode = this.vel.findOne('.scalable');
//     if (scalable) {
//         // Double update is necessary for elements with the scalable group only
//         // Note the resize() triggers the other `update`.
//         this.update();
//     }
//     this.resize();
//     this.rotate();
//     this.translate();
//
//     return this;
//   },
//
//   className: function() {
//     debugger
//     joint.shapes.fsa.Arrow.prototype.className.apply(this, arguments)
//   }
// })

const log = (...args) => {}

/**
 * Fiddles:
 * http://jsfiddle.net/user/kumilingus/fiddles/3/
 * TODO consume a stream of events
 * TODO support an initialization without a reference to other instances
 * TODO
 * - machine colors in the msg
 * - save calculated layout positions, so when scrolling theres no delay
 * - calculate positions using the WebCole library
 * - show the number of steps
 * - use cell highlighters `cellView.highlight();`
 * - update jointjs to 1.0
 * - switch autolayout to ciena-blueplanet/dagre
 * - hightlight/strike through required dependencies of auto states
 * - mark which machines queue is currently executing
 *
 * TODO
 * - slim links
 * http://jsfiddle.net/kumilingus/fjzvqhhk/
 * - clone cells from existing cells
 * http://jsfiddle.net/kumilingus/fjzvqhhk/
 */
export default class JointGraph extends UiBase<INetworkJson> {
  container: JQuery
  minimap: HTMLCanvasElement

  paper: joint.dia.Paper
  graph: joint.dia.Graph
  layout: GraphLayout

  available_colors: string[] = []
  group_colors = {}
  stylesheet: Stylesheet

  // responsive to the screen size
  width = null
  height = null

  zoom_max = 1.5
  zoom_min = 0.1
  zoom_factor = 30
  drag_tick_ms = 10
  drag_start_pos: { x: number; y: number }

  has_focus: boolean
  private selected_id_: string | null = null
  get selected_id(): string | null {
    // TODO check if the ID is still valid
    if (!this.data.cells.find(c => c.id == this.selected_id_)) {
      this.selected_id_ = null
    }
    return this.selected_id_ || this.data.cells[1].id
  }
  set selected_id(val) {
    this.selected_id_ = val
  }

  state_highlighter = {
    name: 'stroke',
    options: {
      attrs: {
        'stroke-width': 3,
        stroke: 'red',
        d: 'M 68, 66 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
        transform: 'scale(0.75, .75)'
      }
    }
  }
  machine_highlighter = {
    name: 'stroke',
    options: {
      attrs: {
        'stroke-width': 3,
        // TODO overridden
        stroke: 'red'
      }
    }
  }
  cursor_highlighter = {
    name: 'stroke',
    options: {
      attrs: {
        stroke: 'greenyellow',
        'stroke-width': '5px',
        'stroke-dasharray': 1,
        d: 'M 68, 66 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
        transform: 'scale(0.75, .75)'
      }
    }
  }

  // TODO use in the data_service as non-ignored fields
  patch_fields = ['step_style', 'is_set', 'is_touched', 'name']

  get scroll_element(): Element {
    return this.container.parent().get(0)
  }

  constructor(public data: INetworkJson, public settings: Settings) {
    super(data)
    this.graph = new joint.dia.Graph()
    this.initGraphLayout()
    this.stylesheet = new Stylesheet()
    this.parseColors()
  }

  initGraphLayout() {
    this.layout = new GraphLayout(this.graph, {
      positions: this.settings.get().positions,
      dimensions: { x: this.width, y: this.height }
    })
  }

  reset() {
    this.data = null
    this.graph.clear()
    this.initGraphLayout()
    this.parseColors()
    this.group_colors = {}
    this.stylesheet.clear()
  }

  async render(el) {
    this.container = $(el)
    this.minimap = $('#minimap canvas').get(0)
    // this.minimap_zoom_window = $('#minimap .zoom-window')
    // this.container = $('<div/>')
    assert(this.container)

    // setup dimensions
    // TODO update on resize
    const client_width = this.scroll_element.clientWidth
    const client_height = this.scroll_element.clientHeight
    this.width = client_width * (client_width / (client_width * this.zoom_min))
    this.height =
      client_height * (client_height / (client_height * this.zoom_min))

    if (!this.paper) {
      this.paper = new joint.dia.Paper({
        // TODO set elementView and linkView using custom views
        el: this.container,
        // TODO make it work
        async: true,
        gridSize: 1,
        model: this.graph,
        width: this.width,
        height: this.height,
        // restrictTranslate: true,
        // TODO check these
        // defaultLink: new joint.dia.Link({
        // 	router: { name: 'manhattan', args: { step: 20 } },
        // 	connection: { name: 'orthogonal' },
        // 	attrs: {
        // 		'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#fff', stroke: '#000' },
        // 		'.link-tools .tool-remove circle, .marker-vertex': { r: 8 },
        // 		'.connection': {
        // 				stroke: '#000', 'stroke-width': 1
        // 		}
        // 	}
        // }),
        interactive: {
          vertexAdd: false
        }
      })

      this.container.css({
        width: client_width,
        height: client_height,
        'min-height': this.scroll_element.clientHeight,
        'min-width': this.scroll_element.clientWidth
      })

      this.paper.options.restrictTranslate = cell_view => {
        const area = cell_view.paper.getArea()
        area.width = this.width
        area.height = this.height
        return area
      }

      this.bindMouse()
      this.bindTouch()
      this.bindCursor()

      // adjust vertices when a cell is removed or its source/target
      // was changed
      // TODO throttle
      this.graph.on(
        'add remove change:source change:target change:position change:size',
        _.partial(adjustVertices, this.graph)
      )
      this.graph.on(
        'change:position change:size',
        _.throttle(() => {
          this.renderMinimap()
        }, 1000)
      )
      // also when an user stops interacting with an element.
      this.paper.on('cell:pointerup', _.partial(adjustVertices, this.graph))

      // memorize dragged position
      this.paper.on('cell:pointerup', cell => this.memorizePosition(cell))
    }

    if (this.data) {
      await this.setData(this.data)
    }
  }

  // TODO support ALT+arrow to jump between machines
  onArrowListener(arrow, event: KeyboardEvent) {
    if (!this.has_focus) return
    // console.time('distances')
    let distances = this.positionsFromElement(
      this.data.cells.find(n => n.id == this.selected_id)
    )
    distances = orderBy(distances, ['distance'], ['asc'])
    // console.timeEnd('distances')
    const angles = {
      ArrowRight: [[-45, 45]],
      ArrowDown: [[45, 135]],
      ArrowLeft: [[-180, -135], [135, 180]],
      ArrowUp: [[-135, -45]]
    }
    const ranges = angles[event.code]
    let found
    for (const pos of distances) {
      for (const range of ranges) {
        if (pos.angle < range[0] || pos.angle > range[1]) continue
        this.selectState(pos.id)
        found = true
        break
      }
      if (found) break
    }
  }

  positionsFromElement(
    source_node: TState
  ): { angle: number; distance: number; id: string }[] {
    if (!this.data) return []
    const ret = []
    const positions = this.settings.get().positions
    const source_model = this.graph.getCell(source_node.id)
    for (const node of this.data.cells) {
      if (node.id == source_node.id) continue
      if (node.type != 'fsa.State') continue
      const model = this.graph.getCell(node.id)
      const pos = [source_model.get('position'), model.get('position')]
      const angle = radiansDegrees(this.getAngle(pos[0], pos[1]))
      const distance = Math.sqrt(
        Math.pow(pos[1].x - pos[0].x, 2) + Math.pow(pos[1].y - pos[0].y, 2)
      )
      ret.push({ angle, distance, id: node.id })
    }
    return ret
  }

  getAngle(element, target) {
    let angle = Math.atan2(target.y - element.y, target.x - element.x)

    // if(angle < 0){
    //     angle += 360;
    // }

    return angle
  }

  zoom(level: number, offset_x?: number, offset_y?: number) {
    // @ts-ignore
    const current_level = this.paper.scale().sx
    log(`zooming to level ${level}`)
    this.paper.scale(level, level)
    const offset_x_ratio = offset_x ? offset_x / this.container.width() : 0.5
    const offset_y_ratio = offset_y ? offset_y / this.container.height() : 0.5
    this.container.width(this.width * level)
    this.container.height(this.height * level)
    const el = this.scroll_element
    if (level > current_level) {
      // ZOOM IN
      // X
      const diff_x = this.width * level - this.width * current_level
      el.scrollLeft += diff_x * offset_x_ratio
      // Y
      const diff_y = this.height * level - this.height * current_level
      el.scrollTop += diff_y * offset_y_ratio
    } else if (level < current_level) {
      // ZOOM OUT
      // X
      const diff_x = this.width * current_level - this.width * level
      el.scrollLeft -= diff_x * offset_x_ratio
      // Y
      const diff_y = this.height * current_level - this.height * level
      el.scrollTop -= diff_y * offset_y_ratio
    }
    this.settings.set('zoom_level', level)
    this.settings.set('scroll', { x: el.scrollLeft, y: el.scrollTop })
    this.renderMinimap()
  }

  // TODO layout_data?
  async setData(
    data: INetworkJson,
    layout_data?,
    changed_cells: string[] = null,
    step_type: StepTypes = StepTypes.STATES
  ) {
    const first_run = !this.data

    this.data = data
    if (!isProd()) console.time('joint/setData')

    // TODO async
    // this.layout.setData(this.data, changed_cells)
    this.layout.syncFromLayout(layout_data, data, changed_cells)

    if (first_run) {
      const settings_zoom = this.settings.get().zoom_level
      const { x, y } = this.settings.get().scroll || { x: 0, y: 0 }
      if (!settings_zoom || !scroll) {
        this.fitContent()
      }
      if (settings_zoom && this.paper) {
        this.zoom(settings_zoom)
      }
      if (x || y) {
        this.scroll_element.scrollLeft = x
        this.scroll_element.scrollTop = y
      }
      this.settings.set('scroll', { x, y })
      this.renderMinimap()
    }

    // TODO wait for a full render when playing, so certain frames are fully
    // painted and cancel in other cases (like scrolling)
    // if (!first_run)
    //   this.paper.cancelRenderViews()
    if (this.paper._frameId) {
      // TODO use a lib
      await new Promise(resolve =>
        this.paper.once('render:done', () => {
          // TODO mutex on setdata till here
          resolve()
        })
      )
    }

    if (first_run) {
      for (const cell of this.graph.getCells()) {
        adjustVertices(this.graph, cell)
      }
      this.postUpdateLayout(changed_cells, step_type)
    }
    this.renderMinimap()

    if (!isProd()) console.timeEnd('joint/setData')
  }

  async updateCells(
    changed_ids: string[],
    was_add_remove: boolean = false,
    layout_data,
    step_type: StepTypes = StepTypes.STATES
  ) {
    this.renderMinimap()
    if (!isProd()) console.time('updateCells')
    const ui_changed_ids = this.patchCells(changed_ids)
    if (was_add_remove) {
      await this.setData(this.data, layout_data, changed_ids)
    }
    this.postUpdateLayout(ui_changed_ids, step_type)
    if (!isProd()) console.timeEnd('updateCells')
  }

  patchCells(cell_ids: string[]) {
    if (!isProd()) console.time('patchCells')
    const ui_changed_ids = new Set<string>()
    for (let cell of this.getDataCellsByIds(cell_ids)) {
      let model = this.graph.getCell(cell.id)
      // TODO this can be undefined, ensure to apply all the diffs
      // in case of a cancelled rendering
      if (!model) continue
      for (let field of this.patch_fields) {
        if (!cell.hasOwnProperty(field)) continue
        if (model.get(field) == cell[field]) continue
        ui_changed_ids.add(cell.id)
        model.set(field, cell[field], { silent: true })
      }
    }
    if (!isProd()) console.timeEnd('patchCells')
    return [...ui_changed_ids]
  }

  getDataCellsByIds(cell_ids: string[]): TCell[] {
    return this.data.cells.filter(cell => cell_ids.includes(cell.id))
  }

  postUpdateLayout(
    changed_ids?: string[],
    step_type: StepTypes = StepTypes.STATES
  ) {
    // lay out the graph
    // joint.layout.DirectedGraph.layout(this.graph, {
    // 	// TODO check verticles from dagre
    // 	// setLinkVertices: true,
    // 	// setVertices: (link, points) => {
    // 	// 	points[0] = link.findView(this.paper).sourcePoint
    // 	// 	points[points.length-1] = link.findView(this.paper).targetPoint
    // 	// 	link.set('vertices', points);
    // 	// },
    // 	rankDir: 'TB',
    // 	marginX: 50,
    // 	marginY: 50,
    // 	clusterPadding: {
    // 		top: 40, left: 20, right: 20, bottom: 20 }
    // 	// TODO check resizeClusters: true
    // })

    // syncClasses
    if (changed_ids && changed_ids.length) {
      // highlights
      if (step_type == StepTypes.STATES || step_type == StepTypes.LIVE) {
        this.highlight(changed_ids, false)
      }
      if (!isProd()) console.time('syncClasses')
      this.syncClasses(changed_ids)
      if (!isProd()) console.timeEnd('syncClasses')
    }

    // assignColors
    if (!isProd()) console.time('assignColors')
    this.assignColors()
    this.renderMinimap()
    if (!isProd()) console.timeEnd('assignColors')
  }

  parseColors() {
    this.available_colors = []
    for (let [name, hex] of Object.entries(colors)) {
      // A100 to A700
      // http://www.material-ui.com/#/customization/colors
      if (hex[0] != '#') continue
      if (name.includes('grey') || name.includes('brown')) continue
      const rgb = hexToRgb(hex)
      if (!colorIsDark(rgb.r, rgb.g, rgb.b)) continue
      this.available_colors.push(hex as string)
    }
    log(`${this.available_colors.length} colors available`)
  }

  getGroups() {
    return this.graph.attributes.cells.models.filter(
      node => node.attributes.type == 'uml.State'
    )
  }

  getColor(input: string): { fg: string; bg: string } {
    // TODO constant color per group (by ID)
    if (!this.available_colors.length) return null
    let index = [...input]
      .map(a => a.charCodeAt(0))
      .reduce((prev, curr) => (prev || 0) * curr + curr)
    index = index % (this.available_colors.length - 1)
    return {
      fg: this.available_colors[index],
      bg: this.available_colors[index + 1]
        ? this.available_colors[index + 1]
        : this.available_colors[0]
    }
  }

  assignColors() {
    for (let group of this.getGroups()) {
      let id = group.get('id')
      if (this.group_colors[id]) continue
      const color = this.getColor(group.id)
      this.group_colors[id] = color
      this.applyColor(group, color)
    }
  }

  applyColor(group, colors: { fg: string; bg: string }) {
    let { fg, bg } = colors
    this.stylesheet.addRule(`.joint-group-${group.get('id')}`, `color: ${fg};`)
    this.stylesheet.addRule(
      `.joint-group-${group.get('id')} path`,
      `stroke: ${fg};`
    )
    this.stylesheet.addRule(
      `.joint-group-${group.get('id')} rect`,
      // TODO test
      // `stroke: ${fg}; fill: ${bg};`
      `stroke: ${fg};`
    )
  }

  // TODO merge with joint.dia.ElementView.prototype.className
  syncClasses(changed_cells: string[]) {
    log(`syncing classes for ${(changed_cells || []).length} elements`)
    for (const id of changed_cells) {
      const cell = this.graph.getCell(id)
      if (!cell) {
        // cell could have been deleted or the rendering was cancelled
        continue
      }
      switch (cell.get('type')) {
        case 'fsa.Arrow':
          this.syncLinkClasses(cell)
          break
        case 'uml.State':
          this.syncMachineClasses(cell)
          break
        case 'fsa.State':
          this.syncStateClasses(cell)
          break
      }
    }
  }

  syncLinkClasses(link: joint.dia.Cell) {
    const view = this.paper.findViewByModel(link)
    if (!view) return
    // handle link types
    let class_names = (link.get('labels')['0'].attrs.text.text || 'pipe').split(
      ' '
    )
    let el = joint.V(view.el)
    for (let name of class_names) {
      el.addClass(name)
    }
    // handle the touched state
    el.toggleClass('joint-is-touched', Boolean(link.get('is_touched')))
  }

  syncMachineClasses(machine: joint.dia.Cell) {
    const view = this.paper.findViewByModel(machine)
    if (!view) return
    let el = joint.V(view.el)
    // handle the touched state
    el.toggleClass('joint-is-touched', Boolean(machine.get('is_touched')))
    el.addClass('joint-group-' + machine.id)
  }

  syncStateClasses(state: joint.dia.Cell) {
    const view = this.paper.findViewByModel(state)
    if (!view) return
    const el = joint.V(view.el)
    // active state
    for (const type of ['set', 'multi', 'auto']) {
      el.toggleClass('joint-is-' + type, Boolean(state.get('is_' + type)))
    }
    // touched state
    el.toggleClass('joint-is-touched', Boolean(state.get('step_style')))
    // step type classes
    for (let key of Object.keys(TransitionStepTypes)) {
      // skip labels
      if (typeof TransitionStepTypes[key] !== 'number') continue
      let classname = 'joint-step-' + key.toLowerCase().replace('_', '-')
      el.toggleClass(
        classname,
        Boolean(state.get('step_style') & TransitionStepTypes[key])
      )
    }
  }

  bindMouse() {
    const drag_listener = throttle(
      e => this.dragScrollListener(e),
      this.drag_tick_ms
    )
    let drag_enabled = false
    this.paper.on('blank:pointerdown', ev => {
      drag_enabled = true
      this.container.mousemove(drag_listener)
    })
    this.container.on('mousedown', (event, x, y) => {
      if (!drag_enabled) return
      const el = this.scroll_element
      this.drag_start_pos = {
        x: event.clientX + el.scrollLeft,
        y: event.clientY + el.scrollTop
      }
    })
    // this.paper.on('blank:pointermove', e => {
    //   log('pointermove')
    //   this.scroll_element.scrollLeft += this.scroll_element.scrollLeft*
    // })
    this.paper.on('cell:pointerup blank:pointerup', ev => {
      this.drag_start_pos = null
      drag_enabled = false
      this.container.unbind('mousemove', drag_listener)
    })
    this.paper.$el.on('mousewheel DOMMouseScroll', e =>
      this.mouseZoomListener(e)
    )
    // this.paper.on('gesturechange', e => {
    //   log('gesturechange', e.changedTouches)
    //   this.touchZoomListener(e)
    // })
    // this.container.on('gesturechange', e => {
    //   log('e.changedTouches', e.changedTouches)
    //   log('e', e)
    //   log('e.scale', e.scale)
    //   if (e.scale < 1.0) {
    //     this.zoom(this.paper.scale().sx * 1.3)
    //   } else if (e.scale > 1.0) {
    //     this.zoom(this.paper.scale().sx * 0.7)
    //   }
    // })
    // this.container.on('gesturechange', () => log('gesturechange'))
    // this.container.on('gesturestart', () => log('gesturestart'))
  }

  bindTouch() {
    // minimap pinch zoom
    this.bindTouchMinimapZoom(this.minimap.parentElement)
    this.bindMinimapTouchDrag(this.minimap.parentElement)
    // TODO check
    this.bindTouchDrag(this.paper.$el.get(0).parentElement)
    this.bindTouchMinimapZoom(this.paper.$el.get(0).parentElement)
  }

  /**
   * TODO
   * - reverse move, reuse the drag listener
   * - disable when dragging a machine
   * - make it work with pinch zoom
   * @param {HTMLElement} element
   */
  bindTouchDrag(element: HTMLElement) {
    // minimap pinch zoom
    const el = element
    el.addEventListener('gesturestart', e => {
      event.preventDefault(), false
      log('gesturestart')
    })

    el.addEventListener(
      'touchmove',
      e => {
        // TODO check for one finder only and the lack of an active gesture
        event.preventDefault()
        log({ x: e.layerX, y: e.layerY })
        // log(
        //   'this.scroll_element.scrollLeft / this.scroll_element.scrollTop',
        //   [this.scroll_element.scrollLeft, this.scroll_element.scrollTop]
        // )
        if (!(e.layerX > 5 || e.layerX < 5) || !(e.layerY > 5 || e.layerY < 5))
          return
        if (!this.drag_start_pos) return
        // log(e.target)
        const minimap_layer_x = parseInt(e.srcElement.style.left, 10) + e.layerX
        const diff = {
          x: -(this.drag_start_pos.x - e.layerX),
          y: -(this.drag_start_pos.y - e.layerY)
        }
        log('diff', diff)
        let scroll_left = e.layerX / el.clientWidth * this.container.width()
        let scroll_top = e.layerY / el.clientHeight * this.container.height()

        log('scroll', { scroll_left, scroll_top })
        const zoom_window = this.getZoomWindowCss()
        scroll_left -=
          zoom_window.width / 2 * (this.container.width() / this.minimap.width)
        scroll_top -=
          zoom_window.height /
          2 *
          (this.container.height() / this.minimap.height)
        // log('render')
        this.scroll_element.scrollLeft = scroll_left
        this.scroll_element.scrollTop = scroll_top
        this.renderMinimap()
      },
      false
    )

    el.addEventListener(
      'touchstart',
      e => {
        log(e.currentTarget)
        if (e.currentTarget != el) return
        if (this.drag_start_pos) return
        this.drag_start_pos = { x: e.layerX, y: e.layerY }
        event.preventDefault()
        log('touchstart', this.drag_start_pos)
      },
      false
    )
  }

  bindTouchMinimapZoom(element: HTMLElement) {
    // minimap pinch zoom
    const el = element
    el.addEventListener('gesturestart', e => {
      event.preventDefault(), false
      log('gesturestart')
    })

    const zoom = throttle(this.zoom.bind(this), 10, {
      trailing: true,
      leading: true
    })
    const pinchZoom = e => {
      // TODO support easing after 3 scrolls which decreasis the sensitivity
      // and effectively stop zooming
      // TODO use e.clientX relative to the viewport as offset_x & y
      if (e.scale > 1.2) {
        zoom(Math.min(this.paper.scale().sx * 1.05, this.zoom_max))
      } else if (e.scale < 0.8) {
        zoom(Math.max(this.paper.scale().sx * 0.95, this.zoom_min))
      }
      log('e.scale', e.scale)
    }

    el.addEventListener(
      'gesturechange',
      e => {
        // log('gesturechange')
        pinchZoom(e)
      },
      false
    )

    el.removeEventListener('gesturechange', pinchZoom)
  }

  bindMinimapTouchDrag(element: HTMLElement) {
    // minimap pinch zoom
    const el = this.minimap.parentNode
    el.addEventListener('gesturestart', e => {
      event.preventDefault(), false
      log('gesturestart')
    })

    el.addEventListener(
      'touchmove',
      e => {
        // TODO check for one finder only and the lack of an active gesture
        event.preventDefault()
        log({ x: e.layerX, y: e.layerY })
        // log(
        //   'this.scroll_element.scrollLeft / this.scroll_element.scrollTop',
        //   [this.scroll_element.scrollLeft, this.scroll_element.scrollTop]
        // )
        if (!(e.layerX > 5 || e.layerX < 5) || !(e.layerY > 5 || e.layerY < 5))
          return
        if (!this.drag_start_pos) return
        // log(e.target)
        const minimap_layer_x = parseInt(e.srcElement.style.left, 10) + e.layerX
        const diff = {
          x: -(this.drag_start_pos.x - e.layerX),
          y: -(this.drag_start_pos.y - e.layerY)
        }
        log('diff', diff)
        let scroll_left = e.layerX / el.clientWidth * this.container.width()
        let scroll_top = e.layerY / el.clientHeight * this.container.height()

        log('scroll', { scroll_left, scroll_top })
        const zoom_window = this.getZoomWindowCss()
        scroll_left -=
          zoom_window.width / 2 * (this.container.width() / this.minimap.width)
        scroll_top -=
          zoom_window.height /
          2 *
          (this.container.height() / this.minimap.height)
        // log('render')
        this.scroll_element.scrollLeft = scroll_left
        this.scroll_element.scrollTop = scroll_top
        this.renderMinimap()
      },
      false
    )

    el.addEventListener(
      'touchstart',
      e => {
        log(e.currentTarget)
        if (e.currentTarget != el) return
        if (this.drag_start_pos) return
        this.drag_start_pos = { x: e.layerX, y: e.layerY }
        event.preventDefault()
        log('touchstart', this.drag_start_pos)
      },
      false
    )
  }

  dragScrollListener(e) {
    // assert(this.drag_start_pos)
    if (!this.drag_start_pos) return
    const el = this.scroll_element
    el.scrollLeft += this.drag_start_pos.x - e.offsetX
    // TODO this should be automatically relative
    let toolbar_el = document.querySelector('.toolbar')
    el.scrollTop += this.drag_start_pos.y - e.offsetY - toolbar_el.clientHeight
    this.settings.set('scroll', { x: el.scrollLeft, y: el.scrollTop })
    log(
      `this.settings.set('scroll', { x: ${el.scrollLeft}, y: ${el.scrollTop} })`
    )
    this.renderMinimap()
  }

  // TODO support scaling up
  fitContent() {
    const margin = 20
    const footer_height = 40
    while (true) {
      let box = vectorizer(this.paper.viewport).bbox(true, this.paper.svg)
      let scale = vectorizer(this.paper.viewport).scale().sx
      const el = this.scroll_element
      if (
        scale > this.zoom_min &&
        (box.width * scale > el.clientWidth - margin * 2 ||
          box.height * scale > el.clientHeight - margin * 2 - footer_height)
      ) {
        this.zoom(scale * 0.9)
        continue
      }
      el.scrollLeft = box.x * scale - margin
      el.scrollTop = box.y * scale - margin
      break
    }
  }

  mouseZoomListener(e) {
    e.preventDefault()
    const ev: MouseWheelEvent = e.originalEvent as MouseWheelEvent
    const delta =
      Math.max(-1, Math.min(1, ev.wheelDelta || -ev.detail)) / this.zoom_factor
    const offset_x = e.offsetX
    const offset_y = e.offsetY
    const scale = vectorizer(this.paper.viewport).scale().sx
    const paper = this.paper
    const new_scale = scale + delta
    const accepted = Math.min(this.zoom_max, Math.max(this.zoom_min, new_scale))
    this.zoom(accepted, e.offsetX, e.offsetY)
  }

  // TODO support forgetting
  // TODO support state cells
  memorizePosition(cell) {
    cell = cell.model || cell
    if (!(cell instanceof joint.shapes.uml.State)) return
    cell.set('fixed-position', true)
    let positions = this.settings.get().positions
    positions[cell.id] = cell.get('position')
    this.settings.set('positions', positions)
    this.renderMinimap()
  }

  highlighted_ids: { [id: string]: number } = {}
  manual_highlight_id: string | null = null

  highlight(
    ids: string[],
    permanent: number | boolean = true,
    skip_index = false,
    highlighter?
  ) {
    const views = ids
      .map(id => this.graph.getCell(id))
      .filter(cell => cell)
      .map(cell => this.paper.findViewByModel(cell))
    const time = moment().unix()
    for (const cell of views) {
      cell.highlight(null /* defaults to cellView.el */, {
        highlighter: highlighter || this.getHighlighter(cell.model.get('type'))
      })
      if (!skip_index) {
        this.highlighted_ids[cell.model.id] = time
      }
    }
    if (permanent === true) {
      return () => this.unhighlight(ids)
    }
    setTimeout(() => {
      this.unhighlight(ids, skip_index ? false : time)
    }, (permanent === false ? null : permanent) || 1000)
    this.renderMinimap()
  }

  unhighlight(ids: string[], time?: number | boolean, highlighter?) {
    const views = ids
      .map(id => this.graph.getCell(id))
      .filter(cell => cell)
      .map(cell => this.paper.findViewByModel(cell))
    for (const cell of views) {
      const id = cell.model.get('id')
      if (time && time !== true && this.highlighted_ids[id] != time) continue
      if (!time && this.highlighted_ids[id]) continue
      if (!time && this.manual_highlight_id == id)
        this.manual_highlight_id = null
      cell.unhighlight(null, {
        highlighter: highlighter || this.getHighlighter(cell.model.get('type'))
      })
      if (time) {
        delete this.highlighted_ids[id]
      }
    }
    this.renderMinimap()
  }

  // support scaling up to show the whole cell
  // dont scroll if already in the view
  scrollTo(id) {
    const model = this.graph.getCell(id)
    const view = this.paper.findViewByModel(model)
    const box = view.getBBox()
    const viewport = {
      width: this.container.width(),
      height: this.container.height(),
      left: this.scroll_element.scrollLeft,
      top: this.scroll_element.scrollTop
    }
    view.$el.get(0).scrollIntoView()
    const center = {
      x: this.scroll_element.clientWidth / 2,
      y: this.scroll_element.clientHeight / 2
    }
    const scroll_to = {
      x: Math.max(0, box.x - center.x + box.width / 2),
      y: Math.max(0, box.y - center.y + box.height / 2)
    }
    // TODO smooth scroll
    this.scroll_element.scrollLeft = scroll_to.x
    this.scroll_element.scrollTop = scroll_to.y

    this.settings.set('scroll', { x: scroll_to.x, y: scroll_to.y })
    this.renderMinimap()
    // console.log('viewport', viewport)
    // console.log('box', box)
  }

  protected getHighlighter(type) {
    return type == 'fsa.State'
      ? this.state_highlighter
      : this.machine_highlighter
  }

  // TODO caching, based on is_dirty states?
  renderMinimap() {
    if (!this.data) return
    const positions = this.settings.get().positions
    // console.time('renderMinimap')
    const machines = this.data.cells.filter(c => c.type == 'uml.State')

    // CALCULATE SIZES
    const minimap = this.minimap.parentElement
    this.minimap.width = $(minimap).width()
    this.minimap.height = $(minimap).width() * (this.height / this.width)
    $(minimap).height($(minimap).width() * (this.height / this.width))
    const clusters = this.layout.clusters
    const x_ratio = this.minimap.clientWidth / this.width
    const y_ratio = this.minimap.clientHeight / this.height
    const scale = this.paper.scale().sx
    const is_during_transition = $('#graph.during-transition').length
    const canvas = this.minimap.getContext('2d')
    const highlighted_ids = [
      this.manual_highlight_id,
      ...Object.keys(this.highlighted_ids)
    ]

    // CLEAR
    canvas.clearRect(0, 0, this.minimap.width, this.minimap.height)
    canvas.stroke()

    // ZOOM WINDOW
    const window_css = this.getZoomWindowCss()
    // this.minimap_zoom_window.css(window_css)
    // log('rect-positions-window', {
    //   x: window_css.left,
    //   y: window_css.top
    // })

    // LINKS
    for (const [id, machine] of Object.entries(clusters._nodes)) {
      const m = machines.find(m => m.id == id)
      if (!m) continue
      // if (!clusters._edgeLabels[id]) continue
      for (const [name, data] of Object.entries(clusters._edgeLabels)) {
        if (!name.match(new RegExp(`^${id}|${id}$`))) continue
        for (const link of data.cells.values()) {
          if (link.slice(0, id.length + 1) != id + ':') continue
          // log('DRAW', link)
          let [source_ids, target_ids] = link.split('::')
          let [source_parent_id, source_id] = source_ids.split(':')
          let [target_parent_id, target_id] = target_ids.split(':')
          const data = this.data.cells.find(i => i.id == link)
          if (!data || (is_during_transition && !data.is_touched)) {
            continue
          }
          // source_parent_id + target_parent_id
          // source
          const source = clusters._nodes[source_parent_id]
          let pos = positions[source_parent_id] || {}
          let width = source.width * x_ratio
          let height = source.height * y_ratio
          let x = (pos.x || source.x) * x_ratio
          let y = (pos.y || source.y) * y_ratio
          const start = { x: x + width / 2, y: y + height / 2 }
          // target
          const target = clusters._nodes[target_parent_id]
          pos = positions[target_parent_id] || {}
          width = target.width * x_ratio
          height = target.height * y_ratio
          x = (pos.x || target.x) * x_ratio
          y = (pos.y || target.y) * y_ratio
          const end = { x: x + width / 2, y: y + height / 2 }
          canvas.beginPath()
          canvas.moveTo(start.x, start.y)
          canvas.lineTo(end.x, end.y)
          canvas.strokeStyle = '#1976d2'
          canvas.stroke()
        }
      }
    }

    // RECTANGLES
    for (const [id, machine] of Object.entries(clusters._nodes)) {
      const m = machines.find(m => m.id == id)
      if (!m) continue
      // let $el = this.minimap.find(`#minimap-${machine.id}`)
      // if (!$el.length) {
      //   $el = this.minimap.append(`<div id="minimap-${machine.id}" />`)
      // }
      const pos = positions[id] || {}
      const width = machine.width * x_ratio
      const height = machine.height * y_ratio
      //  machine.width * (this.width)
      const color = hexRGB(
        this.group_colors[id] ? this.group_colors[id].fg : '#FFFFFF'
      )
      canvas.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, 1)`
      if (!m.is_touched && is_during_transition) {
        continue
        // canvas.fillStyle = `rgba(${color.red}, ${color.green}, ${
        //   color.blue
        // }, 0.5)`
      }
      // log('rect-positions', {
      //   x: (pos.x || machine.x) * x_ratio,
      //   y: (pos.y || machine.y) * y_ratio
      // })
      canvas.fillRect(
        (pos.x || machine.x) * x_ratio,
        (pos.y || machine.y) * y_ratio,
        width,
        height
      )
      canvas.stroke()
    }

    // ZOOM WINDOW
    // log('rect-positions-window', window_css)
    canvas.fillStyle = `rgba(255, 255, 255, 0.2)`
    canvas.fillRect(
      window_css.left,
      window_css.top,
      window_css.width,
      window_css.height
    )
    canvas.stroke()

    // HIGHLIGHTS
    console.log('manual_highlight_id', this.manual_highlight_id)
    for (const id of highlighted_ids) {
      if (!id) continue
      const model = this.paper.getModelById(id)
      console.log(model)
      if (!model) continue
      const pos = positions[id] || {}
      const width = model.get('size').width * x_ratio
      const height = model.get('size').height * y_ratio
      // console.log(model.get('position'), width, height)
      canvas.fillStyle = `red`
      canvas.fillRect(
        (pos.x || model.get('position').x) * x_ratio - 5,
        (pos.y || model.get('position').y) * y_ratio - 5,
        Math.max(10, width),
        Math.max(10, height)
      )
      canvas.stroke()
    }
    // console.timeEnd('renderMinimap')
  }

  private getZoomWindowCss() {
    return {
      width:
        this.minimap.clientWidth *
        (this.scroll_element.clientWidth / this.container.width()),
      height:
        this.minimap.clientHeight *
        (this.scroll_element.clientHeight / this.container.height()),
      left:
        this.scroll_element.scrollLeft /
        this.container.width() *
        this.minimap.clientWidth,
      top:
        this.scroll_element.scrollTop /
        this.container.height() *
        this.minimap.clientHeight
    }
  }

  getMachines() {
    // TODO cache
    if (!this.data) return
    const machines = {}
    let last_id
    for (const cell of this.data.cells) {
      if (cell.type == 'fsa.State') {
        const state = cell.id.split(':')[1]
        machines[last_id].push({
          id: cell.id,
          name: state,
          is_set: cell.is_set,
          is_touched: cell.step_style,
          clock: cell.clock,
          is_selected: this.highlighted_ids[cell.id]
        })
      }
      if (cell.type != 'uml.State') continue
      machines[cell.id] = []
      last_id = cell.id
    }
    for (const [id, states] of Object.entries(machines)) {
      machines[id] = orderBy(
        states,
        state => {
          return (
            (state.is_selected ? 0 : 1).toString() +
            (state.is_set ? 0 : 1).toString() +
            (state.is_touched ? 0 : 1).toString() +
            state.name
          )
        },
        ['asc']
      )
    }
    return machines
  }

  selectState(id: string) {
    this.unhighlight([this.selected_id], true, this.cursor_highlighter)
    this.highlight([id], true, true, this.cursor_highlighter)
    this.selected_id = id
    this.scrollTo(id)
  }

  protected bindCursor() {
    this.container.on('focus', e => {
      if (!this.data) return
      // TODO first fsm.state
      this.selectState(this.selected_id)
      this.container.addClass('focued')
      this.has_focus = true
    })
    this.container.on('blur', e => {
      if (!this.data) return
      // TODO first fsm.state
      this.unhighlight([this.selected_id], true, this.cursor_highlighter)
      this.container.removeClass('focsued')
      this.has_focus = true
    })
  }
}
