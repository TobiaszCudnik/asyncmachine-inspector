/// <reference path="../../../typings/globals/socket.io-client/index.d.ts" />
/// <reference path="../../../typings/modules/react/index.d.ts" />
/// <reference path="../../../typings/modules/react-dom/index.d.ts" />
/// <reference path="../../../typings/modules/material-ui/index.d.ts" />
import * as React from 'react'
import { render } from 'react-dom'
import { Component } from 'react'
import { deepOrange500 } from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Slider from 'material-ui/Slider'
import Snackbar from 'material-ui/Snackbar'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Toggle from 'material-ui/Toggle'
import Drawer from 'material-ui/Drawer'
import * as injectTapEventPlugin from 'react-tap-event-plugin'
import { ILogEntry, ITransitionData } from '../../network/network'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'
import PauseIcon from 'material-ui/svg-icons/av/pause'
import RemoteIcon from 'material-ui/svg-icons/action/settings-remote'
import IconButton from 'material-ui/IconButton'
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import Chip from 'material-ui/Chip'
import FlatButton from 'material-ui/FlatButton'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import Legend from './legend'
import ConnectionDialog from './connection-form'
// TODO joint-specific imports
import joint_css from '../joint/joint.css'
import inspector_css from '../inspector.css'
// TODO joint-specific imports END
import { TMachine } from '../joint/network'
import { StateChangeTypes } from 'asyncmachine/build/types'
import Settings from '../settings'
import * as deepCopy from 'deepcopy'
import { partial } from 'underscore'
import {StepTypes} from "../joint/data-service";
import {STEP_TYPE_CHANGE} from "../inspector";
// import whyDidYouUpdate from 'why-did-you-update'

// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouUpdate(React)
// }

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200
  }
}

// TODO move somewhere
injectTapEventPlugin()

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

type TTouchedNodes = { [machine_id: string]: string }

export type TLayoutProps = {
  position_max: number
  is_during_transition: boolean
  position: number
  is_connected: boolean
  is_snapshot: boolean
  on_last: boolean
  is_playing: boolean
  logs: ILogEntry[][]
  step_type: string
  is_legend_visible: boolean
  is_connection_dialog_visible: boolean
  // TODO dont use a layout specific type
  machines: { [machine_id: string]: TMachine }
  active_transitions: ITransitionData[]
  active_transitions_touched: { [machine_id: string]: string[] }
  prev_transitions: ITransitionData[]
  prev_transitions_touched: { [machine_id: string]: string[] }
  next_transitions: ITransitionData[]
  next_transitions_touched: { [machine_id: string]: string[] }
  // listeners
  onDownloadSnapshot: Function
  onConnectButton: Function
  onResetButton: Function
  onTimelineSlider: Function
  onZoomSlider: Function
  onStepType: Function
  onAutoplaySet: (state: boolean) => void
  onPlayButton: Function
  onHelpButton: Function
  onConnectSubmit: Function
  // instances
  settings: Settings
}

const log = (...args) => {}
// const log = (...args) => console.log(...args)

export class Main extends Component<
  TLayoutProps,
  { sidebar?: boolean; sidebar_left?: boolean; autoplay?: boolean }
