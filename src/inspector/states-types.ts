import {
  IState as IStateBase,
  IBind as IBindBase,
  IEmit as IEmitBase
} from 'asyncmachine/build/types'
import AsyncMachine from 'asyncmachine'
import {INetworkJson} from "../network/json/joint";
import {IPatch} from "../network/network";
import {STEP_TYPE_CHANGE} from "./inspector";

export { IBindBase, IEmitBase, AsyncMachine }

// ----- ----- ----- ----- -----
// STATE: InitializingLayoutWorker
// ----- ----- ----- ----- -----

/** machine.bind('InitializingLayoutWorker', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'InitializingLayoutWorker_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'InitializingLayoutWorker_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('InitializingLayoutWorker', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'InitializingLayoutWorker_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'InitializingLayoutWorker_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  InitializingLayoutWorker_enter /* param1: any?, param2: any? */?():
    | boolean
    | void
  InitializingLayoutWorker_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: LayoutWorkerReady
// ----- ----- ----- ----- -----

/** machine.bind('LayoutWorkerReady', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'LayoutWorkerReady_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'LayoutWorkerReady_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('LayoutWorkerReady', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'LayoutWorkerReady_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'LayoutWorkerReady_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  LayoutWorkerReady_enter /* param1: any?, param2: any? */?(): boolean | void
  LayoutWorkerReady_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: DOMReady
// ----- ----- ----- ----- -----

/** machine.bind('DOMReady', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'DOMReady_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'DOMReady_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('DOMReady', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'DOMReady_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'DOMReady_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  DOMReady_enter /* param1: any?, param2: any? */?(): boolean | void
  DOMReady_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: Rendering
// ----- ----- ----- ----- -----

