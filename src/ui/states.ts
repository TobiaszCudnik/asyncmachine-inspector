import AsyncMachine from 'asyncmachine/src/asyncmachine'
import {
  TStates,
  IState,
  IBind,
  IEmit
} from './states-types'


export default class States
    extends AsyncMachine<TStates, IBind, IEmit> {
  // init
  InitializingLayoutWorker: IState = {
    auto: true,
    drop: ['LayoutWorkerReady']
  };
  LayoutWorkerReady: IState = {
    drop: ['InitializingLayoutWorker']
  };
  // graph render
  DOMReady: IState = {};
  // TODO WorkerLayout require ['FullSync', 'LayoutWorkerReady']
  Rendering: IState = {
    multi: true,
    require: ['FullSync', 'DOMReady', 'LayoutWorkerReady'],
    drop: ['Rendered']
  };
  Rendered: IState = {
    drop: ['Rendering'],
    add: ['InitialRenderDone']
  }
  InitialRenderDone: IState = {
    require: ['FullSync']
  };
  // connection
  Connecting: IState = {
    drop: ['Connected', 'Disconnected'],
    auto: true
  };
  Connected: IState = {
    drop: ['Connecting', 'Disconnected']
  };
  Joining: IState = {
    require: ['Connected'],
    drop: ['Joined', 'Disconnected']
  };
  Joined: IState = {
    require: ['Connected'],
    drop: ['Joining', 'Disconnected']
  };
  Disconnected: IState = {
    drop: ['Connected', 'Connecting', 'Joining', 'Joined']
  };
  // UIStates
  AutoplayOn: IState = {};
  Playing: IState = {
    require: ['AutoplayOn', 'InitialRenderDone'],
    auto: true
  };
  // slider states
  TimelineOnFirst: IState = {
    drop: ['TimelineOnLast', 'TimelineOnBetween']
  };
  TimelineOnBetween: IState = {
    drop: ['TimelineOnLast', 'TimelineOnFirst']
  };
  TimelineOnLast: IState = {
    drop: ['Playing', 'TimelineOnFirst', 'TimelineOnBetween']
  };
  // TODO not needed?
  StepByStates: IState = {
    drop: ['StepByTransitions', 'StepBySteps']
  };
  StepByTransitions: IState = {
    drop: ['StepByStates', 'StepBySteps']
  };
  StepBySteps: IState = {
    drop: ['StepByTransitions', 'StepByStates']
  };
  // UI inputs
  PlayStopClicked: IState = {};
  TimelineScrolled: IState = {
    add: ['Rendering']
  };
  StepTypeChanged: IState = {};
  // network inputs
  FullSync: IState = {
    multi: true,
    add: ['TimelineOnFirst']
  };
  DiffSync: IState = {
    multi: true
  };
  // TODO later
  // LogBarVisible: IState = {};
  // LogBarClicked: IState = {};
  // SidebarVisible: IState = {};
  // SidebarClicked: IState = {};
  // MessageVisible: IState = {};
  constructor(target) {
    super(target)
    this.registerAll()
    this.add('TimelineOnFirst')
    this.id('')
  }
}
