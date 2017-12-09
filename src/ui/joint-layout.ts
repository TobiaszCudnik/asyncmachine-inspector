/// <reference path="../../typings/modules/jointjs/index.d.ts" />

// import { layout } from 'ciena-dagre/dist/dagre'
import { layout } from 'ciena-dagre'
import * as jsondiffpatch from 'jsondiffpatch'
import { IDelta } from 'jsondiffpatch'
import { Graph } from 'graphlib'
import * as joint from 'jointjs'
import * as md5 from 'md5'
import * as deepcopy from 'deepcopy'
import { INetworkJson, TCell, TState, TLink, TMachine } from './joint-network'

// TODO types from dagre
type TNode = {
  width: number
  height: number
  x: number
  y: number
}

type TEdge = {
  minLen: number
  width: number
  height: number
  points: number[][]
}

type TClusterEdge = {
  cells: Set<string>
  minLen: number
  width: number
  height: number
  points: number[][]
}

type TGraphData = {
  width: number
  height: number
  hash: string
  is_dirty?: boolean
}

type TClusterData = {
  width: number
  height: number
  is_dirty?: boolean
}

// TODO update the definitions
type TDagreGraph = Graph<TNode, TEdge, TGraphData>
type TClusterGraph = Graph<TNode, TClusterEdge, TClusterData>

function cloneGraph<T, L, GL>(graph: Graph<T, L, GL>): Graph<T, L, GL> {
  return deepcopy(graph, function(target) {
    if (target.constructor === Graph) return new Graph()
  })
}

// const log = console.log.bind(console)
const log = (...args) => {}

export default class GraphLayout {
  source_graph: joint.dia.Graph
  options: {
    syncLinks: boolean
  }

  clusters: TClusterGraph
  subgraphs: Map<string, TDagreGraph>

  data: INetworkJson

  /**
     * TODO GC after a supported limit
     */
  layouts_by_hash = new Map<string, IDelta>()
  differ: jsondiffpatch.IDiffPatch

  constructor(source_graph: joint.dia.Graph, options = { syncLinks: false }) {
    this.source_graph = source_graph
    this.options = options
    this.subgraphs = new Map<string, TDagreGraph>()
    this.clusters = new Graph({
      directed: false
    }) as TClusterGraph
    // TODO memorize the last position through DnD
    this.clusters.setGraph({
      width: 0,
      height: 0,
      is_dirty: true,
      marginx: 500,
      // TODO remove once overlapping in dagre gets fixed
      ranksep: 200
    })
    this.differ = jsondiffpatch.create({
      objectHash: (obj: TCell) => obj.id
    })
  }

  setData(data: INetworkJson, changed_cells: Iterable<string> = null) {
    let start = Date.now()
    this.syncData(data, changed_cells)
    log(`Sync data ${Date.now() - start}ms`)
    if (!this.layout()) return
    start = Date.now()
    this.syncSourceGraph(data, changed_cells)
    log(`Update the source graph ${Date.now() - start}ms`)
  }

  /**
   * Returns the number of changed graphs.
   */
  layout(): number {
    let start = Date.now()
    let cloned = 0
    let dirty = 0
    // layout the subgraphs (states)
    for (let [id, graph] of this.subgraphs.entries()) {
      let graph_data = graph.graph()
      if (!graph_data.is_dirty) continue
      dirty++
      let diff = this.layouts_by_hash.get(graph_data.hash)
      if (diff) {
        jsondiffpatch.patch(graph, diff)
        cloned++
      } else {
        let layout_data = this.graphToLayoutData(graph)
        let pre_layout = deepcopy(layout_data)
        layout(graph)
        graph_data.is_dirty = false
        let diff = this.differ.diff(pre_layout, layout_data)
        this.layouts_by_hash.set(graph_data.hash, diff)
      }
    }
    log(
      `Layout ${this.subgraphs
        .size} subgraphs (${dirty} dirty, ${cloned} cloned) ${Date.now() -
        start}ms`
    )
    // layout the clusters (machines)
    if (this.clusters.graph().is_dirty && this.clusters.nodes()) {
      // TODO support the hash based cache
      dirty++
      start = Date.now()
      // TODO sync only changed graphs
      this.syncClusterSizes()
      layout(this.clusters)
      this.clusters.graph().is_dirty = false
      log(`Layout the cluster graph ${Date.now() - start}ms`)
    }
    return dirty
  }

  graphToLayoutData(graph: Graph<any, any, any>): Object {
    return {
      _nodes: graph._nodes,
      _edgeLabels: graph._edgeLabels,
      _label: graph._label
    }
  }

  /**
     * Exports the whole layout data from all the graphs.
     * 
     * '_clusters' is a predefined key, everything else is an ID of a subgraph.
     */
  exportLayoutData(): Object {
    let ret = {}
    for (let [name, graph] of this.subgraphs.entries()) {
      // TODO use a symbol?
      ret[name || ' '] = this.graphToLayoutData(graph)
    }
    ret._clusters = this.graphToLayoutData(this.clusters)
    return ret
  }