/** machine.bind('Rendering', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'Rendering_enter',
    listener: (position?: number) => boolean | undefined,
    context?: Object
  ): this
  (
    event: 'Rendering_state',
    listener: (position?: number) => any,
    context?: Object
  ): this
}

/** machine.emit('Rendering', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'Rendering_enter', position?: number): boolean | void
  (event: 'Rendering_state', position?: number): boolean | void
}

/** Method declarations */
export interface ITransitions {
  Rendering_enter /* param1: any?, param2: any? */?(): boolean | void
  Rendering_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: Rendered
// ----- ----- ----- ----- -----

/** machine.bind('Rendered', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'Rendered_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'Rendered_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('Rendered', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'Rendered_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'Rendered_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  Rendered_enter /* param1: any?, param2: any? */?(): boolean | void
  Rendered_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: InitialRenderDone
// ----- ----- ----- ----- -----

/** machine.bind('InitialRenderDone', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'InitialRenderDone_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'InitialRenderDone_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('InitialRenderDone', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'InitialRenderDone_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'InitialRenderDone_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  InitialRenderDone_enter /* param1: any?, param2: any? */?(): boolean | void
  InitialRenderDone_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: Connecting
// ----- ----- ----- ----- -----

/** machine.bind('Connecting', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'Connecting_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'Connecting_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('Connecting', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'Connecting_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'Connecting_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  Connecting_enter /* param1: any?, param2: any? */?(): boolean | void
  Connecting_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: Connected
// ----- ----- ----- ----- -----

/** machine.bind('Connected', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'Connected_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'Connected_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('Connected', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'Connected_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'Connected_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  Connected_enter /* param1: any?, param2: any? */?(): boolean | void
  Connected_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: Disconnected
// ----- ----- ----- ----- -----

/** machine.bind('Disconnected', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'Disconnected_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'Disconnected_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('Disconnected', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'Disconnected_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'Disconnected_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  Disconnected_enter /* param1: any?, param2: any? */?(): boolean | void
  Disconnected_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: AutoplayOn
// ----- ----- ----- ----- -----

/** machine.bind('AutoplayOn', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'AutoplayOn_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'AutoplayOn_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('AutoplayOn', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'AutoplayOn_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'AutoplayOn_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  AutoplayOn_enter /* param1: any?, param2: any? */?(): boolean | void
  AutoplayOn_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: Playing
// ----- ----- ----- ----- -----

/** machine.bind('Playing', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'Playing_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'Playing_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('Playing', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'Playing_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'Playing_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  Playing_enter /* param1: any?, param2: any? */?(): boolean | void
  Playing_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: TimelineOnFirst
// ----- ----- ----- ----- -----

/** machine.bind('TimelineOnFirst', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'TimelineOnFirst_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'TimelineOnFirst_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('TimelineOnFirst', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'TimelineOnFirst_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'TimelineOnFirst_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  TimelineOnFirst_enter /* param1: any?, param2: any? */?(): boolean | void
  TimelineOnFirst_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: TimelineOnBetween
// ----- ----- ----- ----- -----

/** machine.bind('TimelineOnBetween', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'TimelineOnBetween_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'TimelineOnBetween_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('TimelineOnBetween', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'TimelineOnBetween_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'TimelineOnBetween_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  TimelineOnBetween_enter /* param1: any?, param2: any? */?(): boolean | void
  TimelineOnBetween_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: TimelineOnLast
// ----- ----- ----- ----- -----

/** machine.bind('TimelineOnLast', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'TimelineOnLast_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'TimelineOnLast_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('TimelineOnLast', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'TimelineOnLast_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'TimelineOnLast_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  TimelineOnLast_enter /* param1: any?, param2: any? */?(): boolean | void
  TimelineOnLast_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: StepByStates
// ----- ----- ----- ----- -----

/** machine.bind('StepByStates', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'StepByStates_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'StepByStates_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('StepByStates', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'StepByStates_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'StepByStates_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  StepByStates_enter /* param1: any?, param2: any? */?(): boolean | void
  StepByStates_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: StepByTransitions
// ----- ----- ----- ----- -----

/** machine.bind('StepByTransitions', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'StepByTransitions_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'StepByTransitions_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('StepByTransitions', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'StepByTransitions_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'StepByTransitions_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  StepByTransitions_enter /* param1: any?, param2: any? */?(): boolean | void
  StepByTransitions_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: StepBySteps
// ----- ----- ----- ----- -----

/** machine.bind('StepBySteps', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'StepBySteps_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'StepBySteps_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('StepBySteps', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'StepBySteps_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'StepBySteps_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  StepBySteps_enter /* param1: any?, param2: any? */?(): boolean | void
  StepBySteps_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: StepByNestedTransitions
// ----- ----- ----- ----- -----

/** machine.bind('StepByNestedTransitions', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'StepByNestedTransitions_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'StepByNestedTransitions_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('StepByNestedTransitions', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'StepByNestedTransitions_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'StepByNestedTransitions_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  StepByNestedTransitions_enter /* param1: any?, param2: any? */?():
    | boolean
    | void
  StepByNestedTransitions_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: StepByLive
// ----- ----- ----- ----- -----

/** machine.bind('StepByLive', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'StepByLive_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'StepByLive_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('StepByLive', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'StepByLive_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'StepByLive_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  StepByLive_enter /* param1: any?, param2: any? */?(): boolean | void
  StepByLive_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: PlayStopClicked
// ----- ----- ----- ----- -----

/** machine.bind('PlayStopClicked', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'PlayStopClicked_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'PlayStopClicked_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('PlayStopClicked', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'PlayStopClicked_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'PlayStopClicked_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  PlayStopClicked_enter /* param1: any?, param2: any? */?(): boolean | void
  PlayStopClicked_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: TimelineScrolled
// ----- ----- ----- ----- -----

/** machine.bind('TimelineScrolled', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'TimelineScrolled_enter',
    listener: (value: number) => boolean | undefined,
    context?: Object
  ): this
  (
    event: 'TimelineScrolled_state',
    listener: (value: number) => any,
    context?: Object
  ): this
}

/** machine.emit('TimelineScrolled', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'TimelineScrolled_enter', value: number): boolean | void
  (event: 'TimelineScrolled_state', value: number): boolean | void
}

/** Method declarations */
export interface ITransitions {
  TimelineScrolled_enter?(value: number): boolean | void
  TimelineScrolled_state?(value: number):
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: StepTypeChanged
// ----- ----- ----- ----- -----

/** machine.bind('StepTypeChanged', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'StepTypeChanged_enter',
    listener: (value: STEP_TYPE_CHANGE) => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'StepTypeChanged_state',
    listener: (value: STEP_TYPE_CHANGE) => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('StepTypeChanged', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'StepTypeChanged_enter', value: STEP_TYPE_CHANGE):
    | boolean
    | void
  (event: 'StepTypeChanged_state', value: STEP_TYPE_CHANGE):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  StepTypeChanged_enter?(value: STEP_TYPE_CHANGE): boolean | void
  StepTypeChanged_state?(value: STEP_TYPE_CHANGE):
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: FullSync
// ----- ----- ----- ----- -----

/** machine.bind('FullSync', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'FullSync_enter',
    listener: (graph_data: INetworkJson) => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'FullSync_state',
    listener: (graph_data: INetworkJson) => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('FullSync', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'FullSync_enter', graph_data: INetworkJson): boolean | void
  (event: 'FullSync_state', graph_data: INetworkJson): boolean | void
}

/** Method declarations */
export interface ITransitions {
  FullSync_enter?(graph_data: INetworkJson): boolean | void
  FullSync_state?(graph_data: INetworkJson):
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: DiffSync
// ----- ----- ----- ----- -----

/** machine.bind('DiffSync', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'DiffSync_enter',
    listener: (patch: IPatch) => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'DiffSync_state',
    listener: (patch: IPatch) => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('DiffSync', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'DiffSync_enter', patch: IPatch): boolean | void
  (event: 'DiffSync_state', patch: IPatch): boolean | void
}

/** Method declarations */
export interface ITransitions {
  DiffSync_enter?(patch: IPatch): boolean | void
  DiffSync_state?(patch: IPatch):
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: LegendVisible
// ----- ----- ----- ----- -----

/** machine.bind('LegendVisible', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'LegendVisible_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'LegendVisible_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('LegendVisible', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'LegendVisible_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'LegendVisible_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  LegendVisible_enter /* param1: any?, param2: any? */?(): boolean | void
  LegendVisible_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: ConnectionDialogVisible
// ----- ----- ----- ----- -----

/** machine.bind('ConnectionDialogVisible', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'ConnectionDialogVisible_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'ConnectionDialogVisible_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('ConnectionDialogVisible', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'ConnectionDialogVisible_enter' /*, param1: any?, param2: any? */):
    | boolean
    | void
  (event: 'ConnectionDialogVisible_state' /*, param1: any?, param2: any? */):
    | boolean
    | void
}

/** Method declarations */
export interface ITransitions {
  ConnectionDialogVisible_enter /* param1: any?, param2: any? */?():
    | boolean
    | void
  ConnectionDialogVisible_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- ----- ----- -----
// STATE: LocalLogger
// ----- ----- ----- ----- -----

/** machine.bind('LocalLogger', (param1, param2) => {}) */
export interface IBind extends IBindBase {
  (
    event: 'LocalLogger_enter',
    listener: () => /* param1: any?, param2: any? */ boolean | undefined,
    context?: Object
  ): this
  (
    event: 'LocalLogger_state',
    listener: () => /* param1: any?, param2: any? */ any,
    context?: Object
  ): this
}

/** machine.emit('LocalLogger', param1, param2) */
export interface IEmit extends IEmitBase {
  (event: 'LocalLogger_enter' /*, param1: any?, param2: any? */): boolean | void
  (event: 'LocalLogger_state' /*, param1: any?, param2: any? */): boolean | void
}

/** Method declarations */
export interface ITransitions {
  LocalLogger_enter /* param1: any?, param2: any? */?(): boolean | void
  LocalLogger_state /* param1: any?, param2: any? */?():
    | boolean
    | void
    | Promise<boolean | void>
}

// ----- ----- -----
// GENERAL TYPES
// ----- ----- -----

/** All the possible transition methods the machine can define */
export interface ITransitions {
  Exception_InitializingLayoutWorker?(): boolean | void
  Exception_LayoutWorkerReady?(): boolean | void
  Exception_DOMReady?(): boolean | void
  Exception_Rendering?(): boolean | void
  Exception_Rendered?(): boolean | void
  Exception_InitialRenderDone?(): boolean | void
  Exception_Connecting?(): boolean | void
  Exception_Connected?(): boolean | void
  Exception_Disconnected?(): boolean | void
  Exception_AutoplayOn?(): boolean | void
  Exception_Playing?(): boolean | void
  Exception_TimelineOnFirst?(): boolean | void
  Exception_TimelineOnBetween?(): boolean | void
  Exception_TimelineOnLast?(): boolean | void
  Exception_StepByStates?(): boolean | void
  Exception_StepByTransitions?(): boolean | void
  Exception_StepBySteps?(): boolean | void
  Exception_StepByNestedTransitions?(): boolean | void
  Exception_StepByLive?(): boolean | void
  Exception_PlayStopClicked?(): boolean | void
  Exception_TimelineScrolled?(): boolean | void
  Exception_StepTypeChanged?(): boolean | void
  Exception_FullSync?(): boolean | void
  Exception_DiffSync?(): boolean | void
  Exception_LegendVisible?(): boolean | void
  Exception_ConnectionDialogVisible?(): boolean | void
  Exception_LocalLogger?(): boolean | void
  Exception_exit?(): boolean | void
  Exception_end?(): boolean | void
  InitializingLayoutWorker_Exception?(): boolean | void
  InitializingLayoutWorker_Any?(): boolean | void
  InitializingLayoutWorker_LayoutWorkerReady?(): boolean | void
  InitializingLayoutWorker_DOMReady?(): boolean | void
  InitializingLayoutWorker_Rendering?(): boolean | void
  InitializingLayoutWorker_Rendered?(): boolean | void
  InitializingLayoutWorker_InitialRenderDone?(): boolean | void
  InitializingLayoutWorker_Connecting?(): boolean | void
  InitializingLayoutWorker_Connected?(): boolean | void
  InitializingLayoutWorker_Disconnected?(): boolean | void
  InitializingLayoutWorker_AutoplayOn?(): boolean | void
  InitializingLayoutWorker_Playing?(): boolean | void
  InitializingLayoutWorker_TimelineOnFirst?(): boolean | void
  InitializingLayoutWorker_TimelineOnBetween?(): boolean | void
  InitializingLayoutWorker_TimelineOnLast?(): boolean | void
  InitializingLayoutWorker_StepByStates?(): boolean | void
  InitializingLayoutWorker_StepByTransitions?(): boolean | void
  InitializingLayoutWorker_StepBySteps?(): boolean | void
  InitializingLayoutWorker_StepByNestedTransitions?(): boolean | void
  InitializingLayoutWorker_StepByLive?(): boolean | void
  InitializingLayoutWorker_PlayStopClicked?(): boolean | void
  InitializingLayoutWorker_TimelineScrolled?(): boolean | void
  InitializingLayoutWorker_StepTypeChanged?(): boolean | void
  InitializingLayoutWorker_FullSync?(): boolean | void
  InitializingLayoutWorker_DiffSync?(): boolean | void
  InitializingLayoutWorker_LegendVisible?(): boolean | void
  InitializingLayoutWorker_ConnectionDialogVisible?(): boolean | void
  InitializingLayoutWorker_LocalLogger?(): boolean | void
  InitializingLayoutWorker_Exception?(): boolean | void
  InitializingLayoutWorker_exit?(): boolean | void
  InitializingLayoutWorker_end?(): boolean | void
  LayoutWorkerReady_Exception?(): boolean | void
  LayoutWorkerReady_InitializingLayoutWorker?(): boolean | void
  LayoutWorkerReady_Any?(): boolean | void
  LayoutWorkerReady_DOMReady?(): boolean | void
  LayoutWorkerReady_Rendering?(): boolean | void
  LayoutWorkerReady_Rendered?(): boolean | void
  LayoutWorkerReady_InitialRenderDone?(): boolean | void
  LayoutWorkerReady_Connecting?(): boolean | void
  LayoutWorkerReady_Connected?(): boolean | void
  LayoutWorkerReady_Disconnected?(): boolean | void
  LayoutWorkerReady_AutoplayOn?(): boolean | void
  LayoutWorkerReady_Playing?(): boolean | void
  LayoutWorkerReady_TimelineOnFirst?(): boolean | void
  LayoutWorkerReady_TimelineOnBetween?(): boolean | void
  LayoutWorkerReady_TimelineOnLast?(): boolean | void
  LayoutWorkerReady_StepByStates?(): boolean | void
  LayoutWorkerReady_StepByTransitions?(): boolean | void
  LayoutWorkerReady_StepBySteps?(): boolean | void
  LayoutWorkerReady_StepByNestedTransitions?(): boolean | void
  LayoutWorkerReady_StepByLive?(): boolean | void
  LayoutWorkerReady_PlayStopClicked?(): boolean | void
  LayoutWorkerReady_TimelineScrolled?(): boolean | void
  LayoutWorkerReady_StepTypeChanged?(): boolean | void
  LayoutWorkerReady_FullSync?(): boolean | void
  LayoutWorkerReady_DiffSync?(): boolean | void
  LayoutWorkerReady_LegendVisible?(): boolean | void
  LayoutWorkerReady_ConnectionDialogVisible?(): boolean | void
  LayoutWorkerReady_LocalLogger?(): boolean | void
  LayoutWorkerReady_Exception?(): boolean | void
  LayoutWorkerReady_exit?(): boolean | void
  LayoutWorkerReady_end?(): boolean | void
  DOMReady_Exception?(): boolean | void
  DOMReady_InitializingLayoutWorker?(): boolean | void
  DOMReady_LayoutWorkerReady?(): boolean | void
  DOMReady_Any?(): boolean | void
  DOMReady_Rendering?(): boolean | void
  DOMReady_Rendered?(): boolean | void
  DOMReady_InitialRenderDone?(): boolean | void
  DOMReady_Connecting?(): boolean | void
  DOMReady_Connected?(): boolean | void
  DOMReady_Disconnected?(): boolean | void
  DOMReady_AutoplayOn?(): boolean | void
  DOMReady_Playing?(): boolean | void
  DOMReady_TimelineOnFirst?(): boolean | void
  DOMReady_TimelineOnBetween?(): boolean | void
  DOMReady_TimelineOnLast?(): boolean | void
  DOMReady_StepByStates?(): boolean | void
  DOMReady_StepByTransitions?(): boolean | void
  DOMReady_StepBySteps?(): boolean | void
  DOMReady_StepByNestedTransitions?(): boolean | void
  DOMReady_StepByLive?(): boolean | void
  DOMReady_PlayStopClicked?(): boolean | void
  DOMReady_TimelineScrolled?(): boolean | void
  DOMReady_StepTypeChanged?(): boolean | void
  DOMReady_FullSync?(): boolean | void
  DOMReady_DiffSync?(): boolean | void
  DOMReady_LegendVisible?(): boolean | void
  DOMReady_ConnectionDialogVisible?(): boolean | void
  DOMReady_LocalLogger?(): boolean | void
  DOMReady_Exception?(): boolean | void
  DOMReady_exit?(): boolean | void
  DOMReady_end?(): boolean | void
  Rendering_Exception?(): boolean | void
  Rendering_InitializingLayoutWorker?(): boolean | void
  Rendering_LayoutWorkerReady?(): boolean | void
  Rendering_DOMReady?(): boolean | void
  Rendering_Any?(): boolean | void
  Rendering_Rendered?(): boolean | void
  Rendering_InitialRenderDone?(): boolean | void
  Rendering_Connecting?(): boolean | void
  Rendering_Connected?(): boolean | void
  Rendering_Disconnected?(): boolean | void
  Rendering_AutoplayOn?(): boolean | void
  Rendering_Playing?(): boolean | void
  Rendering_TimelineOnFirst?(): boolean | void
  Rendering_TimelineOnBetween?(): boolean | void
  Rendering_TimelineOnLast?(): boolean | void
  Rendering_StepByStates?(): boolean | void
  Rendering_StepByTransitions?(): boolean | void
  Rendering_StepBySteps?(): boolean | void
  Rendering_StepByNestedTransitions?(): boolean | void
  Rendering_StepByLive?(): boolean | void
  Rendering_PlayStopClicked?(): boolean | void
  Rendering_TimelineScrolled?(): boolean | void
  Rendering_StepTypeChanged?(): boolean | void
  Rendering_FullSync?(): boolean | void
  Rendering_DiffSync?(): boolean | void
  Rendering_LegendVisible?(): boolean | void
  Rendering_ConnectionDialogVisible?(): boolean | void
  Rendering_LocalLogger?(): boolean | void
  Rendering_Exception?(): boolean | void
  Rendering_exit?(): boolean | void
  Rendering_end?(): boolean | void
  Rendered_Exception?(): boolean | void
  Rendered_InitializingLayoutWorker?(): boolean | void
  Rendered_LayoutWorkerReady?(): boolean | void
  Rendered_DOMReady?(): boolean | void
  Rendered_Rendering?(): boolean | void
  Rendered_Any?(): boolean | void
  Rendered_InitialRenderDone?(): boolean | void
  Rendered_Connecting?(): boolean | void
  Rendered_Connected?(): boolean | void
  Rendered_Disconnected?(): boolean | void
  Rendered_AutoplayOn?(): boolean | void
  Rendered_Playing?(): boolean | void
  Rendered_TimelineOnFirst?(): boolean | void
  Rendered_TimelineOnBetween?(): boolean | void
  Rendered_TimelineOnLast?(): boolean | void
  Rendered_StepByStates?(): boolean | void
  Rendered_StepByTransitions?(): boolean | void
  Rendered_StepBySteps?(): boolean | void
  Rendered_StepByNestedTransitions?(): boolean | void
  Rendered_StepByLive?(): boolean | void
  Rendered_PlayStopClicked?(): boolean | void
  Rendered_TimelineScrolled?(): boolean | void
  Rendered_StepTypeChanged?(): boolean | void
  Rendered_FullSync?(): boolean | void
  Rendered_DiffSync?(): boolean | void
  Rendered_LegendVisible?(): boolean | void
  Rendered_ConnectionDialogVisible?(): boolean | void
  Rendered_LocalLogger?(): boolean | void
  Rendered_Exception?(): boolean | void
  Rendered_exit?(): boolean | void
  Rendered_end?(): boolean | void
  InitialRenderDone_Exception?(): boolean | void
  InitialRenderDone_InitializingLayoutWorker?(): boolean | void
  InitialRenderDone_LayoutWorkerReady?(): boolean | void
  InitialRenderDone_DOMReady?(): boolean | void
  InitialRenderDone_Rendering?(): boolean | void
  InitialRenderDone_Rendered?(): boolean | void
  InitialRenderDone_Any?(): boolean | void
  InitialRenderDone_Connecting?(): boolean | void
  InitialRenderDone_Connected?(): boolean | void
  InitialRenderDone_Disconnected?(): boolean | void
  InitialRenderDone_AutoplayOn?(): boolean | void
  InitialRenderDone_Playing?(): boolean | void
  InitialRenderDone_TimelineOnFirst?(): boolean | void
  InitialRenderDone_TimelineOnBetween?(): boolean | void
  InitialRenderDone_TimelineOnLast?(): boolean | void
  InitialRenderDone_StepByStates?(): boolean | void
  InitialRenderDone_StepByTransitions?(): boolean | void
  InitialRenderDone_StepBySteps?(): boolean | void
  InitialRenderDone_StepByNestedTransitions?(): boolean | void
  InitialRenderDone_StepByLive?(): boolean | void
  InitialRenderDone_PlayStopClicked?(): boolean | void
  InitialRenderDone_TimelineScrolled?(): boolean | void
  InitialRenderDone_StepTypeChanged?(): boolean | void
  InitialRenderDone_FullSync?(): boolean | void
  InitialRenderDone_DiffSync?(): boolean | void
  InitialRenderDone_LegendVisible?(): boolean | void
  InitialRenderDone_ConnectionDialogVisible?(): boolean | void
  InitialRenderDone_LocalLogger?(): boolean | void
  InitialRenderDone_Exception?(): boolean | void
  InitialRenderDone_exit?(): boolean | void
  InitialRenderDone_end?(): boolean | void
  Connecting_Exception?(): boolean | void
  Connecting_InitializingLayoutWorker?(): boolean | void
  Connecting_LayoutWorkerReady?(): boolean | void
  Connecting_DOMReady?(): boolean | void
  Connecting_Rendering?(): boolean | void
  Connecting_Rendered?(): boolean | void
  Connecting_InitialRenderDone?(): boolean | void
  Connecting_Any?(): boolean | void
  Connecting_Connected?(): boolean | void
  Connecting_Disconnected?(): boolean | void
  Connecting_AutoplayOn?(): boolean | void
  Connecting_Playing?(): boolean | void
  Connecting_TimelineOnFirst?(): boolean | void
  Connecting_TimelineOnBetween?(): boolean | void
  Connecting_TimelineOnLast?(): boolean | void
  Connecting_StepByStates?(): boolean | void
  Connecting_StepByTransitions?(): boolean | void
  Connecting_StepBySteps?(): boolean | void
  Connecting_StepByNestedTransitions?(): boolean | void
  Connecting_StepByLive?(): boolean | void
  Connecting_PlayStopClicked?(): boolean | void
  Connecting_TimelineScrolled?(): boolean | void
  Connecting_StepTypeChanged?(): boolean | void
  Connecting_FullSync?(): boolean | void
  Connecting_DiffSync?(): boolean | void
  Connecting_LegendVisible?(): boolean | void
  Connecting_ConnectionDialogVisible?(): boolean | void
  Connecting_LocalLogger?(): boolean | void
  Connecting_Exception?(): boolean | void
  Connecting_exit?(): boolean | void
  Connecting_end?(): boolean | void
  Connected_Exception?(): boolean | void
  Connected_InitializingLayoutWorker?(): boolean | void
  Connected_LayoutWorkerReady?(): boolean | void
  Connected_DOMReady?(): boolean | void
  Connected_Rendering?(): boolean | void
  Connected_Rendered?(): boolean | void
  Connected_InitialRenderDone?(): boolean | void
  Connected_Connecting?(): boolean | void
  Connected_Any?(): boolean | void
  Connected_Disconnected?(): boolean | void
  Connected_AutoplayOn?(): boolean | void
  Connected_Playing?(): boolean | void
  Connected_TimelineOnFirst?(): boolean | void
  Connected_TimelineOnBetween?(): boolean | void
  Connected_TimelineOnLast?(): boolean | void
  Connected_StepByStates?(): boolean | void
  Connected_StepByTransitions?(): boolean | void
  Connected_StepBySteps?(): boolean | void
  Connected_StepByNestedTransitions?(): boolean | void
  Connected_StepByLive?(): boolean | void
  Connected_PlayStopClicked?(): boolean | void
  Connected_TimelineScrolled?(): boolean | void
  Connected_StepTypeChanged?(): boolean | void
  Connected_FullSync?(): boolean | void
  Connected_DiffSync?(): boolean | void
  Connected_LegendVisible?(): boolean | void
  Connected_ConnectionDialogVisible?(): boolean | void
  Connected_LocalLogger?(): boolean | void
  Connected_Exception?(): boolean | void
  Connected_exit?(): boolean | void
  Connected_end?(): boolean | void
  Disconnected_Exception?(): boolean | void
  Disconnected_InitializingLayoutWorker?(): boolean | void
  Disconnected_LayoutWorkerReady?(): boolean | void
  Disconnected_DOMReady?(): boolean | void
  Disconnected_Rendering?(): boolean | void
  Disconnected_Rendered?(): boolean | void
  Disconnected_InitialRenderDone?(): boolean | void
  Disconnected_Connecting?(): boolean | void
  Disconnected_Connected?(): boolean | void
  Disconnected_Any?(): boolean | void
  Disconnected_AutoplayOn?(): boolean | void
  Disconnected_Playing?(): boolean | void
  Disconnected_TimelineOnFirst?(): boolean | void
  Disconnected_TimelineOnBetween?(): boolean | void
  Disconnected_TimelineOnLast?(): boolean | void
  Disconnected_StepByStates?(): boolean | void
  Disconnected_StepByTransitions?(): boolean | void
  Disconnected_StepBySteps?(): boolean | void
  Disconnected_StepByNestedTransitions?(): boolean | void
  Disconnected_StepByLive?(): boolean | void
  Disconnected_PlayStopClicked?(): boolean | void
  Disconnected_TimelineScrolled?(): boolean | void
  Disconnected_StepTypeChanged?(): boolean | void
  Disconnected_FullSync?(): boolean | void
  Disconnected_DiffSync?(): boolean | void
  Disconnected_LegendVisible?(): boolean | void
  Disconnected_ConnectionDialogVisible?(): boolean | void
  Disconnected_LocalLogger?(): boolean | void
  Disconnected_Exception?(): boolean | void
  Disconnected_exit?(): boolean | void
  Disconnected_end?(): boolean | void
  AutoplayOn_Exception?(): boolean | void
  AutoplayOn_InitializingLayoutWorker?(): boolean | void
  AutoplayOn_LayoutWorkerReady?(): boolean | void
  AutoplayOn_DOMReady?(): boolean | void
  AutoplayOn_Rendering?(): boolean | void
  AutoplayOn_Rendered?(): boolean | void
  AutoplayOn_InitialRenderDone?(): boolean | void
  AutoplayOn_Connecting?(): boolean | void
  AutoplayOn_Connected?(): boolean | void
  AutoplayOn_Disconnected?(): boolean | void
  AutoplayOn_Any?(): boolean | void
  AutoplayOn_Playing?(): boolean | void
  AutoplayOn_TimelineOnFirst?(): boolean | void
  AutoplayOn_TimelineOnBetween?(): boolean | void
  AutoplayOn_TimelineOnLast?(): boolean | void
  AutoplayOn_StepByStates?(): boolean | void
  AutoplayOn_StepByTransitions?(): boolean | void
  AutoplayOn_StepBySteps?(): boolean | void
  AutoplayOn_StepByNestedTransitions?(): boolean | void
  AutoplayOn_StepByLive?(): boolean | void
  AutoplayOn_PlayStopClicked?(): boolean | void
  AutoplayOn_TimelineScrolled?(): boolean | void
  AutoplayOn_StepTypeChanged?(): boolean | void
  AutoplayOn_FullSync?(): boolean | void
  AutoplayOn_DiffSync?(): boolean | void
  AutoplayOn_LegendVisible?(): boolean | void
  AutoplayOn_ConnectionDialogVisible?(): boolean | void
  AutoplayOn_LocalLogger?(): boolean | void
  AutoplayOn_Exception?(): boolean | void
  AutoplayOn_exit?(): boolean | void
  AutoplayOn_end?(): boolean | void
  Playing_Exception?(): boolean | void
  Playing_InitializingLayoutWorker?(): boolean | void
  Playing_LayoutWorkerReady?(): boolean | void
  Playing_DOMReady?(): boolean | void
  Playing_Rendering?(): boolean | void
  Playing_Rendered?(): boolean | void
  Playing_InitialRenderDone?(): boolean | void
  Playing_Connecting?(): boolean | void
  Playing_Connected?(): boolean | void
  Playing_Disconnected?(): boolean | void
  Playing_AutoplayOn?(): boolean | void
  Playing_Any?(): boolean | void
  Playing_TimelineOnFirst?(): boolean | void
  Playing_TimelineOnBetween?(): boolean | void
  Playing_TimelineOnLast?(): boolean | void
  Playing_StepByStates?(): boolean | void
  Playing_StepByTransitions?(): boolean | void
  Playing_StepBySteps?(): boolean | void
  Playing_StepByNestedTransitions?(): boolean | void
  Playing_StepByLive?(): boolean | void
  Playing_PlayStopClicked?(): boolean | void
  Playing_TimelineScrolled?(): boolean | void
  Playing_StepTypeChanged?(): boolean | void
  Playing_FullSync?(): boolean | void
  Playing_DiffSync?(): boolean | void
  Playing_LegendVisible?(): boolean | void
  Playing_ConnectionDialogVisible?(): boolean | void
  Playing_LocalLogger?(): boolean | void
  Playing_Exception?(): boolean | void
  Playing_exit?(): boolean | void
  Playing_end?(): boolean | void
  TimelineOnFirst_Exception?(): boolean | void
  TimelineOnFirst_InitializingLayoutWorker?(): boolean | void
  TimelineOnFirst_LayoutWorkerReady?(): boolean | void
  TimelineOnFirst_DOMReady?(): boolean | void
  TimelineOnFirst_Rendering?(): boolean | void
  TimelineOnFirst_Rendered?(): boolean | void
  TimelineOnFirst_InitialRenderDone?(): boolean | void
  TimelineOnFirst_Connecting?(): boolean | void
  TimelineOnFirst_Connected?(): boolean | void
  TimelineOnFirst_Disconnected?(): boolean | void
  TimelineOnFirst_AutoplayOn?(): boolean | void
  TimelineOnFirst_Playing?(): boolean | void
  TimelineOnFirst_Any?(): boolean | void
  TimelineOnFirst_TimelineOnBetween?(): boolean | void
  TimelineOnFirst_TimelineOnLast?(): boolean | void
  TimelineOnFirst_StepByStates?(): boolean | void
  TimelineOnFirst_StepByTransitions?(): boolean | void
  TimelineOnFirst_StepBySteps?(): boolean | void
  TimelineOnFirst_StepByNestedTransitions?(): boolean | void
  TimelineOnFirst_StepByLive?(): boolean | void
  TimelineOnFirst_PlayStopClicked?(): boolean | void
  TimelineOnFirst_TimelineScrolled?(): boolean | void
  TimelineOnFirst_StepTypeChanged?(): boolean | void
  TimelineOnFirst_FullSync?(): boolean | void
  TimelineOnFirst_DiffSync?(): boolean | void
  TimelineOnFirst_LegendVisible?(): boolean | void
  TimelineOnFirst_ConnectionDialogVisible?(): boolean | void
  TimelineOnFirst_LocalLogger?(): boolean | void
  TimelineOnFirst_Exception?(): boolean | void
  TimelineOnFirst_exit?(): boolean | void
  TimelineOnFirst_end?(): boolean | void
  TimelineOnBetween_Exception?(): boolean | void
  TimelineOnBetween_InitializingLayoutWorker?(): boolean | void
  TimelineOnBetween_LayoutWorkerReady?(): boolean | void
  TimelineOnBetween_DOMReady?(): boolean | void
  TimelineOnBetween_Rendering?(): boolean | void
  TimelineOnBetween_Rendered?(): boolean | void
  TimelineOnBetween_InitialRenderDone?(): boolean | void
  TimelineOnBetween_Connecting?(): boolean | void
  TimelineOnBetween_Connected?(): boolean | void
  TimelineOnBetween_Disconnected?(): boolean | void
  TimelineOnBetween_AutoplayOn?(): boolean | void
  TimelineOnBetween_Playing?(): boolean | void
  TimelineOnBetween_TimelineOnFirst?(): boolean | void
  TimelineOnBetween_Any?(): boolean | void
  TimelineOnBetween_TimelineOnLast?(): boolean | void
  TimelineOnBetween_StepByStates?(): boolean | void
  TimelineOnBetween_StepByTransitions?(): boolean | void
  TimelineOnBetween_StepBySteps?(): boolean | void
  TimelineOnBetween_StepByNestedTransitions?(): boolean | void
  TimelineOnBetween_StepByLive?(): boolean | void
  TimelineOnBetween_PlayStopClicked?(): boolean | void
  TimelineOnBetween_TimelineScrolled?(): boolean | void
  TimelineOnBetween_StepTypeChanged?(): boolean | void
  TimelineOnBetween_FullSync?(): boolean | void
  TimelineOnBetween_DiffSync?(): boolean | void
  TimelineOnBetween_LegendVisible?(): boolean | void
  TimelineOnBetween_ConnectionDialogVisible?(): boolean | void
  TimelineOnBetween_LocalLogger?(): boolean | void
  TimelineOnBetween_Exception?(): boolean | void
  TimelineOnBetween_exit?(): boolean | void
  TimelineOnBetween_end?(): boolean | void
  TimelineOnLast_Exception?(): boolean | void
  TimelineOnLast_InitializingLayoutWorker?(): boolean | void
  TimelineOnLast_LayoutWorkerReady?(): boolean | void
  TimelineOnLast_DOMReady?(): boolean | void
  TimelineOnLast_Rendering?(): boolean | void
  TimelineOnLast_Rendered?(): boolean | void
  TimelineOnLast_InitialRenderDone?(): boolean | void
  TimelineOnLast_Connecting?(): boolean | void
  TimelineOnLast_Connected?(): boolean | void
  TimelineOnLast_Disconnected?(): boolean | void
  TimelineOnLast_AutoplayOn?(): boolean | void
  TimelineOnLast_Playing?(): boolean | void
  TimelineOnLast_TimelineOnFirst?(): boolean | void
  TimelineOnLast_TimelineOnBetween?(): boolean | void
  TimelineOnLast_Any?(): boolean | void
  TimelineOnLast_StepByStates?(): boolean | void
  TimelineOnLast_StepByTransitions?(): boolean | void
  TimelineOnLast_StepBySteps?(): boolean | void
  TimelineOnLast_StepByNestedTransitions?(): boolean | void
  TimelineOnLast_StepByLive?(): boolean | void
  TimelineOnLast_PlayStopClicked?(): boolean | void
  TimelineOnLast_TimelineScrolled?(): boolean | void
  TimelineOnLast_StepTypeChanged?(): boolean | void
  TimelineOnLast_FullSync?(): boolean | void
  TimelineOnLast_DiffSync?(): boolean | void
  TimelineOnLast_LegendVisible?(): boolean | void
  TimelineOnLast_ConnectionDialogVisible?(): boolean | void
  TimelineOnLast_LocalLogger?(): boolean | void
  TimelineOnLast_Exception?(): boolean | void
  TimelineOnLast_exit?(): boolean | void
  TimelineOnLast_end?(): boolean | void
  StepByStates_Exception?(): boolean | void
  StepByStates_InitializingLayoutWorker?(): boolean | void
  StepByStates_LayoutWorkerReady?(): boolean | void
  StepByStates_DOMReady?(): boolean | void
  StepByStates_Rendering?(): boolean | void
  StepByStates_Rendered?(): boolean | void
  StepByStates_InitialRenderDone?(): boolean | void
  StepByStates_Connecting?(): boolean | void
  StepByStates_Connected?(): boolean | void
  StepByStates_Disconnected?(): boolean | void
  StepByStates_AutoplayOn?(): boolean | void
  StepByStates_Playing?(): boolean | void
  StepByStates_TimelineOnFirst?(): boolean | void
  StepByStates_TimelineOnBetween?(): boolean | void
  StepByStates_TimelineOnLast?(): boolean | void
  StepByStates_Any?(): boolean | void
  StepByStates_StepByTransitions?(): boolean | void
  StepByStates_StepBySteps?(): boolean | void
  StepByStates_StepByNestedTransitions?(): boolean | void
  StepByStates_StepByLive?(): boolean | void
  StepByStates_PlayStopClicked?(): boolean | void
  StepByStates_TimelineScrolled?(): boolean | void
  StepByStates_StepTypeChanged?(): boolean | void
  StepByStates_FullSync?(): boolean | void
  StepByStates_DiffSync?(): boolean | void
  StepByStates_LegendVisible?(): boolean | void
  StepByStates_ConnectionDialogVisible?(): boolean | void
  StepByStates_LocalLogger?(): boolean | void
  StepByStates_Exception?(): boolean | void
  StepByStates_exit?(): boolean | void
  StepByStates_end?(): boolean | void
  StepByTransitions_Exception?(): boolean | void
  StepByTransitions_InitializingLayoutWorker?(): boolean | void
  StepByTransitions_LayoutWorkerReady?(): boolean | void
  StepByTransitions_DOMReady?(): boolean | void
  StepByTransitions_Rendering?(): boolean | void
  StepByTransitions_Rendered?(): boolean | void
  StepByTransitions_InitialRenderDone?(): boolean | void
  StepByTransitions_Connecting?(): boolean | void
  StepByTransitions_Connected?(): boolean | void
  StepByTransitions_Disconnected?(): boolean | void
  StepByTransitions_AutoplayOn?(): boolean | void
  StepByTransitions_Playing?(): boolean | void
  StepByTransitions_TimelineOnFirst?(): boolean | void
  StepByTransitions_TimelineOnBetween?(): boolean | void
  StepByTransitions_TimelineOnLast?(): boolean | void
  StepByTransitions_StepByStates?(): boolean | void
  StepByTransitions_Any?(): boolean | void
  StepByTransitions_StepBySteps?(): boolean | void
  StepByTransitions_StepByNestedTransitions?(): boolean | void
  StepByTransitions_StepByLive?(): boolean | void
  StepByTransitions_PlayStopClicked?(): boolean | void
  StepByTransitions_TimelineScrolled?(): boolean | void
  StepByTransitions_StepTypeChanged?(): boolean | void
  StepByTransitions_FullSync?(): boolean | void
  StepByTransitions_DiffSync?(): boolean | void
  StepByTransitions_LegendVisible?(): boolean | void
  StepByTransitions_ConnectionDialogVisible?(): boolean | void
  StepByTransitions_LocalLogger?(): boolean | void
  StepByTransitions_Exception?(): boolean | void
  StepByTransitions_exit?(): boolean | void
  StepByTransitions_end?(): boolean | void
  StepBySteps_Exception?(): boolean | void
  StepBySteps_InitializingLayoutWorker?(): boolean | void
  StepBySteps_LayoutWorkerReady?(): boolean | void
  StepBySteps_DOMReady?(): boolean | void
  StepBySteps_Rendering?(): boolean | void
  StepBySteps_Rendered?(): boolean | void
  StepBySteps_InitialRenderDone?(): boolean | void
  StepBySteps_Connecting?(): boolean | void
  StepBySteps_Connected?(): boolean | void
  StepBySteps_Disconnected?(): boolean | void
  StepBySteps_AutoplayOn?(): boolean | void
  StepBySteps_Playing?(): boolean | void
  StepBySteps_TimelineOnFirst?(): boolean | void
  StepBySteps_TimelineOnBetween?(): boolean | void
  StepBySteps_TimelineOnLast?(): boolean | void
  StepBySteps_StepByStates?(): boolean | void
  StepBySteps_StepByTransitions?(): boolean | void
  StepBySteps_Any?(): boolean | void
  StepBySteps_StepByNestedTransitions?(): boolean | void
  StepBySteps_StepByLive?(): boolean | void
  StepBySteps_PlayStopClicked?(): boolean | void
  StepBySteps_TimelineScrolled?(): boolean | void
  StepBySteps_StepTypeChanged?(): boolean | void
  StepBySteps_FullSync?(): boolean | void
  StepBySteps_DiffSync?(): boolean | void
  StepBySteps_LegendVisible?(): boolean | void
  StepBySteps_ConnectionDialogVisible?(): boolean | void
  StepBySteps_LocalLogger?(): boolean | void
  StepBySteps_Exception?(): boolean | void
  StepBySteps_exit?(): boolean | void
  StepBySteps_end?(): boolean | void
  StepByNestedTransitions_Exception?(): boolean | void
  StepByNestedTransitions_InitializingLayoutWorker?(): boolean | void
  StepByNestedTransitions_LayoutWorkerReady?(): boolean | void
  StepByNestedTransitions_DOMReady?(): boolean | void
  StepByNestedTransitions_Rendering?(): boolean | void
  StepByNestedTransitions_Rendered?(): boolean | void
  StepByNestedTransitions_InitialRenderDone?(): boolean | void
  StepByNestedTransitions_Connecting?(): boolean | void
  StepByNestedTransitions_Connected?(): boolean | void
  StepByNestedTransitions_Disconnected?(): boolean | void
  StepByNestedTransitions_AutoplayOn?(): boolean | void
  StepByNestedTransitions_Playing?(): boolean | void
  StepByNestedTransitions_TimelineOnFirst?(): boolean | void
  StepByNestedTransitions_TimelineOnBetween?(): boolean | void
  StepByNestedTransitions_TimelineOnLast?(): boolean | void
  StepByNestedTransitions_StepByStates?(): boolean | void
  StepByNestedTransitions_StepByTransitions?(): boolean | void
  StepByNestedTransitions_StepBySteps?(): boolean | void
  StepByNestedTransitions_Any?(): boolean | void
  StepByNestedTransitions_StepByLive?(): boolean | void
  StepByNestedTransitions_PlayStopClicked?(): boolean | void
  StepByNestedTransitions_TimelineScrolled?(): boolean | void
  StepByNestedTransitions_StepTypeChanged?(): boolean | void
  StepByNestedTransitions_FullSync?(): boolean | void
  StepByNestedTransitions_DiffSync?(): boolean | void
  StepByNestedTransitions_LegendVisible?(): boolean | void
  StepByNestedTransitions_ConnectionDialogVisible?(): boolean | void
  StepByNestedTransitions_LocalLogger?(): boolean | void
  StepByNestedTransitions_Exception?(): boolean | void
  StepByNestedTransitions_exit?(): boolean | void
  StepByNestedTransitions_end?(): boolean | void
  StepByLive_Exception?(): boolean | void
  StepByLive_InitializingLayoutWorker?(): boolean | void
  StepByLive_LayoutWorkerReady?(): boolean | void
  StepByLive_DOMReady?(): boolean | void
  StepByLive_Rendering?(): boolean | void
  StepByLive_Rendered?(): boolean | void
  StepByLive_InitialRenderDone?(): boolean | void
  StepByLive_Connecting?(): boolean | void
  StepByLive_Connected?(): boolean | void
  StepByLive_Disconnected?(): boolean | void
  StepByLive_AutoplayOn?(): boolean | void
  StepByLive_Playing?(): boolean | void
  StepByLive_TimelineOnFirst?(): boolean | void
  StepByLive_TimelineOnBetween?(): boolean | void
  StepByLive_TimelineOnLast?(): boolean | void
  StepByLive_StepByStates?(): boolean | void
  StepByLive_StepByTransitions?(): boolean | void
  StepByLive_StepBySteps?(): boolean | void
  StepByLive_StepByNestedTransitions?(): boolean | void
  StepByLive_Any?(): boolean | void
  StepByLive_PlayStopClicked?(): boolean | void
  StepByLive_TimelineScrolled?(): boolean | void
  StepByLive_StepTypeChanged?(): boolean | void
  StepByLive_FullSync?(): boolean | void
  StepByLive_DiffSync?(): boolean | void
  StepByLive_LegendVisible?(): boolean | void
  StepByLive_ConnectionDialogVisible?(): boolean | void
  StepByLive_LocalLogger?(): boolean | void
  StepByLive_Exception?(): boolean | void
  StepByLive_exit?(): boolean | void
  StepByLive_end?(): boolean | void
  PlayStopClicked_Exception?(): boolean | void
  PlayStopClicked_InitializingLayoutWorker?(): boolean | void
  PlayStopClicked_LayoutWorkerReady?(): boolean | void
  PlayStopClicked_DOMReady?(): boolean | void
  PlayStopClicked_Rendering?(): boolean | void
  PlayStopClicked_Rendered?(): boolean | void
  PlayStopClicked_InitialRenderDone?(): boolean | void
  PlayStopClicked_Connecting?(): boolean | void
  PlayStopClicked_Connected?(): boolean | void
  PlayStopClicked_Disconnected?(): boolean | void
  PlayStopClicked_AutoplayOn?(): boolean | void
  PlayStopClicked_Playing?(): boolean | void
  PlayStopClicked_TimelineOnFirst?(): boolean | void
  PlayStopClicked_TimelineOnBetween?(): boolean | void
  PlayStopClicked_TimelineOnLast?(): boolean | void
  PlayStopClicked_StepByStates?(): boolean | void
  PlayStopClicked_StepByTransitions?(): boolean | void
  PlayStopClicked_StepBySteps?(): boolean | void
  PlayStopClicked_StepByNestedTransitions?(): boolean | void
  PlayStopClicked_StepByLive?(): boolean | void
  PlayStopClicked_Any?(): boolean | void
  PlayStopClicked_TimelineScrolled?(): boolean | void
  PlayStopClicked_StepTypeChanged?(): boolean | void
  PlayStopClicked_FullSync?(): boolean | void
  PlayStopClicked_DiffSync?(): boolean | void
  PlayStopClicked_LegendVisible?(): boolean | void
  PlayStopClicked_ConnectionDialogVisible?(): boolean | void
  PlayStopClicked_LocalLogger?(): boolean | void
  PlayStopClicked_Exception?(): boolean | void
  PlayStopClicked_exit?(): boolean | void
  PlayStopClicked_end?(): boolean | void
  TimelineScrolled_Exception?(): boolean | void
  TimelineScrolled_InitializingLayoutWorker?(): boolean | void
  TimelineScrolled_LayoutWorkerReady?(): boolean | void
  TimelineScrolled_DOMReady?(): boolean | void
  TimelineScrolled_Rendering?(): boolean | void
  TimelineScrolled_Rendered?(): boolean | void
  TimelineScrolled_InitialRenderDone?(): boolean | void
  TimelineScrolled_Connecting?(): boolean | void
  TimelineScrolled_Connected?(): boolean | void
  TimelineScrolled_Disconnected?(): boolean | void
  TimelineScrolled_AutoplayOn?(): boolean | void
  TimelineScrolled_Playing?(): boolean | void
  TimelineScrolled_TimelineOnFirst?(): boolean | void
  TimelineScrolled_TimelineOnBetween?(): boolean | void
  TimelineScrolled_TimelineOnLast?(): boolean | void
  TimelineScrolled_StepByStates?(): boolean | void
  TimelineScrolled_StepByTransitions?(): boolean | void
  TimelineScrolled_StepBySteps?(): boolean | void
  TimelineScrolled_StepByNestedTransitions?(): boolean | void
  TimelineScrolled_StepByLive?(): boolean | void
  TimelineScrolled_PlayStopClicked?(): boolean | void
  TimelineScrolled_Any?(): boolean | void
  TimelineScrolled_StepTypeChanged?(): boolean | void
  TimelineScrolled_FullSync?(): boolean | void
  TimelineScrolled_DiffSync?(): boolean | void
  TimelineScrolled_LegendVisible?(): boolean | void
  TimelineScrolled_ConnectionDialogVisible?(): boolean | void
  TimelineScrolled_LocalLogger?(): boolean | void
  TimelineScrolled_Exception?(): boolean | void
  TimelineScrolled_exit?(): boolean | void
  TimelineScrolled_end?(): boolean | void
  StepTypeChanged_Exception?(): boolean | void
  StepTypeChanged_InitializingLayoutWorker?(): boolean | void
  StepTypeChanged_LayoutWorkerReady?(): boolean | void
  StepTypeChanged_DOMReady?(): boolean | void
  StepTypeChanged_Rendering?(): boolean | void
  StepTypeChanged_Rendered?(): boolean | void
  StepTypeChanged_InitialRenderDone?(): boolean | void
  StepTypeChanged_Connecting?(): boolean | void
  StepTypeChanged_Connected?(): boolean | void
  StepTypeChanged_Disconnected?(): boolean | void
  StepTypeChanged_AutoplayOn?(): boolean | void
  StepTypeChanged_Playing?(): boolean | void
  StepTypeChanged_TimelineOnFirst?(): boolean | void
  StepTypeChanged_TimelineOnBetween?(): boolean | void
  StepTypeChanged_TimelineOnLast?(): boolean | void
  StepTypeChanged_StepByStates?(): boolean | void
  StepTypeChanged_StepByTransitions?(): boolean | void
  StepTypeChanged_StepBySteps?(): boolean | void
  StepTypeChanged_StepByNestedTransitions?(): boolean | void
  StepTypeChanged_StepByLive?(): boolean | void
  StepTypeChanged_PlayStopClicked?(): boolean | void
  StepTypeChanged_TimelineScrolled?(): boolean | void
  StepTypeChanged_Any?(): boolean | void
  StepTypeChanged_FullSync?(): boolean | void
  StepTypeChanged_DiffSync?(): boolean | void
  StepTypeChanged_LegendVisible?(): boolean | void
  StepTypeChanged_ConnectionDialogVisible?(): boolean | void
  StepTypeChanged_LocalLogger?(): boolean | void
  StepTypeChanged_Exception?(): boolean | void
  StepTypeChanged_exit?(): boolean | void
  StepTypeChanged_end?(): boolean | void
  FullSync_Exception?(): boolean | void
  FullSync_InitializingLayoutWorker?(): boolean | void
  FullSync_LayoutWorkerReady?(): boolean | void
  FullSync_DOMReady?(): boolean | void
  FullSync_Rendering?(): boolean | void
  FullSync_Rendered?(): boolean | void
  FullSync_InitialRenderDone?(): boolean | void
  FullSync_Connecting?(): boolean | void
  FullSync_Connected?(): boolean | void
  FullSync_Disconnected?(): boolean | void
  FullSync_AutoplayOn?(): boolean | void
  FullSync_Playing?(): boolean | void
  FullSync_TimelineOnFirst?(): boolean | void
  FullSync_TimelineOnBetween?(): boolean | void
  FullSync_TimelineOnLast?(): boolean | void
  FullSync_StepByStates?(): boolean | void
  FullSync_StepByTransitions?(): boolean | void
  FullSync_StepBySteps?(): boolean | void
  FullSync_StepByNestedTransitions?(): boolean | void
  FullSync_StepByLive?(): boolean | void
  FullSync_PlayStopClicked?(): boolean | void
  FullSync_TimelineScrolled?(): boolean | void
  FullSync_StepTypeChanged?(): boolean | void
  FullSync_Any?(): boolean | void
  FullSync_DiffSync?(): boolean | void
  FullSync_LegendVisible?(): boolean | void
  FullSync_ConnectionDialogVisible?(): boolean | void
  FullSync_LocalLogger?(): boolean | void
  FullSync_Exception?(): boolean | void
  FullSync_exit?(): boolean | void
  FullSync_end?(): boolean | void | Promise<boolean | void>
  DiffSync_Exception?(): boolean | void
  DiffSync_InitializingLayoutWorker?(): boolean | void
  DiffSync_LayoutWorkerReady?(): boolean | void
  DiffSync_DOMReady?(): boolean | void
  DiffSync_Rendering?(): boolean | void
  DiffSync_Rendered?(): boolean | void
  DiffSync_InitialRenderDone?(): boolean | void
  DiffSync_Connecting?(): boolean | void
  DiffSync_Connected?(): boolean | void
  DiffSync_Disconnected?(): boolean | void
  DiffSync_AutoplayOn?(): boolean | void
  DiffSync_Playing?(): boolean | void
  DiffSync_TimelineOnFirst?(): boolean | void
  DiffSync_TimelineOnBetween?(): boolean | void
  DiffSync_TimelineOnLast?(): boolean | void
  DiffSync_StepByStates?(): boolean | void
  DiffSync_StepByTransitions?(): boolean | void
  DiffSync_StepBySteps?(): boolean | void
  DiffSync_StepByNestedTransitions?(): boolean | void
  DiffSync_StepByLive?(): boolean | void
  DiffSync_PlayStopClicked?(): boolean | void
  DiffSync_TimelineScrolled?(): boolean | void
  DiffSync_StepTypeChanged?(): boolean | void
  DiffSync_FullSync?(): boolean | void
  DiffSync_Any?(): boolean | void
  DiffSync_LegendVisible?(): boolean | void
  DiffSync_ConnectionDialogVisible?(): boolean | void
  DiffSync_LocalLogger?(): boolean | void
  DiffSync_Exception?(): boolean | void
  DiffSync_exit?(): boolean | void
  DiffSync_end?(): boolean | void
  LegendVisible_Exception?(): boolean | void
  LegendVisible_InitializingLayoutWorker?(): boolean | void
  LegendVisible_LayoutWorkerReady?(): boolean | void
  LegendVisible_DOMReady?(): boolean | void
  LegendVisible_Rendering?(): boolean | void
  LegendVisible_Rendered?(): boolean | void
  LegendVisible_InitialRenderDone?(): boolean | void
  LegendVisible_Connecting?(): boolean | void
  LegendVisible_Connected?(): boolean | void
  LegendVisible_Disconnected?(): boolean | void
  LegendVisible_AutoplayOn?(): boolean | void
  LegendVisible_Playing?(): boolean | void
  LegendVisible_TimelineOnFirst?(): boolean | void
  LegendVisible_TimelineOnBetween?(): boolean | void
  LegendVisible_TimelineOnLast?(): boolean | void
  LegendVisible_StepByStates?(): boolean | void
  LegendVisible_StepByTransitions?(): boolean | void
  LegendVisible_StepBySteps?(): boolean | void
  LegendVisible_StepByNestedTransitions?(): boolean | void
  LegendVisible_StepByLive?(): boolean | void
  LegendVisible_PlayStopClicked?(): boolean | void
  LegendVisible_TimelineScrolled?(): boolean | void
  LegendVisible_StepTypeChanged?(): boolean | void
  LegendVisible_FullSync?(): boolean | void
  LegendVisible_DiffSync?(): boolean | void
  LegendVisible_Any?(): boolean | void
  LegendVisible_ConnectionDialogVisible?(): boolean | void
  LegendVisible_LocalLogger?(): boolean | void
  LegendVisible_Exception?(): boolean | void
  LegendVisible_exit?(): boolean | void
  LegendVisible_end?(): boolean | void
  ConnectionDialogVisible_Exception?(): boolean | void
  ConnectionDialogVisible_InitializingLayoutWorker?(): boolean | void
  ConnectionDialogVisible_LayoutWorkerReady?(): boolean | void
  ConnectionDialogVisible_DOMReady?(): boolean | void
  ConnectionDialogVisible_Rendering?(): boolean | void
  ConnectionDialogVisible_Rendered?(): boolean | void
  ConnectionDialogVisible_InitialRenderDone?(): boolean | void
  ConnectionDialogVisible_Connecting?(): boolean | void
  ConnectionDialogVisible_Connected?(): boolean | void
  ConnectionDialogVisible_Disconnected?(): boolean | void
  ConnectionDialogVisible_AutoplayOn?(): boolean | void
  ConnectionDialogVisible_Playing?(): boolean | void
  ConnectionDialogVisible_TimelineOnFirst?(): boolean | void
  ConnectionDialogVisible_TimelineOnBetween?(): boolean | void
  ConnectionDialogVisible_TimelineOnLast?(): boolean | void
  ConnectionDialogVisible_StepByStates?(): boolean | void
  ConnectionDialogVisible_StepByTransitions?(): boolean | void
  ConnectionDialogVisible_StepBySteps?(): boolean | void
  ConnectionDialogVisible_StepByNestedTransitions?(): boolean | void
  ConnectionDialogVisible_StepByLive?(): boolean | void
  ConnectionDialogVisible_PlayStopClicked?(): boolean | void
  ConnectionDialogVisible_TimelineScrolled?(): boolean | void
  ConnectionDialogVisible_StepTypeChanged?(): boolean | void
  ConnectionDialogVisible_FullSync?(): boolean | void
  ConnectionDialogVisible_DiffSync?(): boolean | void
  ConnectionDialogVisible_LegendVisible?(): boolean | void
  ConnectionDialogVisible_Any?(): boolean | void
  ConnectionDialogVisible_LocalLogger?(): boolean | void
  ConnectionDialogVisible_Exception?(): boolean | void
  ConnectionDialogVisible_exit?(): boolean | void
  ConnectionDialogVisible_end?(): boolean | void
  LocalLogger_Exception?(): boolean | void
  LocalLogger_InitializingLayoutWorker?(): boolean | void
  LocalLogger_LayoutWorkerReady?(): boolean | void
  LocalLogger_DOMReady?(): boolean | void
  LocalLogger_Rendering?(): boolean | void
  LocalLogger_Rendered?(): boolean | void
  LocalLogger_InitialRenderDone?(): boolean | void
  LocalLogger_Connecting?(): boolean | void
  LocalLogger_Connected?(): boolean | void
  LocalLogger_Disconnected?(): boolean | void
  LocalLogger_AutoplayOn?(): boolean | void
  LocalLogger_Playing?(): boolean | void
  LocalLogger_TimelineOnFirst?(): boolean | void
  LocalLogger_TimelineOnBetween?(): boolean | void
  LocalLogger_TimelineOnLast?(): boolean | void
  LocalLogger_StepByStates?(): boolean | void
  LocalLogger_StepByTransitions?(): boolean | void
  LocalLogger_StepBySteps?(): boolean | void
  LocalLogger_StepByNestedTransitions?(): boolean | void
  LocalLogger_StepByLive?(): boolean | void
  LocalLogger_PlayStopClicked?(): boolean | void
  LocalLogger_TimelineScrolled?(): boolean | void
  LocalLogger_StepTypeChanged?(): boolean | void
  LocalLogger_FullSync?(): boolean | void
  LocalLogger_DiffSync?(): boolean | void
  LocalLogger_LegendVisible?(): boolean | void
  LocalLogger_ConnectionDialogVisible?(): boolean | void
  LocalLogger_Any?(): boolean | void
  LocalLogger_Exception?(): boolean | void
  LocalLogger_exit?(): boolean | void
  LocalLogger_end?(): boolean | void
  Exception_InitializingLayoutWorker?(): boolean | void
  Exception_LayoutWorkerReady?(): boolean | void
  Exception_DOMReady?(): boolean | void
  Exception_Rendering?(): boolean | void
  Exception_Rendered?(): boolean | void
  Exception_InitialRenderDone?(): boolean | void
  Exception_Connecting?(): boolean | void
  Exception_Connected?(): boolean | void
  Exception_Disconnected?(): boolean | void
  Exception_AutoplayOn?(): boolean | void
  Exception_Playing?(): boolean | void
  Exception_TimelineOnFirst?(): boolean | void
  Exception_TimelineOnBetween?(): boolean | void
  Exception_TimelineOnLast?(): boolean | void
  Exception_StepByStates?(): boolean | void
  Exception_StepByTransitions?(): boolean | void
  Exception_StepBySteps?(): boolean | void
  Exception_StepByNestedTransitions?(): boolean | void
  Exception_StepByLive?(): boolean | void
  Exception_PlayStopClicked?(): boolean | void
  Exception_TimelineScrolled?(): boolean | void
  Exception_StepTypeChanged?(): boolean | void
  Exception_FullSync?(): boolean | void
  Exception_DiffSync?(): boolean | void
  Exception_LegendVisible?(): boolean | void
  Exception_ConnectionDialogVisible?(): boolean | void
  Exception_LocalLogger?(): boolean | void
  Exception_exit?(): boolean | void
  Exception_end?(): boolean | void
}

/** All the state names */
export type TStates =
  | 'InitializingLayoutWorker'
  | 'LayoutWorkerReady'
  | 'DOMReady'
  | 'Rendering'
  | 'Rendered'
  | 'InitialRenderDone'
  | 'Connecting'
  | 'Connected'
  | 'Disconnected'
  | 'AutoplayOn'
  | 'Playing'
  | 'TimelineOnFirst'
  | 'TimelineOnBetween'
  | 'TimelineOnLast'
  | 'StepByStates'
  | 'StepByTransitions'
  | 'StepBySteps'
  | 'StepByNestedTransitions'
  | 'StepByLive'
  | 'PlayStopClicked'
  | 'TimelineScrolled'
  | 'StepTypeChanged'
  | 'FullSync'
  | 'DiffSync'
  | 'LegendVisible'
  | 'ConnectionDialogVisible'
  | 'LocalLogger'

/** All the transition names */
export type TTransitions =
  | 'Exception_InitializingLayoutWorker'
  | 'Exception_LayoutWorkerReady'
  | 'Exception_DOMReady'
  | 'Exception_Rendering'
  | 'Exception_Rendered'
  | 'Exception_InitialRenderDone'
  | 'Exception_Connecting'
  | 'Exception_Connected'
  | 'Exception_Disconnected'
  | 'Exception_AutoplayOn'
  | 'Exception_Playing'
  | 'Exception_TimelineOnFirst'
  | 'Exception_TimelineOnBetween'
  | 'Exception_TimelineOnLast'
  | 'Exception_StepByStates'
  | 'Exception_StepByTransitions'
  | 'Exception_StepBySteps'
  | 'Exception_StepByNestedTransitions'
  | 'Exception_StepByLive'
  | 'Exception_PlayStopClicked'
  | 'Exception_TimelineScrolled'
  | 'Exception_StepTypeChanged'
  | 'Exception_FullSync'
  | 'Exception_DiffSync'
  | 'Exception_LegendVisible'
  | 'Exception_ConnectionDialogVisible'
  | 'Exception_LocalLogger'
  | 'Exception_exit'
  | 'Exception_end'
  | 'InitializingLayoutWorker_Exception'
  | 'InitializingLayoutWorker_Any'
  | 'InitializingLayoutWorker_LayoutWorkerReady'
  | 'InitializingLayoutWorker_DOMReady'
  | 'InitializingLayoutWorker_Rendering'
  | 'InitializingLayoutWorker_Rendered'
  | 'InitializingLayoutWorker_InitialRenderDone'
  | 'InitializingLayoutWorker_Connecting'
  | 'InitializingLayoutWorker_Connected'
  | 'InitializingLayoutWorker_Disconnected'
  | 'InitializingLayoutWorker_AutoplayOn'
  | 'InitializingLayoutWorker_Playing'
  | 'InitializingLayoutWorker_TimelineOnFirst'
  | 'InitializingLayoutWorker_TimelineOnBetween'
  | 'InitializingLayoutWorker_TimelineOnLast'
  | 'InitializingLayoutWorker_StepByStates'
  | 'InitializingLayoutWorker_StepByTransitions'
  | 'InitializingLayoutWorker_StepBySteps'
  | 'InitializingLayoutWorker_StepByNestedTransitions'
  | 'InitializingLayoutWorker_StepByLive'
  | 'InitializingLayoutWorker_PlayStopClicked'
  | 'InitializingLayoutWorker_TimelineScrolled'
  | 'InitializingLayoutWorker_StepTypeChanged'
  | 'InitializingLayoutWorker_FullSync'
  | 'InitializingLayoutWorker_DiffSync'
  | 'InitializingLayoutWorker_LegendVisible'
  | 'InitializingLayoutWorker_ConnectionDialogVisible'
  | 'InitializingLayoutWorker_LocalLogger'
  | 'InitializingLayoutWorker_Exception'
  | 'InitializingLayoutWorker_exit'
  | 'InitializingLayoutWorker_end'
  | 'LayoutWorkerReady_Exception'
  | 'LayoutWorkerReady_InitializingLayoutWorker'
  | 'LayoutWorkerReady_Any'
  | 'LayoutWorkerReady_DOMReady'
  | 'LayoutWorkerReady_Rendering'
  | 'LayoutWorkerReady_Rendered'
  | 'LayoutWorkerReady_InitialRenderDone'
  | 'LayoutWorkerReady_Connecting'
  | 'LayoutWorkerReady_Connected'
  | 'LayoutWorkerReady_Disconnected'
  | 'LayoutWorkerReady_AutoplayOn'
  | 'LayoutWorkerReady_Playing'
  | 'LayoutWorkerReady_TimelineOnFirst'
  | 'LayoutWorkerReady_TimelineOnBetween'
  | 'LayoutWorkerReady_TimelineOnLast'
  | 'LayoutWorkerReady_StepByStates'
  | 'LayoutWorkerReady_StepByTransitions'
  | 'LayoutWorkerReady_StepBySteps'
  | 'LayoutWorkerReady_StepByNestedTransitions'
  | 'LayoutWorkerReady_StepByLive'
  | 'LayoutWorkerReady_PlayStopClicked'
  | 'LayoutWorkerReady_TimelineScrolled'
  | 'LayoutWorkerReady_StepTypeChanged'
  | 'LayoutWorkerReady_FullSync'
  | 'LayoutWorkerReady_DiffSync'
  | 'LayoutWorkerReady_LegendVisible'
  | 'LayoutWorkerReady_ConnectionDialogVisible'
  | 'LayoutWorkerReady_LocalLogger'
  | 'LayoutWorkerReady_Exception'
  | 'LayoutWorkerReady_exit'
  | 'LayoutWorkerReady_end'
  | 'DOMReady_Exception'
  | 'DOMReady_InitializingLayoutWorker'
  | 'DOMReady_LayoutWorkerReady'
  | 'DOMReady_Any'
  | 'DOMReady_Rendering'
  | 'DOMReady_Rendered'
  | 'DOMReady_InitialRenderDone'
  | 'DOMReady_Connecting'
  | 'DOMReady_Connected'
  | 'DOMReady_Disconnected'
  | 'DOMReady_AutoplayOn'
  | 'DOMReady_Playing'
  | 'DOMReady_TimelineOnFirst'
  | 'DOMReady_TimelineOnBetween'
  | 'DOMReady_TimelineOnLast'
  | 'DOMReady_StepByStates'
  | 'DOMReady_StepByTransitions'
  | 'DOMReady_StepBySteps'
  | 'DOMReady_StepByNestedTransitions'
  | 'DOMReady_StepByLive'
  | 'DOMReady_PlayStopClicked'
  | 'DOMReady_TimelineScrolled'
  | 'DOMReady_StepTypeChanged'
  | 'DOMReady_FullSync'
  | 'DOMReady_DiffSync'
  | 'DOMReady_LegendVisible'
  | 'DOMReady_ConnectionDialogVisible'
  | 'DOMReady_LocalLogger'
  | 'DOMReady_Exception'
  | 'DOMReady_exit'
  | 'DOMReady_end'
  | 'Rendering_Exception'
  | 'Rendering_InitializingLayoutWorker'
  | 'Rendering_LayoutWorkerReady'
  | 'Rendering_DOMReady'
  | 'Rendering_Any'
  | 'Rendering_Rendered'
  | 'Rendering_InitialRenderDone'
  | 'Rendering_Connecting'
  | 'Rendering_Connected'
  | 'Rendering_Disconnected'
  | 'Rendering_AutoplayOn'
  | 'Rendering_Playing'
  | 'Rendering_TimelineOnFirst'
  | 'Rendering_TimelineOnBetween'
  | 'Rendering_TimelineOnLast'
  | 'Rendering_StepByStates'
  | 'Rendering_StepByTransitions'
  | 'Rendering_StepBySteps'
  | 'Rendering_StepByNestedTransitions'
  | 'Rendering_StepByLive'
  | 'Rendering_PlayStopClicked'
  | 'Rendering_TimelineScrolled'
  | 'Rendering_StepTypeChanged'
  | 'Rendering_FullSync'
  | 'Rendering_DiffSync'
  | 'Rendering_LegendVisible'
  | 'Rendering_ConnectionDialogVisible'
  | 'Rendering_LocalLogger'
  | 'Rendering_Exception'
  | 'Rendering_exit'
  | 'Rendering_end'
  | 'Rendered_Exception'
  | 'Rendered_InitializingLayoutWorker'
  | 'Rendered_LayoutWorkerReady'
  | 'Rendered_DOMReady'
  | 'Rendered_Rendering'
  | 'Rendered_Any'
  | 'Rendered_InitialRenderDone'
  | 'Rendered_Connecting'
  | 'Rendered_Connected'
  | 'Rendered_Disconnected'
  | 'Rendered_AutoplayOn'
  | 'Rendered_Playing'
  | 'Rendered_TimelineOnFirst'
  | 'Rendered_TimelineOnBetween'
  | 'Rendered_TimelineOnLast'
  | 'Rendered_StepByStates'
  | 'Rendered_StepByTransitions'
  | 'Rendered_StepBySteps'
  | 'Rendered_StepByNestedTransitions'
  | 'Rendered_StepByLive'
  | 'Rendered_PlayStopClicked'
  | 'Rendered_TimelineScrolled'
  | 'Rendered_StepTypeChanged'
  | 'Rendered_FullSync'
  | 'Rendered_DiffSync'
  | 'Rendered_LegendVisible'
  | 'Rendered_ConnectionDialogVisible'
  | 'Rendered_LocalLogger'
  | 'Rendered_Exception'
  | 'Rendered_exit'
  | 'Rendered_end'
  | 'InitialRenderDone_Exception'
  | 'InitialRenderDone_InitializingLayoutWorker'
  | 'InitialRenderDone_LayoutWorkerReady'
  | 'InitialRenderDone_DOMReady'
  | 'InitialRenderDone_Rendering'
  | 'InitialRenderDone_Rendered'
  | 'InitialRenderDone_Any'
  | 'InitialRenderDone_Connecting'
  | 'InitialRenderDone_Connected'
  | 'InitialRenderDone_Disconnected'
  | 'InitialRenderDone_AutoplayOn'
  | 'InitialRenderDone_Playing'
  | 'InitialRenderDone_TimelineOnFirst'
  | 'InitialRenderDone_TimelineOnBetween'
  | 'InitialRenderDone_TimelineOnLast'
  | 'InitialRenderDone_StepByStates'
  | 'InitialRenderDone_StepByTransitions'
  | 'InitialRenderDone_StepBySteps'
  | 'InitialRenderDone_StepByNestedTransitions'
  | 'InitialRenderDone_StepByLive'
  | 'InitialRenderDone_PlayStopClicked'
  | 'InitialRenderDone_TimelineScrolled'
  | 'InitialRenderDone_StepTypeChanged'
  | 'InitialRenderDone_FullSync'
  | 'InitialRenderDone_DiffSync'
  | 'InitialRenderDone_LegendVisible'
  | 'InitialRenderDone_ConnectionDialogVisible'
  | 'InitialRenderDone_LocalLogger'
  | 'InitialRenderDone_Exception'
  | 'InitialRenderDone_exit'
  | 'InitialRenderDone_end'
  | 'Connecting_Exception'
  | 'Connecting_InitializingLayoutWorker'
  | 'Connecting_LayoutWorkerReady'
  | 'Connecting_DOMReady'
  | 'Connecting_Rendering'
  | 'Connecting_Rendered'
  | 'Connecting_InitialRenderDone'
  | 'Connecting_Any'
  | 'Connecting_Connected'
  | 'Connecting_Disconnected'
  | 'Connecting_AutoplayOn'
  | 'Connecting_Playing'
  | 'Connecting_TimelineOnFirst'
  | 'Connecting_TimelineOnBetween'
  | 'Connecting_TimelineOnLast'
  | 'Connecting_StepByStates'
  | 'Connecting_StepByTransitions'
  | 'Connecting_StepBySteps'
  | 'Connecting_StepByNestedTransitions'
  | 'Connecting_StepByLive'
  | 'Connecting_PlayStopClicked'
  | 'Connecting_TimelineScrolled'
  | 'Connecting_StepTypeChanged'
  | 'Connecting_FullSync'
  | 'Connecting_DiffSync'
  | 'Connecting_LegendVisible'
  | 'Connecting_ConnectionDialogVisible'
  | 'Connecting_LocalLogger'
  | 'Connecting_Exception'
  | 'Connecting_exit'
  | 'Connecting_end'
  | 'Connected_Exception'
  | 'Connected_InitializingLayoutWorker'
  | 'Connected_LayoutWorkerReady'
  | 'Connected_DOMReady'
  | 'Connected_Rendering'
  | 'Connected_Rendered'
  | 'Connected_InitialRenderDone'
  | 'Connected_Connecting'
  | 'Connected_Any'
  | 'Connected_Disconnected'
  | 'Connected_AutoplayOn'
  | 'Connected_Playing'
  | 'Connected_TimelineOnFirst'
  | 'Connected_TimelineOnBetween'
  | 'Connected_TimelineOnLast'
  | 'Connected_StepByStates'
  | 'Connected_StepByTransitions'
  | 'Connected_StepBySteps'
  | 'Connected_StepByNestedTransitions'
  | 'Connected_StepByLive'
  | 'Connected_PlayStopClicked'
  | 'Connected_TimelineScrolled'
  | 'Connected_StepTypeChanged'
  | 'Connected_FullSync'
  | 'Connected_DiffSync'
  | 'Connected_LegendVisible'
  | 'Connected_ConnectionDialogVisible'
  | 'Connected_LocalLogger'
  | 'Connected_Exception'
  | 'Connected_exit'
  | 'Connected_end'
  | 'Disconnected_Exception'
  | 'Disconnected_InitializingLayoutWorker'
  | 'Disconnected_LayoutWorkerReady'
  | 'Disconnected_DOMReady'
  | 'Disconnected_Rendering'
  | 'Disconnected_Rendered'
  | 'Disconnected_InitialRenderDone'
  | 'Disconnected_Connecting'
  | 'Disconnected_Connected'
  | 'Disconnected_Any'
  | 'Disconnected_AutoplayOn'
  | 'Disconnected_Playing'
  | 'Disconnected_TimelineOnFirst'
  | 'Disconnected_TimelineOnBetween'
  | 'Disconnected_TimelineOnLast'
  | 'Disconnected_StepByStates'
  | 'Disconnected_StepByTransitions'
  | 'Disconnected_StepBySteps'
  | 'Disconnected_StepByNestedTransitions'
  | 'Disconnected_StepByLive'
  | 'Disconnected_PlayStopClicked'
  | 'Disconnected_TimelineScrolled'
  | 'Disconnected_StepTypeChanged'
  | 'Disconnected_FullSync'
  | 'Disconnected_DiffSync'
  | 'Disconnected_LegendVisible'
  | 'Disconnected_ConnectionDialogVisible'
  | 'Disconnected_LocalLogger'
  | 'Disconnected_Exception'
  | 'Disconnected_exit'
  | 'Disconnected_end'
  | 'AutoplayOn_Exception'
  | 'AutoplayOn_InitializingLayoutWorker'
  | 'AutoplayOn_LayoutWorkerReady'
  | 'AutoplayOn_DOMReady'
  | 'AutoplayOn_Rendering'
  | 'AutoplayOn_Rendered'
  | 'AutoplayOn_InitialRenderDone'
  | 'AutoplayOn_Connecting'
  | 'AutoplayOn_Connected'
  | 'AutoplayOn_Disconnected'
  | 'AutoplayOn_Any'
  | 'AutoplayOn_Playing'
  | 'AutoplayOn_TimelineOnFirst'
  | 'AutoplayOn_TimelineOnBetween'
  | 'AutoplayOn_TimelineOnLast'
  | 'AutoplayOn_StepByStates'
  | 'AutoplayOn_StepByTransitions'
  | 'AutoplayOn_StepBySteps'
  | 'AutoplayOn_StepByNestedTransitions'
  | 'AutoplayOn_StepByLive'
  | 'AutoplayOn_PlayStopClicked'
  | 'AutoplayOn_TimelineScrolled'
  | 'AutoplayOn_StepTypeChanged'
  | 'AutoplayOn_FullSync'
  | 'AutoplayOn_DiffSync'
  | 'AutoplayOn_LegendVisible'
  | 'AutoplayOn_ConnectionDialogVisible'
  | 'AutoplayOn_LocalLogger'
  | 'AutoplayOn_Exception'
  | 'AutoplayOn_exit'
  | 'AutoplayOn_end'
  | 'Playing_Exception'
  | 'Playing_InitializingLayoutWorker'
  | 'Playing_LayoutWorkerReady'
  | 'Playing_DOMReady'
  | 'Playing_Rendering'
  | 'Playing_Rendered'
  | 'Playing_InitialRenderDone'
  | 'Playing_Connecting'
  | 'Playing_Connected'
  | 'Playing_Disconnected'
  | 'Playing_AutoplayOn'
  | 'Playing_Any'
  | 'Playing_TimelineOnFirst'
  | 'Playing_TimelineOnBetween'
  | 'Playing_TimelineOnLast'
  | 'Playing_StepByStates'
  | 'Playing_StepByTransitions'
  | 'Playing_StepBySteps'
  | 'Playing_StepByNestedTransitions'
  | 'Playing_StepByLive'
  | 'Playing_PlayStopClicked'
  | 'Playing_TimelineScrolled'
  | 'Playing_StepTypeChanged'
  | 'Playing_FullSync'
  | 'Playing_DiffSync'
  | 'Playing_LegendVisible'
  | 'Playing_ConnectionDialogVisible'
  | 'Playing_LocalLogger'
  | 'Playing_Exception'
  | 'Playing_exit'
  | 'Playing_end'
  | 'TimelineOnFirst_Exception'
  | 'TimelineOnFirst_InitializingLayoutWorker'
  | 'TimelineOnFirst_LayoutWorkerReady'
  | 'TimelineOnFirst_DOMReady'
  | 'TimelineOnFirst_Rendering'
  | 'TimelineOnFirst_Rendered'
  | 'TimelineOnFirst_InitialRenderDone'
  | 'TimelineOnFirst_Connecting'
  | 'TimelineOnFirst_Connected'
  | 'TimelineOnFirst_Disconnected'
  | 'TimelineOnFirst_AutoplayOn'
  | 'TimelineOnFirst_Playing'
  | 'TimelineOnFirst_Any'
  | 'TimelineOnFirst_TimelineOnBetween'
  | 'TimelineOnFirst_TimelineOnLast'
  | 'TimelineOnFirst_StepByStates'
  | 'TimelineOnFirst_StepByTransitions'
  | 'TimelineOnFirst_StepBySteps'
  | 'TimelineOnFirst_StepByNestedTransitions'
  | 'TimelineOnFirst_StepByLive'
  | 'TimelineOnFirst_PlayStopClicked'
  | 'TimelineOnFirst_TimelineScrolled'
  | 'TimelineOnFirst_StepTypeChanged'
  | 'TimelineOnFirst_FullSync'
  | 'TimelineOnFirst_DiffSync'
  | 'TimelineOnFirst_LegendVisible'
  | 'TimelineOnFirst_ConnectionDialogVisible'
  | 'TimelineOnFirst_LocalLogger'
  | 'TimelineOnFirst_Exception'
  | 'TimelineOnFirst_exit'
  | 'TimelineOnFirst_end'
  | 'TimelineOnBetween_Exception'
  | 'TimelineOnBetween_InitializingLayoutWorker'
  | 'TimelineOnBetween_LayoutWorkerReady'
  | 'TimelineOnBetween_DOMReady'
  | 'TimelineOnBetween_Rendering'
  | 'TimelineOnBetween_Rendered'
  | 'TimelineOnBetween_InitialRenderDone'
  | 'TimelineOnBetween_Connecting'
  | 'TimelineOnBetween_Connected'
  | 'TimelineOnBetween_Disconnected'
  | 'TimelineOnBetween_AutoplayOn'
  | 'TimelineOnBetween_Playing'
  | 'TimelineOnBetween_TimelineOnFirst'
  | 'TimelineOnBetween_Any'
  | 'TimelineOnBetween_TimelineOnLast'
  | 'TimelineOnBetween_StepByStates'
  | 'TimelineOnBetween_StepByTransitions'
  | 'TimelineOnBetween_StepBySteps'
  | 'TimelineOnBetween_StepByNestedTransitions'
  | 'TimelineOnBetween_StepByLive'
  | 'TimelineOnBetween_PlayStopClicked'
  | 'TimelineOnBetween_TimelineScrolled'
  | 'TimelineOnBetween_StepTypeChanged'
  | 'TimelineOnBetween_FullSync'
  | 'TimelineOnBetween_DiffSync'
  | 'TimelineOnBetween_LegendVisible'
  | 'TimelineOnBetween_ConnectionDialogVisible'
  | 'TimelineOnBetween_LocalLogger'
  | 'TimelineOnBetween_Exception'
  | 'TimelineOnBetween_exit'
  | 'TimelineOnBetween_end'
  | 'TimelineOnLast_Exception'
  | 'TimelineOnLast_InitializingLayoutWorker'
  | 'TimelineOnLast_LayoutWorkerReady'
  | 'TimelineOnLast_DOMReady'
  | 'TimelineOnLast_Rendering'
  | 'TimelineOnLast_Rendered'
  | 'TimelineOnLast_InitialRenderDone'
  | 'TimelineOnLast_Connecting'
  | 'TimelineOnLast_Connected'
  | 'TimelineOnLast_Disconnected'
  | 'TimelineOnLast_AutoplayOn'
  | 'TimelineOnLast_Playing'
  | 'TimelineOnLast_TimelineOnFirst'
  | 'TimelineOnLast_TimelineOnBetween'
  | 'TimelineOnLast_Any'
  | 'TimelineOnLast_StepByStates'
  | 'TimelineOnLast_StepByTransitions'
  | 'TimelineOnLast_StepBySteps'
  | 'TimelineOnLast_StepByNestedTransitions'
  | 'TimelineOnLast_StepByLive'
  | 'TimelineOnLast_PlayStopClicked'
  | 'TimelineOnLast_TimelineScrolled'
  | 'TimelineOnLast_StepTypeChanged'
  | 'TimelineOnLast_FullSync'
  | 'TimelineOnLast_DiffSync'
  | 'TimelineOnLast_LegendVisible'
  | 'TimelineOnLast_ConnectionDialogVisible'
  | 'TimelineOnLast_LocalLogger'
  | 'TimelineOnLast_Exception'
  | 'TimelineOnLast_exit'
  | 'TimelineOnLast_end'
  | 'StepByStates_Exception'
  | 'StepByStates_InitializingLayoutWorker'
  | 'StepByStates_LayoutWorkerReady'
  | 'StepByStates_DOMReady'
  | 'StepByStates_Rendering'
  | 'StepByStates_Rendered'
  | 'StepByStates_InitialRenderDone'
  | 'StepByStates_Connecting'
  | 'StepByStates_Connected'
  | 'StepByStates_Disconnected'
  | 'StepByStates_AutoplayOn'
  | 'StepByStates_Playing'
  | 'StepByStates_TimelineOnFirst'
  | 'StepByStates_TimelineOnBetween'
  | 'StepByStates_TimelineOnLast'
  | 'StepByStates_Any'
  | 'StepByStates_StepByTransitions'
  | 'StepByStates_StepBySteps'
  | 'StepByStates_StepByNestedTransitions'
  | 'StepByStates_StepByLive'
  | 'StepByStates_PlayStopClicked'
  | 'StepByStates_TimelineScrolled'
  | 'StepByStates_StepTypeChanged'
  | 'StepByStates_FullSync'
  | 'StepByStates_DiffSync'
  | 'StepByStates_LegendVisible'
  | 'StepByStates_ConnectionDialogVisible'
  | 'StepByStates_LocalLogger'
  | 'StepByStates_Exception'
  | 'StepByStates_exit'
  | 'StepByStates_end'
  | 'StepByTransitions_Exception'
  | 'StepByTransitions_InitializingLayoutWorker'
  | 'StepByTransitions_LayoutWorkerReady'
  | 'StepByTransitions_DOMReady'
  | 'StepByTransitions_Rendering'
  | 'StepByTransitions_Rendered'
  | 'StepByTransitions_InitialRenderDone'
  | 'StepByTransitions_Connecting'
  | 'StepByTransitions_Connected'
  | 'StepByTransitions_Disconnected'
  | 'StepByTransitions_AutoplayOn'
  | 'StepByTransitions_Playing'
  | 'StepByTransitions_TimelineOnFirst'
  | 'StepByTransitions_TimelineOnBetween'
  | 'StepByTransitions_TimelineOnLast'
  | 'StepByTransitions_StepByStates'
  | 'StepByTransitions_Any'
  | 'StepByTransitions_StepBySteps'
  | 'StepByTransitions_StepByNestedTransitions'
  | 'StepByTransitions_StepByLive'
  | 'StepByTransitions_PlayStopClicked'
  | 'StepByTransitions_TimelineScrolled'
  | 'StepByTransitions_StepTypeChanged'
  | 'StepByTransitions_FullSync'
  | 'StepByTransitions_DiffSync'
  | 'StepByTransitions_LegendVisible'
  | 'StepByTransitions_ConnectionDialogVisible'
  | 'StepByTransitions_LocalLogger'
  | 'StepByTransitions_Exception'
  | 'StepByTransitions_exit'
  | 'StepByTransitions_end'
  | 'StepBySteps_Exception'
  | 'StepBySteps_InitializingLayoutWorker'
  | 'StepBySteps_LayoutWorkerReady'
  | 'StepBySteps_DOMReady'
  | 'StepBySteps_Rendering'
  | 'StepBySteps_Rendered'
  | 'StepBySteps_InitialRenderDone'
  | 'StepBySteps_Connecting'
  | 'StepBySteps_Connected'
  | 'StepBySteps_Disconnected'
  | 'StepBySteps_AutoplayOn'
  | 'StepBySteps_Playing'
  | 'StepBySteps_TimelineOnFirst'
  | 'StepBySteps_TimelineOnBetween'
  | 'StepBySteps_TimelineOnLast'
  | 'StepBySteps_StepByStates'
  | 'StepBySteps_StepByTransitions'
  | 'StepBySteps_Any'
  | 'StepBySteps_StepByNestedTransitions'
  | 'StepBySteps_StepByLive'
  | 'StepBySteps_PlayStopClicked'
  | 'StepBySteps_TimelineScrolled'
  | 'StepBySteps_StepTypeChanged'
  | 'StepBySteps_FullSync'
  | 'StepBySteps_DiffSync'
  | 'StepBySteps_LegendVisible'
  | 'StepBySteps_ConnectionDialogVisible'
  | 'StepBySteps_LocalLogger'
  | 'StepBySteps_Exception'
  | 'StepBySteps_exit'
  | 'StepBySteps_end'
  | 'StepByNestedTransitions_Exception'
  | 'StepByNestedTransitions_InitializingLayoutWorker'
  | 'StepByNestedTransitions_LayoutWorkerReady'
  | 'StepByNestedTransitions_DOMReady'
  | 'StepByNestedTransitions_Rendering'
  | 'StepByNestedTransitions_Rendered'
  | 'StepByNestedTransitions_InitialRenderDone'
  | 'StepByNestedTransitions_Connecting'
  | 'StepByNestedTransitions_Connected'
  | 'StepByNestedTransitions_Disconnected'
  | 'StepByNestedTransitions_AutoplayOn'
  | 'StepByNestedTransitions_Playing'
  | 'StepByNestedTransitions_TimelineOnFirst'
  | 'StepByNestedTransitions_TimelineOnBetween'
  | 'StepByNestedTransitions_TimelineOnLast'
  | 'StepByNestedTransitions_StepByStates'
  | 'StepByNestedTransitions_StepByTransitions'
  | 'StepByNestedTransitions_StepBySteps'
  | 'StepByNestedTransitions_Any'
  | 'StepByNestedTransitions_StepByLive'
  | 'StepByNestedTransitions_PlayStopClicked'
  | 'StepByNestedTransitions_TimelineScrolled'
  | 'StepByNestedTransitions_StepTypeChanged'
  | 'StepByNestedTransitions_FullSync'
  | 'StepByNestedTransitions_DiffSync'
  | 'StepByNestedTransitions_LegendVisible'
  | 'StepByNestedTransitions_ConnectionDialogVisible'
  | 'StepByNestedTransitions_LocalLogger'
  | 'StepByNestedTransitions_Exception'
  | 'StepByNestedTransitions_exit'
  | 'StepByNestedTransitions_end'
  | 'StepByLive_Exception'
  | 'StepByLive_InitializingLayoutWorker'
  | 'StepByLive_LayoutWorkerReady'
  | 'StepByLive_DOMReady'
  | 'StepByLive_Rendering'
  | 'StepByLive_Rendered'
  | 'StepByLive_InitialRenderDone'
  | 'StepByLive_Connecting'
  | 'StepByLive_Connected'
  | 'StepByLive_Disconnected'
  | 'StepByLive_AutoplayOn'
  | 'StepByLive_Playing'
  | 'StepByLive_TimelineOnFirst'
  | 'StepByLive_TimelineOnBetween'
  | 'StepByLive_TimelineOnLast'
  | 'StepByLive_StepByStates'
  | 'StepByLive_StepByTransitions'
  | 'StepByLive_StepBySteps'
  | 'StepByLive_StepByNestedTransitions'
  | 'StepByLive_Any'
  | 'StepByLive_PlayStopClicked'
  | 'StepByLive_TimelineScrolled'
  | 'StepByLive_StepTypeChanged'
  | 'StepByLive_FullSync'
  | 'StepByLive_DiffSync'
  | 'StepByLive_LegendVisible'
  | 'StepByLive_ConnectionDialogVisible'
  | 'StepByLive_LocalLogger'
  | 'StepByLive_Exception'
  | 'StepByLive_exit'
  | 'StepByLive_end'
  | 'PlayStopClicked_Exception'
  | 'PlayStopClicked_InitializingLayoutWorker'
  | 'PlayStopClicked_LayoutWorkerReady'
  | 'PlayStopClicked_DOMReady'
  | 'PlayStopClicked_Rendering'
  | 'PlayStopClicked_Rendered'
  | 'PlayStopClicked_InitialRenderDone'
  | 'PlayStopClicked_Connecting'
  | 'PlayStopClicked_Connected'
  | 'PlayStopClicked_Disconnected'
  | 'PlayStopClicked_AutoplayOn'
  | 'PlayStopClicked_Playing'
  | 'PlayStopClicked_TimelineOnFirst'
  | 'PlayStopClicked_TimelineOnBetween'
  | 'PlayStopClicked_TimelineOnLast'
  | 'PlayStopClicked_StepByStates'
  | 'PlayStopClicked_StepByTransitions'
  | 'PlayStopClicked_StepBySteps'
  | 'PlayStopClicked_StepByNestedTransitions'
  | 'PlayStopClicked_StepByLive'
  | 'PlayStopClicked_Any'
  | 'PlayStopClicked_TimelineScrolled'
  | 'PlayStopClicked_StepTypeChanged'
  | 'PlayStopClicked_FullSync'
  | 'PlayStopClicked_DiffSync'
  | 'PlayStopClicked_LegendVisible'
  | 'PlayStopClicked_ConnectionDialogVisible'
  | 'PlayStopClicked_LocalLogger'
  | 'PlayStopClicked_Exception'
  | 'PlayStopClicked_exit'
  | 'PlayStopClicked_end'
  | 'TimelineScrolled_Exception'
  | 'TimelineScrolled_InitializingLayoutWorker'
  | 'TimelineScrolled_LayoutWorkerReady'
  | 'TimelineScrolled_DOMReady'
  | 'TimelineScrolled_Rendering'
  | 'TimelineScrolled_Rendered'
  | 'TimelineScrolled_InitialRenderDone'
  | 'TimelineScrolled_Connecting'
  | 'TimelineScrolled_Connected'
  | 'TimelineScrolled_Disconnected'
  | 'TimelineScrolled_AutoplayOn'
  | 'TimelineScrolled_Playing'
  | 'TimelineScrolled_TimelineOnFirst'
  | 'TimelineScrolled_TimelineOnBetween'
  | 'TimelineScrolled_TimelineOnLast'
  | 'TimelineScrolled_StepByStates'
  | 'TimelineScrolled_StepByTransitions'
  | 'TimelineScrolled_StepBySteps'
  | 'TimelineScrolled_StepByNestedTransitions'
  | 'TimelineScrolled_StepByLive'
  | 'TimelineScrolled_PlayStopClicked'
  | 'TimelineScrolled_Any'
  | 'TimelineScrolled_StepTypeChanged'
  | 'TimelineScrolled_FullSync'
  | 'TimelineScrolled_DiffSync'
  | 'TimelineScrolled_LegendVisible'
  | 'TimelineScrolled_ConnectionDialogVisible'
  | 'TimelineScrolled_LocalLogger'
  | 'TimelineScrolled_Exception'
  | 'TimelineScrolled_exit'
  | 'TimelineScrolled_end'
  | 'StepTypeChanged_Exception'
  | 'StepTypeChanged_InitializingLayoutWorker'
  | 'StepTypeChanged_LayoutWorkerReady'
  | 'StepTypeChanged_DOMReady'
  | 'StepTypeChanged_Rendering'
  | 'StepTypeChanged_Rendered'
  | 'StepTypeChanged_InitialRenderDone'
  | 'StepTypeChanged_Connecting'
  | 'StepTypeChanged_Connected'
  | 'StepTypeChanged_Disconnected'
  | 'StepTypeChanged_AutoplayOn'
  | 'StepTypeChanged_Playing'
  | 'StepTypeChanged_TimelineOnFirst'
  | 'StepTypeChanged_TimelineOnBetween'
  | 'StepTypeChanged_TimelineOnLast'
  | 'StepTypeChanged_StepByStates'
  | 'StepTypeChanged_StepByTransitions'
  | 'StepTypeChanged_StepBySteps'
  | 'StepTypeChanged_StepByNestedTransitions'
  | 'StepTypeChanged_StepByLive'
  | 'StepTypeChanged_PlayStopClicked'
  | 'StepTypeChanged_TimelineScrolled'
  | 'StepTypeChanged_Any'
  | 'StepTypeChanged_FullSync'
  | 'StepTypeChanged_DiffSync'
  | 'StepTypeChanged_LegendVisible'
  | 'StepTypeChanged_ConnectionDialogVisible'
  | 'StepTypeChanged_LocalLogger'
  | 'StepTypeChanged_Exception'
  | 'StepTypeChanged_exit'
  | 'StepTypeChanged_end'
  | 'FullSync_Exception'
  | 'FullSync_InitializingLayoutWorker'
  | 'FullSync_LayoutWorkerReady'
  | 'FullSync_DOMReady'
  | 'FullSync_Rendering'
  | 'FullSync_Rendered'
  | 'FullSync_InitialRenderDone'
  | 'FullSync_Connecting'
  | 'FullSync_Connected'
  | 'FullSync_Disconnected'
  | 'FullSync_AutoplayOn'
  | 'FullSync_Playing'
  | 'FullSync_TimelineOnFirst'
  | 'FullSync_TimelineOnBetween'
  | 'FullSync_TimelineOnLast'
  | 'FullSync_StepByStates'
  | 'FullSync_StepByTransitions'
  | 'FullSync_StepBySteps'
  | 'FullSync_StepByNestedTransitions'
  | 'FullSync_StepByLive'
  | 'FullSync_PlayStopClicked'
  | 'FullSync_TimelineScrolled'
  | 'FullSync_StepTypeChanged'
  | 'FullSync_Any'
  | 'FullSync_DiffSync'
  | 'FullSync_LegendVisible'
  | 'FullSync_ConnectionDialogVisible'
  | 'FullSync_LocalLogger'
  | 'FullSync_Exception'
  | 'FullSync_exit'
  | 'FullSync_end'
  | 'DiffSync_Exception'
  | 'DiffSync_InitializingLayoutWorker'
  | 'DiffSync_LayoutWorkerReady'
  | 'DiffSync_DOMReady'
  | 'DiffSync_Rendering'
  | 'DiffSync_Rendered'
  | 'DiffSync_InitialRenderDone'
  | 'DiffSync_Connecting'
  | 'DiffSync_Connected'
  | 'DiffSync_Disconnected'
  | 'DiffSync_AutoplayOn'
  | 'DiffSync_Playing'
  | 'DiffSync_TimelineOnFirst'
  | 'DiffSync_TimelineOnBetween'
  | 'DiffSync_TimelineOnLast'
  | 'DiffSync_StepByStates'
  | 'DiffSync_StepByTransitions'
  | 'DiffSync_StepBySteps'
  | 'DiffSync_StepByNestedTransitions'
  | 'DiffSync_StepByLive'
  | 'DiffSync_PlayStopClicked'
  | 'DiffSync_TimelineScrolled'
  | 'DiffSync_StepTypeChanged'
  | 'DiffSync_FullSync'
  | 'DiffSync_Any'
  | 'DiffSync_LegendVisible'
  | 'DiffSync_ConnectionDialogVisible'
  | 'DiffSync_LocalLogger'
  | 'DiffSync_Exception'
  | 'DiffSync_exit'
  | 'DiffSync_end'
  | 'LegendVisible_Exception'
  | 'LegendVisible_InitializingLayoutWorker'
  | 'LegendVisible_LayoutWorkerReady'
  | 'LegendVisible_DOMReady'
  | 'LegendVisible_Rendering'
  | 'LegendVisible_Rendered'
  | 'LegendVisible_InitialRenderDone'
  | 'LegendVisible_Connecting'
  | 'LegendVisible_Connected'
  | 'LegendVisible_Disconnected'
  | 'LegendVisible_AutoplayOn'
  | 'LegendVisible_Playing'
  | 'LegendVisible_TimelineOnFirst'
  | 'LegendVisible_TimelineOnBetween'
  | 'LegendVisible_TimelineOnLast'
  | 'LegendVisible_StepByStates'
  | 'LegendVisible_StepByTransitions'
  | 'LegendVisible_StepBySteps'
  | 'LegendVisible_StepByNestedTransitions'
  | 'LegendVisible_StepByLive'
  | 'LegendVisible_PlayStopClicked'
  | 'LegendVisible_TimelineScrolled'
  | 'LegendVisible_StepTypeChanged'
  | 'LegendVisible_FullSync'
  | 'LegendVisible_DiffSync'
  | 'LegendVisible_Any'
  | 'LegendVisible_ConnectionDialogVisible'
  | 'LegendVisible_LocalLogger'
  | 'LegendVisible_Exception'
  | 'LegendVisible_exit'
  | 'LegendVisible_end'
  | 'ConnectionDialogVisible_Exception'
  | 'ConnectionDialogVisible_InitializingLayoutWorker'
  | 'ConnectionDialogVisible_LayoutWorkerReady'
  | 'ConnectionDialogVisible_DOMReady'
  | 'ConnectionDialogVisible_Rendering'
  | 'ConnectionDialogVisible_Rendered'
  | 'ConnectionDialogVisible_InitialRenderDone'
  | 'ConnectionDialogVisible_Connecting'
  | 'ConnectionDialogVisible_Connected'
  | 'ConnectionDialogVisible_Disconnected'
  | 'ConnectionDialogVisible_AutoplayOn'
  | 'ConnectionDialogVisible_Playing'
  | 'ConnectionDialogVisible_TimelineOnFirst'
  | 'ConnectionDialogVisible_TimelineOnBetween'
  | 'ConnectionDialogVisible_TimelineOnLast'
  | 'ConnectionDialogVisible_StepByStates'
  | 'ConnectionDialogVisible_StepByTransitions'
  | 'ConnectionDialogVisible_StepBySteps'
  | 'ConnectionDialogVisible_StepByNestedTransitions'
  | 'ConnectionDialogVisible_StepByLive'
  | 'ConnectionDialogVisible_PlayStopClicked'
  | 'ConnectionDialogVisible_TimelineScrolled'
  | 'ConnectionDialogVisible_StepTypeChanged'
  | 'ConnectionDialogVisible_FullSync'
  | 'ConnectionDialogVisible_DiffSync'
  | 'ConnectionDialogVisible_LegendVisible'
  | 'ConnectionDialogVisible_Any'
  | 'ConnectionDialogVisible_LocalLogger'
  | 'ConnectionDialogVisible_Exception'
  | 'ConnectionDialogVisible_exit'
  | 'ConnectionDialogVisible_end'
  | 'LocalLogger_Exception'
  | 'LocalLogger_InitializingLayoutWorker'
  | 'LocalLogger_LayoutWorkerReady'
  | 'LocalLogger_DOMReady'
  | 'LocalLogger_Rendering'
  | 'LocalLogger_Rendered'
  | 'LocalLogger_InitialRenderDone'
  | 'LocalLogger_Connecting'
  | 'LocalLogger_Connected'
  | 'LocalLogger_Disconnected'
  | 'LocalLogger_AutoplayOn'
  | 'LocalLogger_Playing'
  | 'LocalLogger_TimelineOnFirst'
  | 'LocalLogger_TimelineOnBetween'
  | 'LocalLogger_TimelineOnLast'
  | 'LocalLogger_StepByStates'
  | 'LocalLogger_StepByTransitions'
  | 'LocalLogger_StepBySteps'
  | 'LocalLogger_StepByNestedTransitions'
  | 'LocalLogger_StepByLive'
  | 'LocalLogger_PlayStopClicked'
  | 'LocalLogger_TimelineScrolled'
  | 'LocalLogger_StepTypeChanged'
  | 'LocalLogger_FullSync'
  | 'LocalLogger_DiffSync'
  | 'LocalLogger_LegendVisible'
  | 'LocalLogger_ConnectionDialogVisible'
  | 'LocalLogger_Any'
  | 'LocalLogger_Exception'
  | 'LocalLogger_exit'
  | 'LocalLogger_end'
  | 'Exception_InitializingLayoutWorker'
  | 'Exception_LayoutWorkerReady'
  | 'Exception_DOMReady'
  | 'Exception_Rendering'
  | 'Exception_Rendered'
  | 'Exception_InitialRenderDone'
  | 'Exception_Connecting'
  | 'Exception_Connected'
  | 'Exception_Disconnected'
  | 'Exception_AutoplayOn'
  | 'Exception_Playing'
  | 'Exception_TimelineOnFirst'
  | 'Exception_TimelineOnBetween'
  | 'Exception_TimelineOnLast'
  | 'Exception_StepByStates'
  | 'Exception_StepByTransitions'
  | 'Exception_StepBySteps'
  | 'Exception_StepByNestedTransitions'
  | 'Exception_StepByLive'
  | 'Exception_PlayStopClicked'
  | 'Exception_TimelineScrolled'
  | 'Exception_StepTypeChanged'
  | 'Exception_FullSync'
  | 'Exception_DiffSync'
  | 'Exception_LegendVisible'
  | 'Exception_ConnectionDialogVisible'
  | 'Exception_LocalLogger'
  | 'Exception_exit'
  | 'Exception_end'

/** Typesafe state interface */
export interface IState extends IStateBase<TStates> {}

/** Subclassable typesafe state interface */
export interface IStateExt<T extends string> extends IStateBase<T | TStates> {}

export interface IBind extends IBindBase {
  // Non-params events and transitions
  (event: TTransitions, listener: () => boolean | void, context?: Object): this
}

export interface IEmit extends IEmitBase {
  // Non-params events and transitions
  (event: TTransitions): boolean | void
}

export interface IJSONStates {
  InitializingLayoutWorker: IState
  LayoutWorkerReady: IState
  DOMReady: IState
  Rendering: IState
  Rendered: IState
  InitialRenderDone: IState
  Connecting: IState
  Connected: IState
  Disconnected: IState
  AutoplayOn: IState
  Playing: IState
  TimelineOnFirst: IState
  TimelineOnBetween: IState
  TimelineOnLast: IState
  StepByStates: IState
  StepByTransitions: IState
  StepBySteps: IState
  StepByNestedTransitions: IState
  StepByLive: IState
  PlayStopClicked: IState
  TimelineScrolled: IState
  StepTypeChanged: IState
  FullSync: IState
  DiffSync: IState
  LegendVisible: IState
  ConnectionDialogVisible: IState
  LocalLogger: IState
  Exception?: IState
}
