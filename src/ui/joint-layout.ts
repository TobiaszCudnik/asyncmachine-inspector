/// <reference path="../../typings/modules/jointjs/index.d.ts" />


// import { layout } from 'ciena-dagre/dist/dagre'
import { layout } from 'dagre'
import { Graph } from 'ciena-graphlib'
import * as joint from 'jointjs'
import * as md5 from 'md5'
import * as deepcopy from 'deepcopy'


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

type TGraphData = {
  width: number,
  height: number,
  id: string,
  hash: string,
}

type TDagreGraph = Graph<TNode, TEdge, TGraphData>

export default class GraphLayout {
  source_graph: joint.dia.Graph;
  graph: TDagreGraph;
  cache: {
    sub_graphs: Map<string, TDagreGraph> | null,
    cluster_graph: TDagreGraph | null
  } = {
    sub_graphs: null, 
    cluster_graph: null
  }

  constructor(source_graph: joint.dia.Graph) {
    this.source_graph = source_graph
    // TODO bind to source graph changes
    this.convertGraph()
    this.source_graph.on('add remove', (node) => this.resetCache(node))
  }

  resetCache(source_node?: Backbone.Model) {
    // TODO clear only changed clusters (use source_node)
    this.cache = {
      sub_graphs: null, 
      cluster_graph: null
    }
    this.convertGraph()
  }

  layout() {
    let start = Date.now()
    for (let graph of this.sub_graphs.values()) {
      // try to reuse the layout from identical graphs
      // TODO optimise, index by hash
      for (let graph_inner of this.sub_graphs.values()) {
        if (graph_inner == graph || !graph_inner.graph().layedout)
          continue
        if (graph_inner.graph().hash != graph.graph().hash)
          continue
        graph._nodes = deepcopy(graph_inner._nodes)
        graph._edgeLabels = deepcopy(graph_inner._edgeLabels)
        graph.graph().width = graph_inner.graph().width
        graph.graph().height = graph_inner.graph().height
        graph.graph().layedout = true
      }
      if (graph.graph().layedout)
        continue
      layout(graph)
      graph.graph().layedout = true
    }
    console.log(`Layout subgraphs ${Date.now() - start}ms`)
    start = Date.now()
    // sizes of clusters could've changed
    this.cache.cluster_graph = null
    layout(this.cluster_graph)
    console.log(`Layout the cluster graph ${Date.now() - start}ms`)
    start = Date.now()
    // TODO apply positions from the subgraphs to the SOURCE graphs
    this.updateSourceGraph()
    console.log(`Update the source graph ${Date.now() - start}ms`)
  }

  convertGraph() {
    let start = Date.now()
    // TODO convert directly to subgraphs
    this.graph = this.source_graph.toGraphLib({
      directed: true,
      // We are about to use edge naming feature.
      multigraph: true,
      // We are able to layout graphs with embeds.
      compound: true,
      setNodeLabel: function (element) {
        return {
          width: element.get('size').width,
          height: element.get('size').height,
          rank: element.get('rank')
        };
      },
      setEdgeLabel: function (link) {
        return {
          minLen: link.get('minLen') || 1,
          points: []
        };
      },
      setEdgeName: function (link) {
        // Graphlib edges have no ids. We use edge name property
        // to store and retrieve ids instead.
        return link.id;
      }
    }) as TDagreGraph
    console.log(`Converted to dagre graph in ${Date.now() - start}ms`)
  }

  removeParentId(id: string) {
    return id.replace(/(^|-).+?:/g, '$1')
  }

  // TODO optimize?
  /**
   * Returns new graphs, where each represents a content of each cluster. Custer nodes aren't included.
   *
   * TODO cache
   */
  get sub_graphs(): Map<string, TDagreGraph> {
    if (this.cache.sub_graphs)
      return this.cache.sub_graphs

    let ret = new Map<string, TDagreGraph>()

    for (let cluster_id of this.getClusters()) {
      let graph = new Graph({
        directed: true,
        multigraph: true
      }) as TDagreGraph;

      let node = this.graph.node(cluster_id)

      graph.setGraph({
        width: node.width,
        height: node.height
      })

      let local_nodes = []

      // copy nodes
      for (let id of this.graph.children(cluster_id)) {
        // TODO clone the node object?
        // use local ID for subgraphs
        graph.setNode(id.split(':')[1], this.graph.node(id))
        local_nodes.push(id)
      }

      // copy edges
      for (let edge of this.graph.edges()) {
        if (local_nodes.includes(edge.v) && local_nodes.includes(edge.w)) {
        // if (graph.hasNode(edge.v) && graph.hasNode(edge.w)) {
          // TODO set a default label
          graph.setEdge({
            v: this.removeParentId(edge.v),
            w: this.removeParentId(edge.w),
            name: this.removeParentId(edge.name),
          }, {
            minLen: 1,
            points: [],
          })
        }
      }

      // set unique data after computing the hash
      graph.graph().hash = md5(JSON.stringify(graph))
      graph.graph().id = cluster_id
      ret.set(cluster_id, graph)
    }

    return this.cache.sub_graphs = ret
  }

