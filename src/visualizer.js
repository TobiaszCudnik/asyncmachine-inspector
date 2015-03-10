import am from 'asyncmachine'
import 'babelify/polyfill'
import * as Graph from 'graphlib/lib/graph'
import uuid from 'node-uuid'

export class Node {

  constructor(name, machine) {
    this.id = uuid.v4()
    this.machine = machine
    this.name = name
  }

  get() {
    this.machine.get(this.name)
  }
}

export class VisualizerStates extends am.AsyncMachine {
}


export class Visualizer {

  constructor() {
    this.graph = new Graph
    this.states = new VisualizerStates
    this.nodes = {}
    this.events = []
  }

  addMachine(machine) {
    this.getNodesFromMachine(machine)
    this.bindToMachine(machine)
    this.scanReferences()
  }


  bindToMachine(machine) {
    // TODO override event triggers to apply them on the UI immediate
  }


  getNodesFromMachine(machine) {
    // scan states
    let new_nodes = []
    for (let name of machine.states_all) {
      let node = new Node(name, machine)
      this.nodes[node.id] = node
      this.graph.setNode(node.id, node)
      new_nodes.push(node)
    }

    // get edges from relations
    for (node of new_nodes)
      this.getRelationsFromNode(node, machine)
  }

  getRelationsFromNode(node, machine) {
    // TODO limit to 'requires' and 'drops' ?
    for (let [relation, targets] of node.get()) {
      if (relation == 'auto')
        return

      for (let target_name of targets) {
        target = this.getNodeByName(target_name, machine)
        this.graph.setEdge(node.id, target.id, relation)
      }
    }
  }

  getNodeByName(name, machine) {
    for (let [id, node] of this.nodes) {
      if (node.name === name && node.machine === machine)
        return node
    }
  }

  scanReferences() {
    // scan listeners, get edges from listener refs
  }
}


export class VisualizerUi {

}
