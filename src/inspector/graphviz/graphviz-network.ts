import * as jsondiffpatch from 'jsondiffpatch'
import Network, { Node as GraphNode } from '../../network'
import * as assert from 'graphviz-network'
import {
  NetworkJsonFactory as NetworkJsonFactoryBase,
  JsonDiffFactory as JsonDiffFactoryBase,
  OBJECT_TYPE,
  NODE_LINK_TYPE
} from '../../network-json'
import AsyncMachine from 'asyncmachine/build/asyncmachine'
import * as _ from 'underscore'

export class JsonDiffFactory extends JsonDiffFactoryBase<
  NetworkJsonFactory,
  INetworkJson
> {
  diffpatcher: jsondiffpatch.IDiffPatch
  previous_json: INetworkJson

  objectHash() {
    return objectHash
  }
}

export default class NetworkJsonFactory extends NetworkJsonFactoryBase<
  INetworkJson,
  Machine,
  State,
  Link
> {
  initJson() {
    this.piped = []
    return []
  }

  json: any[]

  addMachineNode(node: Machine) {}
  addStateNode(node: State) {}
  addLinkNode(node: Link) {}

  // TODO queue size
  // TODO number of listeners
  createMachineNode(machine: AsyncMachine, machine_id: string) {
    this.json[id(machine_id)] = [`label = "${machine.id()}";`]
  }
  createStateNode(node: GraphNode) {}
  createLinkNode(from: GraphNode, to: GraphNode, relation: NODE_LINK_TYPE) {
    let link = `${id(from.full_name)} -> ${id(to.full_name)};`
    if (from.machine_id != to.machine_id) {
      // pipes
      this.piped.push(link)
    } else {
      this.json[id(from.machine_id)].push(link)
    }
  }

  getNodeSize(node: GraphNode) {
    let name = node.name
    let size = Math.max(50, name.length * 9)
    return { width: size, height: size }
  }

  piped: string[]

  generateJson() {
    super.generateJson()
    let json = 'digraph G {'
    for (let i of Object.keys(this.json)) {
      json += `subgraph ${i} {
                ${this.json[i].join('\n')}
            }`
    }
    return json + this.piped.join('\n') + '\n}'
  }
}

function id(text) {
  return text.replace(/[^\w\d]/g, '')
}

export function objectHash(obj) {
  return obj
}

/*
digraph G {

	subgraph cluster_0 {
		style=filled;
		color=lightgrey;
		node [style=filled,color=white];
		a0 -> a1 -> a2 -> a3;
		label = "process #1";
	}

	subgraph cluster_1 {
		node [style=filled];
		b0 -> b1 -> b2 -> b3;
		b1 -> b3;
		b0 -> b3;
		label = "process #2";
		color=blue
	}

	subgraph cluster_2 {
		node [style=filled];
		c0 -> c1 -> c2 -> c3;
		label = "process #3";
		color=blue
	}
	start -> a0;
	start -> b0;
	a1 -> b3;
	b2 -> a3;
	a3 -> a0;
	a2 -> c2;
	a3 -> end;
	b3 -> end;
	c0 -> b0;

	start [shape=Mdiamond];
	end [shape=Msquare];
}


*/
