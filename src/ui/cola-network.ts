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


/**
 * TODO make it a steram
 */
export class JsonDiffFactory 
        extends JsonDiffFactoryBase<NetworkJsonFactory, INetworkJson> {
    diffpatcher: jsondiffpatch.IDiffPatch;
    previous_json: INetworkJson;

    objectHash() {
        return objectHash;
    }
}


export default class NetworkJsonFactory 
        extends NetworkJsonFactoryBase<INetworkJson, Machine, State, Link> {
    initJson() {
        return {
            groups: [],
            nodes: [],
            links: []
        }
    }

    addMachineNode(node: Machine) {
        this.json.groups.push(node)
    }
    addStateNode(node: State) {
        this.json.nodes.push(node)

        let machine = this.getMachineNodeById(node.machine_id)
        machine.leaves.push(this.json.nodes.length - 1)
    }
    addLinkNode(node: Link) {
        this.json.links.push(node)
    }

    createMachineNode(machine: AsyncMachine, machine_id: string): Machine {
        return {
            object_type: OBJECT_TYPE.MACHINE,
            name: this.getMachineName(machine),
            leaves: [],
            id: machine_id,
            x: null,
            y: null
        }
    }
    
    createStateNode(node: GraphNode): State {
        return {
            object_type: OBJECT_TYPE.STATE,
            name: node.name,
            machine_id: node.machine_id,
            auto: Boolean(node.state.auto),
            negotiating: false, // TODO
            is_set: node.is_set,
            index: this.json.nodes.length,
            x: null,
            y: null
        }
    }
    createLinkNode(from: GraphNode, to: GraphNode, relation: NODE_LINK_TYPE): Link {
        return {
            object_type: OBJECT_TYPE.LINK,
            source_name: from.full_name,
            target_name: to.full_name,
            source: this.nodes.get(from).index,
            target: this.nodes.get(to).index,
            type: relation,
            active: false   // TODO
        }
    }

    protected getStateNodeId(node: GraphNode): string {
        return `${node.machine_id}:${node.name}`
    }

    protected getMachineNodeById(id: string): Machine {
        return _.findWhere(this.json.groups, {id})
    }
}


export function objectHash(obj: State | Link | Machine) {
    let key
    if (isTypeMachine(obj))
        return obj.id
    else if (isTypeState(obj))
        return `${obj.machine_id}:${obj.name}`
    else if (isTypeLink(obj))
        return `${obj.source_name}:${obj.target_name}`
    else
        throw new Error('unknown object type')
}

function isTypeMachine(obj: State | Link | Machine): obj is Machine {
    return (obj.object_type == OBJECT_TYPE.MACHINE)
}

function isTypeState(obj: State | Link | Machine): obj is State {
    return (obj.object_type == OBJECT_TYPE.STATE)
}

function isTypeLink(obj: State | Link | Machine): obj is Link {
    return (obj.object_type == OBJECT_TYPE.LINK)
}

/* ---------- TYPES ---------- */

export type MachineId = string;
export type StateName = string;

export type Machine = {
    object_type: OBJECT_TYPE,
    name: string,
    leaves: number[],
    id: string,
    x: number,
    y: number
}

export type State = {
    object_type: OBJECT_TYPE,
    name: StateName;
    machine_id: MachineId;
    auto: boolean
    negotiating: boolean,
    is_set: boolean,
    index: number,
    x: number,
    y: number,
    width?: number,
    height?: number
}

export type Link = {
    object_type: OBJECT_TYPE,
    source_name: StateName,
    target_name: StateName,
    source: number,
    target: number,
    active: boolean,
    type: NODE_LINK_TYPE
}

export interface INetworkJson {
    nodes: Array<State>,
    links: Array<Link>,
    groups: Array<Machine>
}
