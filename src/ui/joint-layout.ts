/// <reference path="../../typings/modules/jointjs/index.d.ts" />


// import { layout } from 'ciena-dagre/dist/dagre'
import { layout } from 'dagre'
import * as jsondiffpatch from 'jsondiffpatch'
import { IDelta } from 'jsondiffpatch'
import { Graph } from 'ciena-graphlib'
import * as joint from 'jointjs'
import * as md5 from 'md5'
import * as deepcopy from 'deepcopy'
import {
	INetworkJson,
	TCell,
  TState,
  TLink,
  TMachine
} from './joint-network'


// TODO types from dagre
type TNode = {
  width: number,
  height: number,
  x: number,
  y: number,
}

type TEdge = {
  minLen: number,
  width: number,
  height: number,
  points: number[][]
}

type TClusterEdge = {
  cells: Set<string>,
  minLen: number,
  width: number,
  height: number,
  points: number[][]
}

type TGraphData = {
  width: number,
  height: number,
  hash: string,
  is_dirty?: boolean
}

type TClusterData = {
  width: number,
  height: number,
  is_dirty?: boolean
}

// TODO update the definitions
type TDagreGraph = Graph<TNode, TEdge, TGraphData>
type TClusterGraph = Graph<TNode, TClusterEdge, TClusterData>

function cloneGraph(graph: Graph) {
  return deepcopy(graph, function (target) {
    if (target.constructor === Graph)
      return new Graph()
  })
}

export default class GraphLayout {
  source_graph: joint.dia.Graph;
  options: {
    setLinkVertices: boolean
  }

  clusters: TClusterGraph;
  subgraphs: Map<string, TDagreGraph>;

  // index by ID
  cells: Map<string, TCell>;
  data: INetworkJson;

  /**
   * TODO GC after a supported limit
   */
  layouts_by_hash = new Map<string, IDelta>();
  differ: jsondiffpatch.IDiffPatch;

  constructor(source_graph: joint.dia.Graph, options = {setLinkVertices: false}) {
    this.source_graph = source_graph
    this.options = options
    this.subgraphs = new Map<string, TDagreGraph>()
    this.clusters = new Graph({
        directed: false
      }) as TClusterGraph
    this.clusters.setGraph({
      width: 0,
      height: 0,
      is_dirty: true
    })
    this.differ = jsondiffpatch.create({
      objectHash: (obj: TCell) => obj.id
    })
  }

  setData(data: INetworkJson, changed_cells: Iterable<string> = null) {
    let start = Date.now()
    this.syncData(data, changed_cells)
    console.log(`Sync data ${Date.now() - start}ms`)
    if (!this.layout())
      return
    start = Date.now()
    this.syncSourceGraph(data, changed_cells)
    console.log(`Update the source graph ${Date.now() - start}ms`)
  }

  /**
   * 
   * @return Number of changed graphs.
   */
  layout(): number {
    let start = Date.now()
    let cloned = 0
    let dirty = 0
    for (let [id, graph] of this.subgraphs.entries()) {
      let graph_data = graph.graph()
      if (!graph_data.is_dirty)
        continue
      dirty++
      let diff = this.layouts_by_hash.get(graph_data.hash)
      if (diff) {
        jsondiffpatch.patch(graph, diff)
        cloned++
      } else {
        let layout_data = {
          _nodes: graph._nodes,
          _edgeLabels: graph._edgeLabels,
          _label: graph._label
        }
        let pre_layout = deepcopy(layout_data)
        layout(graph)
        graph_data.is_dirty = false
        let diff = this.differ.diff(pre_layout, layout_data)
        this.layouts_by_hash.set(graph_data.hash, diff)
      }
    }
    console.log(`Layout ${this.subgraphs.size} subgraphs (${dirty} dirty, ${cloned} cloned) ${Date.now() - start}ms`)
    // sizes of clusters could've changed
    if (this.clusters.graph().is_dirty) {
      // TODO support the hash based cache
      dirty++
      start = Date.now()
      // TODO sync only changed graphs
      this.syncClusterSizes()
      layout(this.clusters)
      this.clusters.graph().is_dirty = false
      console.log(`Layout the cluster graph ${Date.now() - start}ms`)
    }
    return dirty
  }

  // TODO remove!
  normalizeId(id: string) {
    return id.replace(/[^\w\d]/g, '-')
  }

