// TODO should be in /src/network/joint.ts
import {
  JointJsonFactory as JsonJsonFactoryBase,
  JointDiffFactory as JointDiffFactoryBase,
  TJSONIndex
} from './differ'
import * as _ from 'underscore'
import {
  QueueRowFields,
  MutationTypes,
  TransitionStepTypes
} from 'asyncmachine/types'
import {
  MachineNode as NetworkMachineNode,
  Node as GraphNode,
  NODE_LINK_TYPE
} from '../../../network/network'

export class NetworkJsonFactory extends JointJsonFactory<
  INetworkJson,
  JointMachineNode,
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
    // TODO turn on once change detection works well
    return null
    // @ts-ignore
    if (prev_json && !this.changed_ids.has(id) && index[id]) {
      // @ts-ignore
      return prev_json.cells[index[id]]
    }
    return null
  }

  onNodeChange(index: number, skip_increment = false) {
    // TODO turn on once caching works well
    // const node = this.json.cells[index]
    // if (!skip_increment) {
    //   node.version++
    // }
    // this.json_index[node.id] = index
    // // TODO inherit from emitter and emit on self
    // this.network.emit('node-change', node.id, index)
  }

  addMachineNode(node: JointMachineNode) {
    return this.json.cells.push(node) - 1
  }

  addStateNode(node: TState) {
    const index = this.json.cells.push(node) - 1

    let machine = <JointMachineNode>this.getNodeById(node.parent)
    if (!machine.embeds.includes(node.id)) {
      machine.embeds.push(node.id)
      this.onNodeChange(this.json_index[machine.id], true)
    }

    return index
  }
  addLinkNode(node: TLink) {
    return this.json.cells.push(node) - 1
  }

  // TODO number of listeners
  createMachineNode(
    machine: NetworkMachineNode,
    prev_json: INetworkJson,
    index: TJSONIndex
  ): JointMachineNode {
    const id = machine.id
    // check cache
    const prev_version =
      prev_json && index[id] && prev_json.cells[index[id]].version

    // @ts-ignore
    const clock = machine.ticks
    // @ts-ignore
    const events: { length: number }[] = machine._events
    const is_touched =
      this.network.machines_during_transition.findIndex(m => m.id == id) > -1

    return {
      version: prev_version || 0,
      type: 'uml.State',
      name: machine.id,
      id: machine.id,
      embeds: [],
      z: 1,
      is_touched,
      queue: machine.queue().map(r => ({
        machine: (r[QueueRowFields.TARGET] || machine).id(true),
        states: r[QueueRowFields.STATES],
        type: r[QueueRowFields.STATE_CHANGE_TYPE],
        auto: r[QueueRowFields.AUTO]
      })),
      processing_queue: Boolean(machine.queue().length),
      listeners: Object.values(events || {})
        .map(e => e.length || 1)
        .reduce((count, num) => {
          return (count || 0) + num
        }, 0),
      ticks: Object.values(clock).reduce((r, n) => r + n)
    }
  }

  createStateNode(
    node: GraphNode,
    prev_json: INetworkJson,
    index: TJSONIndex
  ): TState {
    // TODO ID not from node.full_name ?!
    const id = this.getStateNodeId(node)
    // check cache
    const prev_version =
      prev_json && index[id] && prev_json.cells[index[id]].version
    const ui_name = this.stateUiName(node.name)
    return {
      version: prev_version || 0,
      type: 'fsa.State',
      id,
      parent: node.machine_id,
      attrs: { text: { text: ui_name } },
      z: 3,
      size: this.getNodeSize(ui_name),
      is_set: node.is_set,
      is_auto: node.is_auto,
      is_multi: node.is_multi,
      step_style: node.step_style
      // TODO turn on for caching
      // clock: node.clock
    }
  }

  createLinkNode(
    from: GraphNode,
    to: GraphNode,
    relation: NODE_LINK_TYPE,
    prev_json: INetworkJson,
    index: TJSONIndex
  ): TLink {
    const id = this.createLinkID(from, to, relation)
    const link = this.network.links.find(
      l => l.from_id === from.id && l.to_id === to.id
    )
    // check cache
    const prev_version =
      prev_json && index[id] && prev_json.cells[index[id]].version
    return {
      version: prev_version || 0,
      type: 'fsa.Arrow',
      smooth: true,
      source: {
        id: this.getStateNodeId(from)
      },
      target: {
        id: this.getStateNodeId(to)
      },
      relation,
      id,
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
      is_touched: link.is_touched
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
export class JsonDiffFactory extends JointDiffFactory<
  NetworkJsonFactory,
  INetworkJson
> {}

// TYPES

export type MachineId = string
export type MachineStateId = string
export type StateName = string

export type JointMachineNode = {
  version: number
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
  queue: { machine?: string; states: StateName[]; type: MutationTypes }[]
  processing_queue: boolean
  listeners: number
  ticks: number
}

export type TState = {
  version: number
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
  version: number
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
  relation: NODE_LINK_TYPE
}

export type JsonNode = JointMachineNode | TState | TLink

export interface INetworkJson {
  cells: Array<TState | TLink | JointMachineNode>
}

export type TCell = TState | TLink | JointMachineNode