  importLayoutData(data: Object) {
    for (let [key, graph] of Object.entries(data)) {
      if (key == '_clusters') {
        this.clusters = graph
      } else {
        this.subgraphs.set(key, graph)
      }
    }
    // TODO GC old entries from @subgraphs
  }

  /**
     * Sync the source graph with a layout data comming from another worker.
     *
     * TODO: rename to import()?
     */
  syncFromLayout(layout_data, data, changed_cells) {
    this.importLayoutData(layout_data)
    this.syncSourceGraph(data, changed_cells)
  }

  // TODO split!
  syncData(data: INetworkJson, changed_cells: Iterable<string> = []) {
    let subgraphs = this.subgraphs
    let clusters = this.clusters
    let cells = new Map<string, TCell>()

    // ADD / SET

    for (let cell of data.cells) {
      cells.set(cell.id, cell)
      // new cluster
      if ((cell as TMachine).embeds && !subgraphs.get(cell.id)) {
        cell = cell as TMachine
        subgraphs.set(cell.id, new Graph({
          directed: true,
          multigraph: true
        }) as TDagreGraph)
        subgraphs.get(cell.id).setGraph({
          width: 0,
          height: 0,
          hash: null,
          is_dirty: true,
          marginx: 20,
          marginy: 20,
          ranksep: 50
        })
        // TODO this may not be safe
        clusters.setNode(cell.id, {
          // id: cell.id,
          width: 0,
          height: 0,
          x: 0,
          y: 0
        })
      } else if ((cell as TState).type == 'fsa.State') {
        cell = cell as TState
        let [parent_id, id] = cell.id.split(':')
        if (!subgraphs.get(parent_id).node(id)) {
          subgraphs.get(parent_id).graph().is_dirty = true
          subgraphs.get(parent_id).setNode(id, {
            width: cell.size.width,
            height: cell.size.width,
            x: 0,
            y: 0
          })
        }
      } else if ((cell as TLink).type == 'fsa.Arrow') {
        cell = cell as TLink
        let [source_parent_id, source_id] = cell.source.id.split(':')
        let [target_parent_id, target_id] = cell.target.id.split(':')
        if (target_parent_id != source_parent_id) {
          // cluster to cluster
          let edge = {
            v: source_parent_id,
            w: target_parent_id
          }
          let edge_data = clusters.edge(edge)
          if (edge_data) {
            // add a inner node to inner node connection
            if (!edge_data.cells.has(cell.id)) {
              edge_data.cells.add(cell.id)
              // TODO is_dirty isnt required, but will trigger syncing of the (new) edge
              clusters.graph().is_dirty = true
            }
          } else {
            // add a new cluster to cluster connection
            clusters.graph().is_dirty = true
            clusters.setEdge(edge, {
              cells: new Set<string>(),
              minLen: cell.minLen || 1,
              points: []
            })
          }
        } else {
          // subgraph
          let graph = subgraphs.get(source_parent_id)
          let edge = {
            v: source_id,
            w: target_id,
            name: this.removeParentIds(cell.id)
          }
          if (!graph.hasEdge(edge)) {
            clusters.graph().is_dirty = true
            graph.graph().is_dirty = true
            graph.setEdge(edge, {
              points: [],
              minLen: cell.minLen || 1
            })
          }
        }
      }
    }

    // REMOVE
    changed_cells = changed_cells || []

    // find deleted nodes
    for (let cell_id of changed_cells) {
      if (cells.has(cell_id)) continue
      // TODO avoid accessing the source graph
      // figure out the type from the syntax of the ID
      let type
      if (!cell_id.match(':')) type = 'machine'
      else if (!cell_id.match('::')) type = 'state'
      else type = 'link'
      if (type == 'machine') {
        clusters.removeNode(cell_id)
        clusters.graph().is_dirty = true
        subgraphs.delete(cell_id)
      } else if (type == 'state') {
        let [parent_id, id] = cell_id.split(':')
        clusters.graph().is_dirty = true
        let graph = subgraphs.get(parent_id)
        if (!graph) {
          log(`Missing graph ${parent_id}`)
          continue
        }
        graph.removeNode(id)
        graph.graph().is_dirty = true
      } else if (type == 'link') {
        let [source, target] = cell_id.split('::')
        let [source_parent_id, source_id] = source.split(':')
        let [target_parent_id, target_id] = target.split(':')
        if (target_parent_id != source_parent_id) {
          // cluster to cluster
          let edge = {
            v: source_parent_id,
            w: target_parent_id
          }
          let edge_data = clusters.edge(edge)
          if (!edge_data) continue
          if (edge_data.cells.has(cell_id)) {
            edge_data.cells.delete(cell_id)
            clusters.graph().is_dirty = true
            subgraphs.get(source_parent_id).graph().is_dirty = true
            subgraphs.get(target_parent_id).graph().is_dirty = true
            if (!edge_data.cells.size) clusters.removeEdge(edge.v, edge.w)
          }
        } else {
          // subgraph
          clusters.graph().is_dirty = true
          let graph = subgraphs.get(source_parent_id)
          if (!graph) {
            log(`Missing graph ${source_parent_id}`)
            continue
          }
          graph.graph().is_dirty = true
          graph.removeEdge(source_id, target_id, this.removeParentIds(cell_id))
        }
      }
    }

    // compute hashes
    for (let graph of subgraphs.values()) {
      if (graph.graph().is_dirty || !graph.graph().hash) {
        // reset the positions before computing the hash
        for (let edge of graph.edges()) {
          graph.edge(edge).points = []
        }
        for (let node of graph.nodes()) {
          graph.node(node).x = 0
          graph.node(node).y = 0
        }
        graph.graph().hash = md5(JSON.stringify(graph))
      }
    }
  }