  /**
   * Returns a new graph, where each node represents a cluster from the main graph. Edges between clusters are merged into one edge between these nodes.
   *
   * TODO cache
   */
  get cluster_graph(): TDagreGraph {
    if (this.cache.cluster_graph)
      return this.cache.cluster_graph

    let graph = new Graph({
      directed: false
    }) as TDagreGraph

    graph.setGraph({
      id: 'cluster',
      width: 0,
      height: 0
    })

    // copy nodes
    // TODO get the sizes from the sub_graphs
    for (let sub_graph of this.sub_graphs.values()) {
      let data = sub_graph.graph()
      // add half of the size of the biggest node (to both axis)
      let biggest_radius = sub_graph.nodes().reduce((ret, node: string) => {
          let width = sub_graph.node(node).width
          return width > ret ? width : ret
        }, 0)
      let node = {
        width: data.width + biggest_radius / 2,
        height: data.height + biggest_radius / 2,
        id: data.id
      }
      graph.setNode(data.id, node)
    }

    // merge edges
    for (let edge of this.graph.edges()) {
      let parent_1 = this.graph.parent(edge.v)
      let parent_2 = this.graph.parent(edge.w)
      if (parent_1 && parent_2 && parent_1 != parent_2) {
        graph.setEdge(parent_1, parent_2, {
          minLen: 1,
          points: [] as number[][],
        })
        // TODO missing edge labels?
      }
    }

    return this.cache.cluster_graph = graph
  }

  getClusters(): string[] {
    return this.graph.nodes()
      .filter(id => this.graph.children(id).length)
  }

  updateSourceGraph(opt = {setLinkVertices: false}) {
    /*
    this.get('cells').add(this._prepareCell(cell), options || {});
    */
    // TODO defaults for opt
    let graph = this.source_graph

    // Wrap all graph changes into a batch.
    // graph.startBatch('layout');

    // Update the graph.
    graph.fromGraphLib(this.graph, {
      importNode: (id: string) => {

        let element = this.source_graph.getCell(id)
        let node: TNode

        if (this.graph.children(id).length) {
          // cluster
          node = this.cluster_graph.node(id)
        } else {
          // sub node
          let parent_id = this.graph.parent(id)
          let parent_node = this.cluster_graph.node(parent_id)
          // TODO reverse local IDs
          node = this.sub_graphs.get(parent_id).node(
            this.removeParentId(id))
          node.x += parent_node.x
          node.y += parent_node.y
        }

        // if (opt.setPosition) {
        //   opt.setPosition(element, glNode);
        // } else {
          element.set('position', {
            x: node.x,
            y: node.y,
          });
          element.set('size', {
            width: node.width,
            height: node.height,
          });
        // }
      },
      importEdge: (id: {w: string, v: string, name: string}) => {
        if (!opt.setLinkVertices)
          return

        var link = this.source_graph.getCell(id.name);
        let parent1_id = this.graph.parent(id.v)
        let parent2_id = this.graph.parent(id.w)
        // TODO empty edge.points

        let edge
        // cluster children, shift the X/Ys
        if (parent1_id && parent2_id == parent1_id) {
          let graph = this.sub_graphs.get(parent1_id)
          edge = graph.edge(id)
          let { x, y } = this.cluster_graph.node(parent1_id)
          for (let point of edge.points) {
            point.x += x
            point.y += y
          }
        } else {
          edge = this.graph.edge(id)
        }

        let points = edge.points || [];

        // TODO do this ALWAYS for >1 link between the same nodes
        // Remove the first and last point from points array.
        // Those are source/target element connection points
        // ie. they lies on the edge of connected elements.
        link.set('vertices', points.slice(1, points.length - 1));
      }
    });

    // if (opt.resizeClusters) {
    //   // Resize and reposition cluster elements (parents of other elements)
    //   // to fit their children.
    //   // 1. filter clusters only
    //   // 2. map id on cells
    //   // 3. sort cells by their depth (the deepest first)
    //   // 4. resize cell to fit their direct children only.
    //   _.chain(glGraph.nodes())
    //       .filter(function (v) {
    //         return glGraph.children(v).length > 0;
    //       })
    //       .map(graph.getCell, graph)
    //       .sortBy(function (cluster) {
    //         return -cluster.getAncestors().length;
    //       })
    //       .invoke('fitEmbeds', {padding: opt.clusterPadding})
    //       .value();
    // }

    // graph.stopBatch('layout');

    // Return an object with height and width of the graph.
    return this.graph.graph();
  }

