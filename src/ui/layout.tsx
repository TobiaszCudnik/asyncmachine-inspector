/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />
/// <reference path="../../typings/modules/react/index.d.ts" />
/// <reference path="../../typings/modules/react-dom/index.d.ts" />
/// <reference path="../../typings/modules/material-ui/index.d.ts" />
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
import { ILogEntry, ITransitionData } from '../network'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconPlay from 'material-ui/svg-icons/av/play-arrow'
import IconPause from 'material-ui/svg-icons/av/pause'
import Chip from 'material-ui/Chip'
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload'
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download'
import joint_css from './joint.css'
import inspector_css from './inspector.css'
import { StateChangeTypes } from 'asyncmachine/build/types'
import Settings from './settings'
// TODO this shouldnt be here
import { TMachine } from './joint-network'
import * as deepCopy from 'deepcopy'
import { partial } from 'underscore'

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
  // TODO dont use a layout specific type
  machines: { [machine_id: string]: TMachine }
  active_transitions: ITransitionData[]
  active_transitions_touched: { [machine_id: string]: string[] }
  prev_transitions: ITransitionData[]
  prev_transitions_touched: { [machine_id: string]: string[] }
  // listeners
  onDownloadSnapshot: Function
  onTimelineSlider: Function
  onZoomSlider: Function
  onStepType: Function
  onAutoplayToggle: Function
  onPlayButton: Function
  is_legend_visible: boolean
  settings: Settings
}

const log = (...args) => {}
// const log = (...args) => console.log(...args)

export class Main extends Component<
  TLayoutProps,
  { sidebar?: boolean; sidebar_left?: boolean, autoplay?: boolean }
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
                floatingLabelText="Granularity"
                value={this.props.step_type}
                onChange={this.props.onStepType}
              >
                <MenuItem value="states" primaryText="States" />
                <MenuItem value="transitions" primaryText="Transitions" />
                <MenuItem value="steps" primaryText="Transition steps" />
              </SelectField>
              <ToolbarTitle
                text={
                  this.props.is_snapshot
                    ? 'Snapshot'
                    : this.props.is_connected ? 'Connected' : 'Disconnected'
                }
              />

              <IconButton
                tooltip="Upload a snapshot"
                containerElement="label"
                onClick={this.props.onUploadSnapshot}
              >
                <FileUploadIcon />
                <input type="file" id="snapshot-upload" />
              </IconButton>
              <IconButton
                tooltip="Download a snapshot"
                onClick={this.props.onDownloadSnapshot}
              >
                <FileDownloadIcon />
              </IconButton>
            </ToolbarGroup>
            <ToolbarGroup>
              {/*TODO css */}
              <div style={{ width: '9em', padding: '2em' }}>
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
                    let class_name = `group-${machine_id}`
                    const items = queue.map((entry, i) => {
                      let type = getTransitionType(entry)
                      let target_states = ''
                      if (entry.machine != machine_id) {
                        let class_name = `group-${entry.machine}`
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
                    transitions = [...transitions]
                    transitions.reverse()
                    const items = transitions.map((entry, i) => {
                      let class_name = `group-${entry.queue_machine_id}`
                      let type = getTransitionType(entry)
                      let target_states = ''
                      if (entry.machine_id != entry.queue_machine_id) {
                        let class_name = `group-${entry.machine_id}`
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
                  const machineName = partial(
                    (machines, id: string) => machines[id].name,
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
                      let class_name = `group-${machine_id}`
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
                  if (this.props.active_transitions.length) {
                    container.push(
                      <div key="active-transitions">
                        <h2>Current transition</h2>
                        <TransitionsList
                          transitions={this.props.active_transitions}
                        />
                        <TouchedNodes
                          touched={this.props.active_transitions_touched}
                          transitions={this.props.active_transitions}
                        />
                      </div>
                    )
                  }
                  if (this.props.prev_transitions.length) {
                    container.push(
                      <div key="previous-transition">
                        <h2>Previous transition</h2>
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
                  function MachineEntry({ machine }: { machine: TMachine }) {
                    let class_name = `group-${machine.id}`
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
                        {machine.is_touched ? (
                          <div>- during transition</div>
                        ) : (
                          ''
                        )}
                        {queue}
                      </div>
                    )
                  }
                  container.push(<h2 key={'machines'}>Machines</h2>)
                  for (let machine of Object.values(this.props.machines)) {
                    container.push(
                      <MachineEntry key={machine.id} machine={machine} />
                    )
                  }
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
                      let class_name = `group-${entry.id}`
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
              {this.props.is_playing ? <IconPause /> : <IconPlay />}
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

          {/*<Snackbar*/}
          {/*open={(!!this.props.msg && !this.state.msgHidden)}*/}
          {/*message={this.props.msg || ''}*/}
          {/*autoHideDuration={2000}*/}
          {/*onRequestClose={this.handleCloseNotifications.bind(this)}*/}
          {/*/>*/}

          <div
            className="legend"
            style={{ display: this.props.is_legend_visible ? 'block' : 'none' }}
          >
            <div style={{ width: '50%', display: 'inline-block' }}>
              <h4>Non-transition states</h4>
              <ul className="states">
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A non-set state</span>
                </li>
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element is-auto"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A non-set auto-state</span>
                </li>
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element is-set"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A set state</span>
                </li>
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element is-multi is-set"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A set multi-state</span>
                </li>
              </ul>
            </div>
            <div style={{ width: '50%', display: 'inline-block' }}>
              <h4>Transition states</h4>
              <ul className="states">
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element step-requested"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A requested state</span>
                </li>
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element step-requested step-pipe"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A piped state</span>
                </li>
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element step-set"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A state to be set</span>
                </li>
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element step-drop"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>A state to be unset</span>
                </li>
                <li>
                  <span>
                    <svg>
                      <g
                        id="j_19"
                        className="joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element step-cancel"
                        data-type="fsa.State"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <g className="rotatable" id="v-168">
                          <g className="scalable" id="v-169">
                            <circle
                              strokeWidth="3"
                              fill="#ffffff"
                              stroke="#000000"
                              r="30"
                              cx="32"
                              cy="32"
                            />
                          </g>
                          <text
                            id="v-171"
                            y="0.8em"
                            fontWeight="800"
                            fontSize="14"
                            textAnchor="middle"
                            fill="#000000"
                            fontFamily="Arial, helvetica, sans-serif"
                            transform="translate(7, 21)"
                          >
                            {/*
                          <tspan id="v-174" dy="0em" x="0" class="v-line">
                            Requested
                          </tspan>
                          <tspan id="v-175" dy="1em" x="0" class="v-line">
                            and Set
                          </tspan>*/}
                          </text>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>Transition cancelled</span>
                </li>
              </ul>
            </div>
          </div>
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
