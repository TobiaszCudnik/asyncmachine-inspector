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
import AsyncMachine, {TransitionStepTypes} from 'asyncmachine'
import * as _ from "underscore"


export class NetworkJsonFactory 
        extends NetworkJsonFactoryBase<INetworkJson, TMachine, TState, TLink> {
    initJson() {
        return {
            cells: []
        }
    }

    addMachineNode(node: TMachine) {
        this.json.cells.push(node)
    }
    addStateNode(node: TState) {
        this.json.cells.push(node)

        let machine = <TMachine>this.getNodeById(node.parent)
        machine.embeds.push(node.id)
    }
    addLinkNode(node: TLink) {
        this.json.cells.push(node)
    }

    // TODO queue size
    // TODO number of listeners
    createMachineNode(machine: AsyncMachine<any, any, any>, machine_id:
            string): TMachine {
        return {
            type: 'uml.State',
            id: machine_id,
            attrs: { text: { text: machine.id() } },
            embeds: [],
            z: 1,
            is_touched: this.network.machines_during_transition.has(machine_id),
            
        }
    }
    createStateNode(node: GraphNode): TState {
        const ui_name = this.stateUiName(node.name)
        return {
            type: 'fsa.State',
            id: this.getStateNodeId(node),
            parent: node.machine_id,
            attrs: { text: { text: ui_name } },
            z: 3,
            size: this.getNodeSize(ui_name),
            is_set: node.is_set,
            step_style: node.step_style
        }
    }
    stateUiName(name): string {
        return name.replace(/([a-z])([A-Z])/g, '$1\n$2')
    }
    createLinkNode(from: GraphNode, to: GraphNode, relation: NODE_LINK_TYPE):
            TLink {
        return {
            type: 'fsa.Arrow',
            smooth: true,
            source: {
                id: this.getStateNodeId(from)
            },
            target: {
                id: this.getStateNodeId(to)
            },
            relation,
            id: `${this.getStateNodeId(from)}::${this.getStateNodeId(to)}::${relation}`,
            labels: [{
                id: `${this.getStateNodeId(from)}::${this.getStateNodeId(to)}::${relation}-label`,
                position: 0.5,
                attrs: {
                    text: { text: this.getLabelFromLinkType(relation)}
                }
            }],
            z: 2,
            is_touched: this.network.isLinkTouched(from, to, relation)
        }
    }

    getNodeSize(name: string) {
        const lines = name.split('\n')
        const longest = lines.reduce(((p, l) => Math.max(p, l.length)), 0)
        let size = Math.max(100, longest * 10)
        return { width: size, height: size }
    }

    protected getStateNodeId(node: GraphNode): string {
        // TODO extract normalize()
        return `${node.machine_id}:${node.name.replace(/[^\w]/g, '-')}`
    }

    protected getNodeById(id: string): JsonNode {
        return _.findWhere(this.json.cells, {id})
    }
}

export default NetworkJsonFactory
export class JsonDiffFactory 
        extends JsonDiffFactoryBase<NetworkJsonFactory, INetworkJson> {
}

// TYPES

export type MachineId = string;
export type StateName = string;


export type TMachine = {
    type: 'uml.State',
    embeds: string[],
    id: MachineId,
    z?: number,
    position?: {
        x: number,
        y: number,
    },
    size?: {
        width: number,
        height: number,
    },
    attrs: {text: {text: string}},
    is_touched?: boolean
}

export type TState = {
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
    is_set?: boolean,
    z?: number,
    size?: {
        width: number,
        height: number,
    },
    position?: {
        x: number,
        y: number,
    },
    step_style: TransitionStepTypes
}

export type TLink = {
    type: 'fsa.Arrow'
    id: string,
    source: {
        id: string
    },
    target: {
        id: string
    },
    labels?: Array<{
        id: string,
        position?: number,
        attrs: {
            text: {
                text: string
            }
        }
    }>,
    smooth?: boolean,
    z?: number,
    position?: {
        x: number,
        y: number,
    },
    size?: {
        width: number,
        height: number,
    },
    is_touched?: boolean
}

type JsonNode = TMachine | TState | TLink


export interface INetworkJson {
    cells: Array<TState | TLink | TMachine>
}

export type TCell = TState | TLink | TMachine