  // TODO to port

  // toGraphLib(opt) {

  //   opt = opt || {};

  //   var glGraphType = _.pick(opt, 'directed', 'compound', 'multigraph');
  //   var glGraph = new graphlib.Graph(glGraphType);

  //   var setNodeLabel = opt.setNodeLabel || _.noop;
  //   var setEdgeLabel = opt.setEdgeLabel || _.noop;
  //   var setEdgeName = opt.setEdgeName || _.noop;

  //   this.get('cells').each(function (cell) {

  //     if (cell.isLink()) {

  //       var source = cell.get('source');
  //       var target = cell.get('target');

  //       // Links that end at a point are ignored.
  //       if (!source.id || !target.id) return;

  //       // Note that if we are creating a multigraph we can name the edges. If
  //       // we try to name edges on a non-multigraph an exception is thrown.
  //       glGraph.setEdge(source.id, target.id, setEdgeLabel(cell), setEdgeName(cell));

  //     } else {

  //       glGraph.setNode(cell.id, setNodeLabel(cell));

  //       // For the compound graphs we have to take embeds into account.
  //       if (glGraph.isCompound() && cell.has('parent')) {
  //         glGraph.setParent(cell.id, cell.get('parent'));
  //       }
  //     }
  //   });

  //   return glGraph;
  // }

  // layou(graphOrCells, opt) {

  //   var graph: joint.dia.Graph;

  //   if (graphOrCells instanceof joint.dia.Graph) {
  //     graph = graphOrCells;
  //   } else {
  //     graph = (new joint.dia.Graph()).resetCells(graphOrCells);
  //   }

  //   // This is not needed anymore.
  //   graphOrCells = null;

  //   opt = _.defaults(opt || {}, {
  //     resizeClusters: true,
  //     clusterPadding: 10
  //   });

  //   // create a graphlib.Graph that represents the joint.dia.Graph
  //   var glGraph = graph.toGraphLib({
  //     directed: true,
  //     // We are about to use edge naming feature.
  //     multigraph: true,
  //     // We are able to layout graphs with embeds.
  //     compound: true,
  //     setNodeLabel: function (element) {
  //       return {
  //         width: element.get('size').width,
  //         height: element.get('size').height,
  //         rank: element.get('rank')
  //       };
  //     },
  //     setEdgeLabel: function (link) {
  //       return {
  //         minLen: link.get('minLen') || 1
  //       };
  //     },
  //     setEdgeName: function (link) {
  //       // Graphlib edges have no ids. We use edge name property
  //       // to store and retrieve ids instead.
  //       return link.id;
  //     }
  //   });

  //   var glLabel = {};

  //   // Dagre layout accepts options as lower case.
  //   // Direction for rank nodes. Can be TB, BT, LR, or RL
  //   if (opt.rankDir) glLabel.rankdir = opt.rankDir;
  //   // Alignment for rank nodes. Can be UL, UR, DL, or DR
  //   if (opt.align) glLabel.align = opt.align;
  //   // Number of pixels that separate nodes horizontally in the layout.
  //   if (opt.nodeSep) glLabel.nodesep = opt.nodeSep;
  //   // Number of pixels that separate edges horizontally in the layout.
  //   if (opt.edgeSep) glLabel.edgesep = opt.edgeSep;
  //   // Number of pixels between each rank in the layout.
  //   if (opt.rankSep) glLabel.ranksep = opt.rankSep;
  //   // Number of pixels to use as a margin around the left and right of the graph.
  //   if (opt.marginX) glLabel.marginx = opt.marginX;
  //   // Number of pixels to use as a margin around the top and bottom of the graph.
  //   if (opt.marginY) glLabel.marginy = opt.marginY;