  /**
     * Removes parent IDs from links.
     *
     * parent:a::parent:b -> a::b
     */
  removeParentIds(id: string) {
    return id.replace(/(^|::).+?:/g, '$1')
  }

  syncClusterSizes() {
    for (let [id, graph] of this.subgraphs.entries()) {
      // add a half of the size of the biggest node (to both axis)
      let biggest_radius = graph.nodes().reduce((ret, node: string) => {
        let width = graph.node(node).width
        return width > ret ? width : ret
      }, 0)
      let data = graph.graph()
      let node = {
        width: data.width + biggest_radius / 2,
        height: data.height + biggest_radius / 2,
        x: 0,
        y: 0
      }
      this.clusters.setNode(id, node)
    }
  }

  syncSourceGraph(data: INetworkJson, changed_cells: Iterable<string> = []) {
    // webworker instance
    if (!this.source_graph) return

    let subgraphs = this.subgraphs
    let clusters = this.clusters
    let cells = new Map<string, TCell>()
    this.source_graph.startBatch('add')
    let cells_to_add = []

    // TODO use paper#addCells, view#onChangeAttrs
    // use link positions from dagre, updateConnectionOnly
    //   investigate updatePostponed
    let first_run =
      !this.source_graph.get('cells') || !this.source_graph.get('cells').length
    let batch_cells = []

    for (let cell of data.cells) {
      cells.set(cell.id, cell)
      let position = { x: 0, y: 0 }
      let size = { width: 0, height: 0 }
      if ((cell as TMachine).embeds) {
        cell = cell as TMachine
        let node = this.clusters._nodes[cell.id]

        position.x = node.x
        position.y = node.y
        size.width = node.width
        size.height = node.height
      } else if ((cell as TState).type == 'fsa.State') {
        cell = cell as TState
        let [parent_id, id] = cell.id.split(':')
        let node = subgraphs.get(parent_id)._nodes[id]
        let cluster = clusters._nodes[parent_id]

        position.x = node.x + cluster.x
        position.y = node.y + cluster.y
        size.width = node.width
        size.height = node.height
      } else if (
        (cell as TLink).type == 'fsa.Arrow' &&
        this.options.syncLinks
      ) {
        cell = cell as TLink
        const [source_parent_id, source_id] = cell.source.id.split(':')
        const [target_parent_id, target_id] = cell.target.id.split(':')
        // sync link positions only within the same machine
        if (source_parent_id != target_parent_id) continue
        const graph = subgraphs.get(source_parent_id)
        const edge = graph.edge(
          source_id,
          target_id,
          this.removeParentIds(cell.id)
        )
        cell.vertices = edge.points
      }

      if (first_run) {
        // cell = deepcopy(cell)
        cell.position = position
        cell.size = size
        batch_cells.push(cell)
        continue
      }

      let model = this.source_graph.getCell(cell.id)
      cell = deepcopy(cell)
      cell.position = position
      cell.size = size
      if (!model) {
        cells_to_add.push(cell)
      } else {
        const is_state = cell.type == 'fsa.State'
        if (model.get('fixed-position')) {
          delete cell.position
        } else if (
          is_state &&
          this.source_graph.getCell(cell.parent).get('fixed-position')
        ) {
          delete cell.position
        }
        model.set(cell)
      }
    }

    if (!first_run) {
      if (cells_to_add) {
        this.source_graph.addCells(cells_to_add)
      }
      let cells_to_remove = [...(changed_cells || [])]
        .filter(id => !cells.has(id))
        .map(id => this.source_graph.getCell(id))
        .filter(cell => cell)
      // remove cells in a reversed order, so the parent machine gets removed
      // at the end
      if (cells_to_remove.length) {
        cells_to_remove.reverse()
        this.source_graph.removeCells(cells_to_remove)
      }
    } else {
      this.source_graph.resetCells(batch_cells)
    }

    this.source_graph.stopBatch('add')
  }
}