  // TODO split!
  syncData(data: INetworkJson, changed_cells: Iterable<string> = []) {
    let subgraphs = this.subgraphs
    let clusters = this.clusters
    let cells = this.cells = new Map<string, TCell>()

    // ADD / SET

    for (let cell of data.cells) {
      cells.set(cell.id, cell)
      // new cluster
      if ((cell as TMachine).embeds && !subgraphs.get(cell.id)) {
        cell = cell as TMachine
        subgraphs.set(cell.id, new Graph({
            directed: true,
            multigraph: true
          }) as TDagreGraph);
        subgraphs.get(cell.id).setGraph({
          width: 0,
          height: 0,
          hash: null,
          is_dirty: true
        })
        // TODO this may not be safe
        clusters.setNode(cell.id, {
          // id: cell.id,
          width: 0,
          height: 0,
          x: 0, y: 0
        })
      } else if ((cell as TState).type == "fsa.State") {
        cell = cell as TState
        let [parent_id, id] = cell.id.split(':')
        parent_id = this.normalizeId(parent_id)
        if (!subgraphs.get(parent_id).node(id)) {
          subgraphs.get(parent_id).graph().is_dirty = true
          subgraphs.get(parent_id).setNode(id, {
            width: cell.size.width,
            height: cell.size.width,
            x: 0,
            y: 0
          })
        }
      } else if ((cell as TLink).type == "fsa.Arrow") {
        cell = cell as TLink
        let [source_parent_id, source_id] = cell.source.id.split(':')
        source_parent_id = this.normalizeId(source_parent_id)
        let [target_parent_id, target_id] = cell.target.id.split(':')
        target_parent_id = this.normalizeId(target_parent_id)
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
      if (cells.has(cell_id))
        continue
      let cell = this.source_graph.getCell(cell_id)
      if (cell.get('embeds')) {
        clusters.removeNode(cell.id)
        clusters.graph().is_dirty = true
        subgraphs.delete(cell.id)
      } else if (cell.get('type') == "fsa.State") {
        let [parent_id, id] = cell.id.split(':')
        parent_id = this.normalizeId(parent_id)
        clusters.graph().is_dirty = true
        let graph = subgraphs.get(parent_id)
        if (!graph) {
          console.log(`Missing graph ${parent_id}`)
          continue
        }
        graph.removeNode(id)
        graph.graph().is_dirty = true
      } else if (cell.get('type') == "fsa.Arrow") {
        let [source_parent_id, source_id] = cell.get('source').id.split(':')
        source_parent_id = this.normalizeId(source_parent_id)
        let [target_parent_id, target_id] = cell.get('target').id.split(':')
        target_parent_id = this.normalizeId(target_parent_id)
        if (target_parent_id != source_parent_id) {
          // cluster to cluster
          let edge = {
            v: source_parent_id,
            w: target_parent_id
          }
          let edge_data = clusters.edge(edge)
          if (!edge_data) 
            continue
          if (edge_data.cells.has(cell.id)) {
            edge_data.cells.delete(cell.id)
            clusters.graph().is_dirty = true
            subgraphs.get(source_parent_id).graph().is_dirty = true
            subgraphs.get(target_parent_id).graph().is_dirty = true
            if (!edge_data.cells.size)
              clusters.removeEdge(edge.v, edge.w)
          }
        } else {
          // subgraph
          clusters.graph().is_dirty = true
          let graph = subgraphs.get(source_parent_id)
          if (!graph) {
            console.log(`Missing graph ${source_parent_id}`)
            continue
          }
          graph.graph().is_dirty = true
          graph.removeEdge(source_id, target_id, this.removeParentIds(cell.id))
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

  removeParentIds(id: string) {
    return id.replace(/(^|-).+?:/g, '$1')
  }

  syncClusterSizes() {
    for (let [id, graph] of this.subgraphs.entries()) {
      // add half of the size of the biggest node (to both axis)
      let biggest_radius = graph.nodes().reduce((ret, node: string) => {
          let width = graph.node(node).width
          return width > ret ? width : ret
        }, 0)
      let data = graph.graph()
      let node = {
        width: data.width + biggest_radius / 2,
        height: data.height + biggest_radius / 2,
        x: 0, y: 0
      }
      this.clusters.setNode(id, node)
    }
  }

  syncSourceGraph(data: INetworkJson, changed_cells: Iterable<string> = []) {
    let subgraphs = this.subgraphs
    let clusters = this.clusters
    let cells = this.cells
    this.source_graph.startBatch('add')

    // TODO use paper#addCells, view#onChangeAttrs
    // use link positions from dagre, updateConnectionOnly
    //   investigate updatePostponed
    let first_run = !this.source_graph.get('cells') 
      || !this.source_graph.get('cells').length
    let batch_cells = []

    for (let cell of data.cells) {
      let position = {x: 0, y: 0}
      let size = {width: 0, height: 0}
      if ((cell as TMachine).embeds) {
        cell = cell as TMachine
        let node = this.clusters.node(cell.id)

        position.x = node.x
        position.y = node.y
        size.width = node.width
        size.height = node.height
      } else if ((cell as TState).type == "fsa.State") {
        cell = cell as TState
        let [parent_id, id] = cell.id.split(':')
        parent_id = this.normalizeId(parent_id)
        let node = subgraphs.get(parent_id).node(id)
        let cluster = clusters.node(parent_id)
        
        position.x = node.x + cluster.x
        position.y = node.y + cluster.y
        size.width = node.width
        size.height = node.height
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
        this.source_graph.addCell((<any>cell) as joint.dia.Cell)
      } else {
        model.set(cell)
      }
    }

    if (!first_run) {
      let cells_to_remove = [...changed_cells]
        .filter( id => !cells.has(id) )
        .map( id => this.source_graph.getCell(id) )
        .filter( cell => cell )
      this.source_graph.removeCells(cells_to_remove)
    } else {
      this.source_graph.resetCells(batch_cells)
    }

    this.source_graph.stopBatch('add')
  }
}
