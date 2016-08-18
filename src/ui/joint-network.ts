import * as jsondiffpatch from 'jsondiffpatch'
import Network, {
    Node as GraphNode
} from "../network";
import * as assert from 'assert/'
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
            embeds: [],
            z: 1
        }
    }
    createStateNode(node: GraphNode): State {
        let ret = {
            type: 'fsa.State',
            id: this.getStateNodeId(node),
            parent: node.machine_id,
            attrs: { text: { text: node.name } },
            z: 3,
            size: this.getNodeSize(node),
            is_set: node.is_set,
            // TODO remove, use the class
            fill: node.is_set ? 'yellow' : null
        }
        // 
        if (node.is_set)
            ret.attrs['circle'] = { fill: 'yellow' }
        return ret
    }
    createLinkNode(from: GraphNode, to: GraphNode, relation: NODE_LINK_TYPE): Link {
        return {
            type: 'fsa.Arrow',
            smooth: true,
            source: {
                id: this.getStateNodeId(from)
            },
            target: {
                id: this.getStateNodeId(to)
            },
            id: `${this.getStateNodeId(from)}-${this.getStateNodeId(to)}-${relation}`,
            labels: [{
                position: 0.5,
                attrs: { text: {
                    text: this.getLabelFromLinkType(relation)
                }}}],
            z: 2
        }
    }

    getNodeSize(node: GraphNode) {
        let name = node.name
        let size = Math.max(50, name.length * 9)
        return { width: size, height: size }
    }

    protected getStateNodeId(node: GraphNode): string {
        return `${node.machine_id}:${node.name}`
    }

    protected getNodeById(id: string): JsonNode {
        return _.findWhere(this.json.cells, {id})
    }
}

export default NetworkJsonFactory
export class JsonDiffFactory 
        extends JsonDiffFactoryBase<NetworkJsonFactory, INetworkJson> {
    objectHash() {
        // TODO JSON diffs for labels 
        return function(node) {
            if (Array.isArray(node)) {
                return JSON.stringify(node)
            } else {
                return node.id
            }
        }
    }
}

// TYPES

export type MachineId = string;
export type StateName = string;


export type Machine = {
    type: 'uml.State',
    embeds: string[],
    id: MachineId,
    name: string,
    z?: number
}

export type State = {
    type: 'fsa.State'
    id: MachineId,
    parent: string,
    attrs: {
        text: { text: string },
        circle?: {
            fill?: string,
            stroke?: string,
            'stroke-width'?: number;
        }
    },
    z?: number,
    size?: {width: number, height: number}
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
        position?: number,
        attrs: {
            text: {
                text: string
            }
        }
    }>,
    smooth?: boolean,
    z?: number
}

type JsonNode = Machine | State | Link


export interface INetworkJson {
    cells: Array<State | Link | Machine>
}