> {
  constructor(props, context) {
    super(props, context)

    // TODO read those from localstorage
    // TODO add step_style to states
    this.state = {
      sidebar: props.settings.get().logs_visible,
      sidebar_left: props.settings.get().machines_visible,
      autoplay: props.settings.get().autoplay
    }

    // Dummy call to not get stylesheets stripped out by webpack
    // TODO
    const a = inspector_css + joint_css
  }

  // TODO merge those 3 state handlers
  handleToggleSidebar() {
    this.props.settings.set('logs_visible', !this.state.sidebar)
    this.setState({ sidebar: !this.state.sidebar })
  }

  handleToggleSidebarLeft() {
    this.props.settings.set('machines_visible', !this.state.sidebar_left)
    this.setState({ sidebar_left: !this.state.sidebar_left })
  }

  handleToggleAutoplay() {
    this.props.settings.set('autoplay', !this.state.autoplay)
    this.setState({ autoplay: !this.state.autoplay })
    this.props.onAutoplaySet(!this.state.autoplay)
  }

  render() {
    let d = this.props
    log('render() data', d)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main>
          <Toolbar className="toolbar">
            <ToolbarGroup firstChild={true}>
              <div style={{ width: '7em', padding: '2em' }}>
                <Toggle
                  label="Machines"
                  defaultToggled={this.state.sidebar_left}
                  onToggle={this.handleToggleSidebarLeft.bind(this)}
                />
              </div>
              <SelectField
                style={{ margin: '0 1em' }}
                floatingLabelText="Step by"
                value={this.props.step_type}
                onChange={this.props.onStepType}
              >
                <MenuItem value="states" primaryText="States" />
                <MenuItem value="transitions" primaryText="Transitions" />
                <MenuItem value="steps" primaryText="Transition steps" />
              </SelectField>
            </ToolbarGroup>
            <ToolbarGroup>
              <IconButton
                tooltip="Connect to a server"
                onClick={this.props.onConnectButton}
              >
                <RemoteIcon />
              </IconButton>
              <IconButton tooltip="Upload a snapshot" containerElement="label">
                <FileUploadIcon />
                <input type="file" id="snapshot-upload" />
              </IconButton>
              <ToolbarTitle
                text={
                  this.props.is_snapshot
                    ? 'Snapshot'
                    : this.props.is_connected ? 'Connected' : 'Disconnected'
                }
              />
              {this.props.is_connected ? (
                <IconButton
                  tooltip="Download as a snapshot"
                  onClick={this.props.onDownloadSnapshot}
                >
                  <FileDownloadIcon />
                </IconButton>
              ) : (
                ''
              )}
            </ToolbarGroup>
            <ToolbarGroup>
              <FlatButton
                style={{ margin: 0 }}
                label="Reset"
                onClick={this.props.onResetButton}
              />
              <FlatButton
                style={{ margin: 0 }}
                label="Help"
                onClick={this.props.onHelpButton}
              />
              {/*TODO css */}
              <div style={{ width: '9em', paddingRight: '2em' }}>
                <Toggle
                  label="Autoplay"
                  defaultToggled={this.state.autoplay}
                  onToggle={this.handleToggleAutoplay.bind(this)}
                />
              </div>
              <div style={{ width: '7em' }}>
                <Toggle
                  label="Logs"
                  defaultToggled={this.state.sidebar}
                  onToggle={this.handleToggleSidebar.bind(this)}
                />
              </div>
            </ToolbarGroup>
          </Toolbar>
          <Chip id="step-counter" style={{ border: '1px solid #808080' }}>
            {d.position} / {d.position_max}
          </Chip>
          {/*<ConnectionDialog config={this.props.connectionDialog} />*/}
          <div id="graph-container">
            <div id="graph-scroller">
              <div
                id="graph"
                className={
                  this.props.is_during_transition && 'during-transition'
                }
              />
            </div>

            {/* TODO extract to a separate component */}
            <Drawer
              className="sidebar-container left"
              open={this.state.sidebar_left}
              style={{ position: 'absolute' }}
            >
              <div className="sidebar left">
                {(() => {
                  function getTransitionType(entry: {
                    type: StateChangeTypes
                    auto: boolean
                  }) {
                    let auto = entry.auto ? ':auto' : ''
                    switch (entry.type) {
                      case StateChangeTypes.ADD:
                        return `[add${auto}]`
                      case StateChangeTypes.DROP:
                        return `[drop${auto}]`
                      case StateChangeTypes.SET:
                        return `[set${auto}]`
                    }
                  }

                  function QueueList({ machine_id, queue }) {
                    let class_name = `joint-group-${machine_id}`
                    const items = queue.map((entry, i) => {
                      let type = getTransitionType(entry)
                      let target_states = ''
                      if (entry.machine != machine_id) {
                        let class_name = `joint-group-${entry.machine}`
                        target_states = (
                          <span className={class_name}>
                            [{machineName(entry.machine)}]{' '}
                            {entry.states.join(' ')}
                          </span>
                        )
                      } else {
                        target_states = <span>{entry.states.join(' ')}</span>
                      }
                      return (
                        <span className={class_name} key={i}>
                          {type} {target_states}
                          <br />
                        </span>
                      )
                    })
                    return <div>{items}</div>
                  }

                  // TODO merge QueueList and ActiveTransitionsList
                  function TransitionsList({
                    transitions
                  }: {
                    transitions: ITransitionData[]
                  }) {
                    const items = transitions.map((entry, i) => {
                      let class_name = `joint-group-${entry.queue_machine_id}`
                      let type = getTransitionType(entry)
                      let target_states = ''
                      if (entry.machine_id != entry.queue_machine_id) {
                        let class_name = `joint-group-${entry.machine_id}`
                        target_states = (
                          <span className={class_name}>
                            [{machineName(entry.machine_id)}]{' '}
                            {entry.states.join(' ')}
                          </span>
                        )
                      } else {
                        target_states = <span>{entry.states.join(' ')}</span>
                      }
                      return (
                        <span className={class_name} key={i}>
                          {type} {target_states}
                          <br />
                        </span>
                      )
                    })
                    return items.length ? <div>{items}</div> : null
                  }

                  // TODO make it less bad
                  // TODO for 'next transition' theres still no name in the json
                  const machineName = partial(
                    (machines, id: string) =>
                      (machines[id] && machines[id].name) || id,
                    this.props.machines
                  )

                  function TouchedNodes({
                    touched,
                    transitions
                  }: {
                    touched: TTouchedNodes
                    transitions?: ITransitionData[]
                  }) {
                    touched = deepCopy(touched)
                    // show touched only when not directly requested
                    for (let trans of transitions || []) {
                      if (!touched[trans.machine_id]) continue
                      touched[trans.machine_id] = _.difference(
                        touched[trans.machine_id],
                        trans.states
                      )
                      if (!touched[trans.machine_id].length)
                        delete touched[trans.machine_id]
                    }
                    const items = Object.entries(
                      touched
                    ).map(([machine_id, states]) => {
                      let class_name = `joint-group-${machine_id}`
                      return (
                        <div key={machine_id} className={class_name}>
                          - <strong>{machineName(machine_id)}</strong>
                          {states.length ? ': ' + states.join(' ') : ''}
                        </div>
                      )
                    })
                    return items.length ? (
                      <div>
                        <br />
                        <strong>Involved</strong>
                        {items}
                      </div>
                    ) : null
                  }

                  let container = []
                  let transitions = [
                    <h2 key={'transitions-title'}>Transitions</h2>
                  ]
                  if (this.props.prev_transitions.length) {
                    transitions.push(
                      <div key="prev-transition">
                        <h3>Previous</h3>
                        <TransitionsList
                          transitions={this.props.prev_transitions}
                        />
                        <TouchedNodes
                          touched={this.props.prev_transitions_touched}
                          transitions={this.props.prev_transitions}
                        />
                      </div>
                    )
                  }
                  if (this.props.active_transitions.length) {
                    transitions.push(
                      <div key="active-transitions">
                        <h3>Current</h3>
                        <TransitionsList
                          transitions={this.props.active_transitions}
                        />
                        <TouchedNodes
                          touched={this.props.active_transitions_touched}
                          transitions={this.props.active_transitions}
                        />
                      </div>
                    )
                  } else if (this.props.step_type != STEP_TYPE_CHANGE.STATES) {
                    transitions.push(
                      <div key="active-transitions">
                        <h3>Current</h3>
                        NONE
                      </div>
                    )
                  }
                  if (this.props.next_transitions.length) {
                    transitions.push(
                      <div key="next-transition">
                        <h3>Next</h3>
                        <TransitionsList
                          transitions={this.props.next_transitions}
                        />
                        <TouchedNodes
                          touched={this.props.next_transitions_touched}
                          transitions={this.props.next_transitions}
                        />
                      </div>
                    )
                  }
                  container.push(
                    <div className={'transitions'} key={'transitions'}>
                      {transitions}
                    </div>
                  )
                  function MachineEntry({ machine }: { machine: TMachine }) {
                    let class_name = `joint-group-${machine.id}`
                    let queue
                    if (machine.processing_queue) {
                      queue = (
                        <div key={'queue'}>
                          - EXECUTING QUEUE:
                          <QueueList
                            machine_id={machine.id}
                            queue={machine.queue}
                          />
                        </div>
                      )
                    } else if (machine.queue.length) {
                      queue = (
                        <div key={'queue'}>
                          - pending queue:
                          <QueueList
                            machine_id={machine.id}
                            queue={machine.queue}
                          />
                        </div>
                      )
                    }
                    return (
                      <div key={machine.id} className={class_name}>
                        <h3 style={{ marginBottom: '0' }}>{machine.name}</h3>
                        - listeners: {machine.listeners}
                        <br />
                        - ticks: {machine.ticks}
                        <br />
                        {machine.is_touched ? (
                          <div>- during transition</div>
                        ) : (
                          ''
                        )}
                        {queue}
                      </div>
                    )
                  }
                  let machines = [<h2 key={'machines-title'}>Machines</h2>]
                  for (let machine of Object.values(this.props.machines)) {
                    machines.push(
                      <MachineEntry key={machine.id} machine={machine} />
                    )
                  }
                  container.push(<div key={'machines'}>{machines}</div>)
                  return container
                })()}
              </div>
            </Drawer>

            {/* TODO extract to a separate component */}
            <Drawer
              className="sidebar-container"
              open={this.state.sidebar}
              openSecondary={true}
            >
              <div className="sidebar right">
                {(() => {
                  let container = []
                  const logs = this.props.logs
                  for (let i = 0; i < logs.length; i++) {
                    for (let ii = 0; ii < logs[i].length; ii++) {
                      let entry = logs[i][ii]
                      let key = `log-${i}-${ii}`
                      let class_name = `joint-group-${entry.id}`
                      // TODO inline-block
                      container.push(
                        <span className={class_name} key={key}>
                          {entry.msg}
                          <br />
                        </span>
                      )
                    }
                  }
                  return container
                })()}
              </div>
            </Drawer>
          </div>

          <section id="bottom-bar">
            <FloatingActionButton
              mini={true}
              style={{ marginRight: '1em' }}
              onClick={d.onPlayButton}
              id="play-button"
              disabled={this.props.on_last}
            >
              {this.props.is_playing ? <PauseIcon /> : <PlayIcon />}
            </FloatingActionButton>
            <Slider
              id="step-slider"
              min={0}
              max={this.props.position_max || 1}
              disabled={!this.props.position_max}
              step={1}
              value={this.props.position}
              onChange={this.props.onTimelineSlider}
            />
          </section>
          {d.is_legend_visible ? <Legend /> : ''}
          {d.is_connection_dialog_visible ? (
            <ConnectionDialog onSubmit={this.props.onConnectSubmit} />
          ) : (
            ''
          )}
        </main>
      </MuiThemeProvider>
    )
  }
}

export default function(container, props) {
  const layout = <Main {...props} />
  render(layout, container)
  // scroll to the bottom
  document.querySelector('.sidebar.right').scrollTop = 99999

  return layout
}
