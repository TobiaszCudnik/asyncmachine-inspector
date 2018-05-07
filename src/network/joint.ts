// TODO should be in /src/network/joint.ts
import {
  NetworkJsonFactory as NetworkJsonFactoryBase,
  JsonDiffFactory as JsonDiffFactoryBase,
  NODE_LINK_TYPE,
  TJSONIndex
} from './network-json'
import AsyncMachine, { TransitionStepTypes } from 'asyncmachine'
import * as _ from 'underscore'
import { QueueRowFields, StateChangeTypes } from 'asyncmachine/build/types'
import { Node as GraphNode } from './network'

export class NetworkJsonFactory extends NetworkJsonFactoryBase<
  INetworkJson,
  TMachine,
  TState,
  TLink
> {
  initJson() {
    return {
      cells: []
    }
  }

  getCachedNode<Node>(
    id: string,
    prev_json: INetworkJson,
    index: TJSONIndex
  ): Node | null {
    if (prev_json && !this.changed_ids.has(id) && index[id]) {
      // @ts-ignore
      return prev_json.cells[index[id]]
    }
    return null
  }

  onNewNode() {
    const index = this.json.cells.length - 1
    const node = this.json.cells[index]
    this.json_index[node.id] = index
    this.network.emit('new-node', node.id, index)
  }

  addMachineNode(node: TMachine) {
    this.json.cells.push(node)
    this.onNewNode()
  }
  addStateNode(node: TState) {
    this.json.cells.push(node)
    this.onNewNode()

    let machine = <TMachine>this.getNodeById(node.parent)
    if (!machine.embeds.includes(node.id)) {
      machine.embeds.push(node.id)
    }
  }
  addLinkNode(node: TLink) {
    this.json.cells.push(node)
    this.onNewNode()
  }

  // TODO number of listeners
  createMachineNode(machine: AsyncMachine<any, any, any>): TMachine {
    const machine_id = machine.id(true)
    const queue = machine.queue().length ? `(Q: ${machine.queue().length})` : ''
    return {
      type: 'uml.State',
      name: machine.id(),
      id: machine_id,
      embeds: [],
      z: 1,
      is_touched: this.network.machines_during_transition.has(machine_id),
      queue: machine.queue().map(r => ({
        machine: (r[QueueRowFields.TARGET] || machine).id(true),
        states: r[QueueRowFields.STATES],
        type: r[QueueRowFields.STATE_CHANGE_TYPE],
        auto: r[QueueRowFields.AUTO]
      })),
      processing_queue: Boolean(machine.queue().length),
      listeners: Object.values(machine._events || {})
        .map(e => e.length || 1)
        .reduce((count, num) => {
          return (count || 0) + num
        }, 0),
      ticks: Object.values(machine.clock_).reduce((r, n) => r + n)
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
      is_auto: node.is_auto,
      is_multi: node.is_multi,
      step_style: node.step_style,
      clock: node.clock
    }
  }
  stateUiName(name): string {
    return name.replace(/([a-z])([A-Z])/g, '$1\n$2')
  }
  createLinkID(from: GraphNode, to: GraphNode, relation: NODE_LINK_TYPE) {
    return `${this.getStateNodeId(from)}::${this.getStateNodeId(
      to
    )}::${relation}`
  }
  createLinkNode(
    from: GraphNode,
    to: GraphNode,
    relation: NODE_LINK_TYPE
  ): TLink {
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
      id: this.createLinkID(from, to, relation),
      labels: [
        {
          id: `${this.getStateNodeId(from)}::${this.getStateNodeId(
            to
          )}::${relation}-label`,
          position: 0.5,
          attrs: {
            text: { text: this.getLabelFromLinkType(relation) }
          }
        }
      ],
      z: 2,
      is_touched: this.network.isLinkTouched(from, to, relation)
    }
  }

  getNodeSize(name: string) {
    const lines = name.split('\n')
    const longest = lines.reduce((p, l) => Math.max(p, l.length), 0)
    let size = Math.max(100, longest * 10)
    return { width: size, height: size }
  }

  protected getStateNodeId(node: GraphNode): string {
    // TODO extract normalize()
    return `${node.machine_id}:${node.name.replace(/[^\w]/g, '-')}`
  }

  protected getNodeById(id: string): JsonNode {
    return _.findWhere(this.json.cells, { id })
  }
}

export default NetworkJsonFactory
export class JsonDiffFactory extends JsonDiffFactoryBase<
  NetworkJsonFactory,
  INetworkJson
> {}

// TYPES

export type MachineId = string
export type MachineStateId = string
export type StateName = string

export type TMachine = {
  type: 'uml.State'
  name: string
  embeds: string[]
  id: MachineId
  z?: number
  position?: {
    x: number
    y: number
  }
  size?: {
    width: number
    height: number
  }
  // attrs: { text: { text: string } }
  is_touched?: boolean
  queue: { machine?: string; states: StateName[]; type: StateChangeTypes }[]
  processing_queue: boolean
  listeners: number
  ticks: number
}

export type TState = {
  type: 'fsa.State'
  id: MachineStateId
  parent: string
  attrs: {
    text: { text: StateName }
    circle?: {
      fill?: string
      stroke?: string
      'stroke-width'?: number
    }
  }
  is_set?: boolean
  is_auto?: boolean
  is_multi?: boolean
  z?: number
  size?: {
    width: number
    height: number
  }
  position?: {
    x: number
    y: number
  }
  step_style: TransitionStepTypes
}

export type TLink = {
  type: 'fsa.Arrow'
  id: string
  source: {
    id: string
  }
  target: {
    id: string
  }
  labels?: Array<{
    id: string
    position?: number
    attrs: {
      text: {
        text: string
      }
    }
  }>
  smooth?: boolean
  z?: number
  position?: {
    x: number
    y: number
  }
  size?: {
    width: number
    height: number
  }
  is_touched?: boolean
}

export type JsonNode = TMachine | TState | TLink

export interface INetworkJson {
  cells: Array<TState | TLink | TMachine>
}

export type TCell = TState | TLink | TMachine