  //   // Set the option object for the graph label.
  //   glGraph.setGraph(glLabel);

  //   // Executes the layout.
  //   dagre.layout(glGraph, {debugTiming: !!opt.debugTiming});

  //   // Wrap all graph changes into a batch.
  //   graph.startBatch('layout');

  //   // Update the graph.
  //   graph.fromGraphLib(glGraph, {
  //     importNode: function (v, gl) {

  //       var element = this.getCell(v);
  //       var glNode = gl.node(v);

  //       if (opt.setPosition) {
  //         opt.setPosition(element, glNode);
  //       } else {
  //         element.set('position', {
  //           x: glNode.x - glNode.width / 2,
  //           y: glNode.y - glNode.height / 2
  //         });
  //       }
  //     },
  //     importEdge: function (edgeObj, gl) {

  //       var link = this.getCell(edgeObj.name);
  //       var glEdge = gl.edge(edgeObj);
  //       var points = glEdge.points || [];

  //       if (opt.setLinkVertices) {
  //         if (opt.setVertices) {
  //           opt.setVertices(link, points);
  //         } else {
  //           // Remove the first and last point from points array.
  //           // Those are source/target element connection points
  //           // ie. they lies on the edge of connected elements.
  //           link.set('vertices', points.slice(1, points.length - 1));
  //         }
  //       }
  //     }
  //   });

  //   if (opt.resizeClusters) {
  //     // Resize and reposition cluster elements (parents of other elements)
  //     // to fit their children.
  //     // 1. filter clusters only
  //     // 2. map id on cells
  //     // 3. sort cells by their depth (the deepest first)
  //     // 4. resize cell to fit their direct children only.
  //     _.chain(glGraph.nodes())
  //         .filter(function (v) {
  //           return glGraph.children(v).length > 0;
  //         })
  //         .map(graph.getCell, graph)
  //         .sortBy(function (cluster) {
  //           return -cluster.getAncestors().length;
  //         })
  //         .invoke('fitEmbeds', {padding: opt.clusterPadding})
  //         .value();
  //   }

  //   graph.stopBatch('layout');

  //   // Return an object with height and width of the graph.
  //   return glGraph.graph();
  // }

  // fromGraphLib(glGraph, opt) {

  //   opt = opt || {};

  //   var importNode = opt.importNode || _.noop;
  //   var importEdge = opt.importEdge || _.noop;
  //   var graph = this instanceof joint.dia.Graph ? this : new joint.dia.Graph;

  //   // Import all nodes.
  //   glGraph.nodes().forEach(function (node) {
  //     importNode.call(graph, node, glGraph, graph, opt);
  //   });

  //   // Import all edges.
  //   glGraph.edges().forEach(function (edge) {
  //     importEdge.call(graph, edge, glGraph, graph, opt);
  //   });

  //   return graph;
  // }

  // // Create new graphlib graph from existing JointJS graph.
  // clustersToGraphs(graph, opt) {

  //   opt = opt || {};

  //   var glGraphType = _.pick(opt, 'directed', 'compound', 'multigraph');
  //   var glGraph = new Graph(glGraphType);
  //   var setNodeLabel = opt.setNodeLabel || _.noop;
  //   var setEdgeLabel = opt.setEdgeLabel || _.noop;
  //   var setEdgeName = opt.setEdgeName || _.noop;

  //   graph.get('cells').each(function (cell) {

  //     if (cell.isLink()) {

  //       var source = cell.get('source');
  //       var target = cell.get('target');

  //       // Links that end at a point are ignored.
  //       if (!source.id || !target.id) return;

  //       // Note that if we are creating a multigraph we can name the edges. If
  //       // we try to name edges on a non-multigraph an exception is thrown.
  //       glGraph.setEdge(source.id, target.id, setEdgeLabel(cell), setEdgeName(cell));

  //     } else {

  //       glGraph.setNode(cell.id, setNodeLabel(cell));

  //       // For the compound graphs we have to take embeds into account.
  //       if (glGraph.isCompound() && cell.has('parent')) {
  //         glGraph.setParent(cell.id, cell.get('parent'));
  //       }
  //     }
  //   });

  //   return glGraph;
  // }
}