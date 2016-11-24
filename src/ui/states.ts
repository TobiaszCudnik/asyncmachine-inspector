import AsyncMachine from 'asyncmachine'
import {
  TStates,
  IState,
  IBind,
  IEmit,
  ITransitions
} from './states-types'

export default class States
    extends AsyncMachine<TStates, IBind, IEmit> {
  AutoplayOn: IState = {};
  Playing: IState = {
    require: ['AutoplayOn'],
    auto: true
  };
  // graph render
  DOMReady: IState = {};
  Rendering: IState = {
    require: ['FullSync', 'DOMReady'],
    drop: ['Rendered']
  };
  Rendered: IState = {
    drop: ['Rendering']
  }
  InitialRenderDone: IState = {
    require: ['FullSync'],
    add: ['Rendered']
  };
  // connection
  Connecting: IState = {
    drop: ['Connected', 'Disconnected']
  };
  Connected: IState = {
    drop: ['Connecting', 'Disconnected']
  };
  Joining: IState = {
    drop: ['Joined', 'Disconnected']
  };
  Joined: IState = {
    drop: ['Joining', 'Disconnected']
  };
  Disconnected: IState = {
    drop: ['Connected', 'Connecting', 'Joining', 'Joined']
  };
  // slider states
  TimelineOnFirst: IState = {
    drop: ['TimelineOnLast']
  };
  TimelineOnLast: IState = {
    drop: ['Playing', 'TimelineOnFirst']
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
  TimelineScrolled: IState = {};
  StepTypeChanged: IState = {};
  // network inputs
  FullSync: IState = {
    add: ['TimelineOnFirst']
  };
  DiffSync: IState = {};
  // TODO later
  // LogBarVisible: IState = {};
  // LogBarClicked: IState = {};
  // SidebarVisible: IState = {};
  // SidebarClicked: IState = {};
  // MessageVisible: IState = {};
  constructor(target) {
    super(target)
    this.registerAll()
  }
}
