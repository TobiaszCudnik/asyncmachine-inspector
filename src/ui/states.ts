import AsyncMachine from 'asyncmachine'
import { TStates, IState, IBind, IEmit } from './states-types'

export default class States extends AsyncMachine<TStates, IBind, IEmit> {
  // init
  InitializingLayoutWorker: IState = {
    auto: true,
    drop: ['LayoutWorkerReady']
  }
  LayoutWorkerReady: IState = {
    drop: ['InitializingLayoutWorker']
  }
  // graph render
  DOMReady: IState = {}
  Rendering: IState = {
    multi: true,
    require: ['FullSync', 'DOMReady', 'LayoutWorkerReady'],
    drop: ['Rendered']
  }
  Rendered: IState = {
    drop: ['Rendering'],
    add: ['InitialRenderDone']
  }
  InitialRenderDone: IState = {
    require: ['FullSync']
  }
  // connection
  Connecting: IState = {
    drop: ['Connected', 'Disconnected'],
    auto: true
  }
  Connected: IState = {
    drop: ['Connecting', 'Disconnected']
  }
  Joining: IState = {
    require: ['Connected'],
    drop: ['Joined', 'Disconnected']
  }
  Joined: IState = {
    require: ['Connected'],
    drop: ['Joining', 'Disconnected']
  }
  Disconnected: IState = {
    drop: ['Connected', 'Connecting', 'Joining', 'Joined']
  }
  // UIStates
  AutoplayOn: IState = {}
  Playing: IState = {
    require: ['InitialRenderDone']
  }
  // slider states
  TimelineOnFirst: IState = {
    drop: ['TimelineOnLast', 'TimelineOnBetween']
  }
  TimelineOnBetween: IState = {
    drop: ['TimelineOnLast', 'TimelineOnFirst']
  }
  TimelineOnLast: IState = {
    drop: ['Playing', 'TimelineOnFirst', 'TimelineOnBetween']
  }
  // TODO not needed?
  StepByStates: IState = {
    drop: ['StepByTransitions', 'StepBySteps']
  }
  StepByTransitions: IState = {
    drop: ['StepByStates', 'StepBySteps']
  }
  StepBySteps: IState = {
    drop: ['StepByTransitions', 'StepByStates']
  }
  // UI inputs
  PlayStopClicked: IState = {}
  TimelineScrolled: IState = {
    add: ['Rendering'],
    drop: ['Playing']
  }
  StepTypeChanged: IState = {}
  // network inputs
  FullSync: IState = {
    multi: true,
    add: ['TimelineOnFirst']
  }
  DiffSync: IState = {
    multi: true
  }
  LegendVisible: IState = {}
  // TODO later
  // SidebarVisible: IState = {};
  // MachinesSidebarVisible: IState = {};
  // GlobalHotkey: IState = {};
  constructor(target) {
    super(target)
    this.registerAll()
    this.id('')
  }
}
