import * as jsondiffpatch from 'jsondiffpatch'
import Network, {
    Node as GraphNode
} from "../network";
import * as assert from 'assert'
import {
    NetworkJsonFactory as NetworkJsonFactoryBase,
    JsonDiffFactory as JsonDiffFactoryBase,
    OBJECT_TYPE,
    NODE_LINK_TYPE
} from '../network-json'
import AsyncMachine from 'asyncmachine'
import * as _ from "underscore"


export class NetworkJsonFactory extends NetworkJsonFactoryBase<INetworkJson, Machine, State, Link> {
    initJson() {
        return {
            cells: []
        }
    }

    addMachineNode(node: Machine) {
        this.json.cells.push(node)
    }
    addStateNode(node: State) {
        this.json.cells.push(node)

        let machine = <Machine>this.getNodeById(node.parent)
        machine.embeds.push(node.id)
    }
    addLinkNode(node: Link) {
        this.json.cells.push(node)
    }

    createMachineNode(machine: AsyncMachine, machine_id: string): Machine {
        return {
            type: 'uml.State',
            id: machine_id,
            name: machine.id(),
            embeds: []
        }
    }
    createStateNode(node: GraphNode): State {
        return {
            type: 'fsa.State',
            id: this.getStateNodeId(node),
            parent: node.machine_id
        }
    }
    createLinkNode(from: GraphNode, to: GraphNode, relation: NODE_LINK_TYPE): Link {
        return {
            type: 'fsa.Arrow',
            source: {
                id: this.getStateNodeId(from)
            },
            target: {
                id: this.getStateNodeId(to)
            },
            id: `${this.getStateNodeId(to)}-${this.getStateNodeId(from)}-${relation}`,
            labels: [{
                attrs: { text: { text: NODE_LINK_TYPE[relation] }}}]
        }
    }

    protected getStateNodeId(node: GraphNode): string {
        return `${node.machine_id}:${node.name}`
    }

    protected getNodeById(id: string): JsonNode {
        return _.findWhere(this.json.cells, {id})
    }
}

export var JsonDiffFactory = JsonDiffFactoryBase

export type MachineId = string;
export type StateName = string;


export type Machine = {
    type: 'uml.State',
    embeds: string[],
    id: MachineId,
    name: string
}

export type State = {
    type: 'fsa.State'
    id: MachineId,
    parent: string
}

export type Link = {
    type: 'fsa.Arrow'
    id: string,
    source: {
        id: string
    },
    target: {
        id: string
    },
    labels?: Array<{
        attrs: {
            text: {
                text: string
            }
        }
    }>
}

type JsonNode = Machine | State | Link


export interface INetworkJson {
    cells: Array<State | Link | Machine>
}