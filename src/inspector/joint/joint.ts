// import Graph from 'graphs'
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
import GraphLayout from './layout'
import adjustVertices from './vendor/adjust-vertices'
import Settings from '../settings'
import {Cell} from "jointjs";

type IDelta = jsondiffpatch.IDeltas

// simplify the link markup
// TODO move to shapes.ts
joint.shapes.fsa.Arrow = joint.shapes.fsa.Arrow.extend({
  markup: '<path class="connection"/><path class="marker-target"/><g class="labels" />'
})
const oldLinkClassName = joint.dia.LinkView.prototype.className
joint.dia.LinkView.prototype.className = function() {
  let class_names: string = oldLinkClassName.apply(this, arguments)
  const types = this.model.get('labels')['0'].attrs.text.text || 'pipe'
  class_names += ' '+types
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
        class_names += ' '+classname
      }
    }
  // MACHINES
  } else if (type == 'uml.State') {
    class_names += ' joint-group-'+model.id
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
export default class Ui extends UiBase<INetworkJson> {
  container: JQuery

  paper: joint.dia.Paper
  graph: joint.dia.Graph
  layout: GraphLayout

  available_colors: string[] = []
  group_colors = {}
  stylesheet: Stylesheet

  // TODO responsive to the screen size
  width = 5000
  height = 3500

  zoom_max = 1.5
  zoom_min = 0.5
  zoom_factor = 30
  drag_tick_ms = 10
  drag_start_pos: { x: number; y: number }

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
      positions: this.settings.get().positions
    })
  }

  reset() {
    this.graph.clear()
    this.initGraphLayout()
    // TODO reset stylesheet and color assignments
  }

  async render(el) {
    this.container = $(el)
    // this.container = $('<div/>')
    assert(this.container)

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

      this.bindMouseZoom()

      // adjust vertices when a cell is removed or its source/target
      // was changed
      this.graph.on(
        'add remove change:source change:target change:position change:size',
        _.partial(adjustVertices, this.graph)
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

  // TODO layout_data?
  async setData(
    data: INetworkJson,
    layout_data?,
    changed_cells: string[] = null
  ) {
    const first_run = !this.data

    this.data = data
    console.time('joint/setData')

    // TODO async
    // this.layout.setData(this.data, changed_cells)
    this.layout.syncFromLayout(layout_data, data, changed_cells)

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
      const settings_zoom = this.settings.get().zoom_level
      const scroll = this.settings.get().scroll
      if (!settings_zoom || !scroll) {
        this.fitContent()
      }
      if (settings_zoom) {
        this.paper.scale(settings_zoom, settings_zoom)
      }
      if (scroll) {
        this.scroll_element.scrollLeft = scroll.x
        this.scroll_element.scrollTop = scroll.y
      }
      this.postUpdateLayout(changed_cells)
    }

    console.timeEnd('joint/setData')
  }

  async updateCells(
    changed_ids: string[],
    was_add_remove: boolean = false,
    layout_data
  ) {
    console.time('updateCells')
    if (!was_add_remove) {
      this.patchCells(changed_ids)
    } else {
      await this.setData(this.data, layout_data, changed_ids)
    }
    this.postUpdateLayout(changed_ids)
    console.timeEnd('updateCells')
  }

  patchCells(cell_ids: Iterable<string>) {
    console.time('patchCells')
    for (let cell of this.getDataCellsByIds(cell_ids)) {
      let model = this.graph.getCell(cell.id)
      // TODO this can be undefined, ensure to apply all the diffs
      // in case of a cancelled rendering
      if (!model)
        continue
      for (let field of this.patch_fields) {
        if (!cell.hasOwnProperty(field)) continue
        model.set(field, cell[field], {silent: true})
      }
    }
    console.timeEnd('patchCells')
  }

  getDataCellsByIds(cell_ids: Iterable<string>): TCell[] {
    let ids = [...cell_ids]
    return this.data.cells.filter(cell => ids.includes(cell.id))
  }

  postUpdateLayout(changed_ids?: string[]) {
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

    if (changed_ids && changed_ids.length) {
      console.time('syncClasses')
      this.syncClasses(changed_ids)
      console.timeEnd('syncClasses')
    }

    console.time('assignColors')
    this.assignColors()
    console.timeEnd('assignColors')
  }

  parseColors() {
    // 37 colors, TODO find more
    this.available_colors = []
    for (let color of Object.keys(colors)) {
      if (color.slice(-3) != '100' || color.slice(-4) == 'A100') continue
      this.available_colors.push(color.slice(0, -3))
    }
  }

  getGroups() {
    return this.graph.attributes.cells.models.filter(
      node => node.attributes.type == 'uml.State'
    )
  }

  getColor(group): string {
    // TODO constant color per group (by ID)
    if (!this.available_colors.length) return null
    let index = [...group.id]
      .map(a => a.charCodeAt(0))
      .reduce((prev, curr) => (prev || 0) * curr)
    index = index % (this.available_colors.length - 1)
    let color = this.available_colors[index]
    // remove the color
    this.available_colors.splice(index, 1)
    return color
  }

  assignColors() {
    for (let group of this.getGroups()) {
      let id = group.get('id')
      if (this.group_colors[id]) continue
      let color = this.getColor(group)
      this.group_colors[id] = color
      this.applyColor(group, color)
    }
  }

  applyColor(group, color_name) {
    let fg = colors[color_name + '200']
    let bg = colors[color_name + '100']
    this.stylesheet.addRule(`.joint-group-${group.get('id')}`, `color: ${fg};`)
    this.stylesheet.addRule(`.joint-group-${group.get('id')} path`, `stroke: ${fg};`)
    this.stylesheet.addRule(
      `.joint-group-${group.get('id')} rect`,
      `stroke: ${fg}; fill: ${bg};`
    )
  }

  // TODO merge with joint.dia.ElementView.prototype.className
  syncClasses(changed_cells: string[]) {
    console.log(`syncing classes for ${(changed_cells||[]).length} elements`)
    for (const id of changed_cells) {
      const cell = this.graph.getCell(id)
      if (!cell) {
        // cell could have been deleted or the rendering was cancelled
        continue
      }
      switch(cell.get('type')) {
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

  syncLinkClasses(link: Cell) {
    const view = this.paper.findViewByModel(link)
    if (!view) return
    // handle link types
    let class_names = (link.get('labels')['0'].attrs.text.text || 'pipe'
    ).split(' ')
    let el = joint.V(view.el)
    for (let name of class_names) {
      el.addClass(name)
    }
    // handle the touched state
    el.toggleClass('joint-is-touched', Boolean(link.get('is_touched')))
  }

  syncMachineClasses(machine: Cell) {
    const view = this.paper.findViewByModel(machine)
    if (!view) return
    let el = joint.V(view.el)
    // handle the touched state
    el.toggleClass('joint-is-touched', Boolean(machine.get('is_touched')))
    el.addClass('joint-group-' + machine.id)
  }

  syncStateClasses(state: Cell) {
    const view = this.paper.findViewByModel(state)
    // state = state as joint.dia.Cell
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

  bindMouseZoom() {
    const drag_listener = throttle(
      e => this.dragScrollListener(e),
      this.drag_tick_ms
    )
    let drag_enabled = false
    this.paper.on('blank:pointerdown', () => {
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
    this.paper.on('cell:pointerup blank:pointerup', () => {
      this.drag_start_pos = null
      drag_enabled = false
      this.container.unbind('mousemove', drag_listener)
    })
    this.paper.$el.on('mousewheel DOMMouseScroll', e =>
      this.mouseZoomListener(e)
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
        this.paper.scale(scale * 0.9)
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
    if (new_scale > this.zoom_min && new_scale < this.zoom_max) {
      paper.scale(new_scale, new_scale)
      const dx =
        (new_scale - scale) / scale * (offset_x - paper.options.origin.x)
      const dy =
        (new_scale - scale) / scale * (offset_y - paper.options.origin.y)
      paper.setOrigin(paper.options.origin.x - dx, paper.options.origin.y - dy)
      this.settings.set('zoom_level', new_scale)
    }
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
  }
}
