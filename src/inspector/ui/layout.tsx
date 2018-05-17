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
// @ts-ignore
import joint_css from '../joint/base.css'
// @ts-ignore
import inspector_css from '../inspector.css'
// TODO joint-specific imports END
import { TCell, TMachine, TState } from '../../network/json/joint'
import { StateChangeTypes } from 'asyncmachine/build/types'
import Settings from '../settings'
import * as deepCopy from 'deepcopy'
import { partial } from 'underscore'
import { StepTypes } from '../joint/data-service'
import { STEP_TYPE_CHANGE } from '../inspector'
import States from '../states'

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
  step_type: 'live' | 'transitions' | 'nested_transitions' | 'steps' | 'states'
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
  selected_ids: Set<string>
  is_rendered: boolean
  machines_states: { [machine_id: string]: TSidebarMachineState[] }
  summary: string
  // listeners
  onDownloadSnapshot: Function
  onConnectButton: Function
  onResetButton: Function
  onTimelineSlider: Function
  onZoomSlider: Function
  onStepType: Function
  onAutoplaySet: (state: boolean) => void
  onSummarySet: (state: boolean) => void
  onPlayButton: Function
  onHelpButton: Function
  onConnectSubmit: Function
  onCellSelect: Function
  onScrollTo: Function
  onStateSet: Function
  onTimelineScrollTo: Function
  // instances
  settings: Settings
  state: States
}

export type TSidebarMachineState = {
  name: string
  clock: number
  is_set: boolean
  is_selected: boolean
  is_touched: boolean
}

export type TLayoutState = {
  // rename to is_visible
  sidebar?: boolean
  // rename to is_visible
  sidebar_left?: boolean
  // rename to is_visible
  autoplay?: boolean
  // rename to is_visible
  summary: boolean
}

const log = (...args) => {}
// const log = (...args) => console.log(...args)

export class Main extends Component<TLayoutProps, TLayoutState> {
  constructor(props, context) {
    super(props, context)

    // TODO read those from localstorage
    // TODO add step_style to states
    this.state = {
      sidebar: props.settings.get().logs_visible,
      sidebar_left: props.settings.get().machines_visible,
      autoplay: props.settings.get().autoplay,
      summary: props.settings.get().summary_visible
    }

    // Dummy call to not get stylesheets stripped out by webpack
    // TODO
    const a = inspector_css + joint_css
  }

  // TODO merge those 3 state handlers
  handleToggleSidebar() {
    const new_state = !this.state.sidebar
    this.props.settings.set('logs_visible', new_state)
    this.setState({ ...this.state, sidebar: new_state })
  }

  handleToggleSidebarLeft() {
    const new_state = !this.state.sidebar_left
    this.props.settings.set('machines_visible', new_state)
    this.setState({ ...this.state, sidebar_left: new_state })
  }

  handleToggleAutoplay() {
    this.props.settings.set('autoplay', !this.state.autoplay)
    this.setState({ ...this.state, autoplay: !this.state.autoplay })
    this.props.onAutoplaySet(!this.state.autoplay)
  }

  handleToggleSummary() {
    this.props.settings.set('summary_visible', !this.state.summary)
    this.setState({ ...this.state, summary: !this.state.summary })
    this.props.onSummarySet(!this.state.summary)
  }

  render() {
    let d = this.props
    log('render() data', d)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main
          className={
            (this.state.sidebar ? 'right-sidebar-visible ' : '') +
            (this.state.sidebar_left ? 'left-sidebar-visible' : '')
          }
        >
          <Toolbar className="toolbar">
            <ToolbarGroup firstChild={true}>
              <div style={{ width: '7em', padding: '2em' }}>
                <Toggle
                  label="Machines"
                  defaultToggled={this.state.sidebar_left}
                  onToggle={this.handleToggleSidebarLeft.bind(this)}
                />
              </div>
              <FlatButton
                style={{ margin: 0 }}
                label="Help"
                onClick={this.props.onHelpButton}
              />
              <SelectField
                style={{ margin: '0 1em' }}
                floatingLabelText="Step by"
                value={this.props.step_type}
                onChange={this.props.onStepType}
              >
                {this.props.is_connected ||
                this.props.state.is('LocalLogger') ? (
                  <MenuItem value="live" primaryText="Live" />
                ) : (
                  ''
                )}
                <MenuItem value="states" primaryText="States" />
                <MenuItem value="transitions" primaryText="Transitions" />
                <MenuItem
                  value="nested_transitions"
                  primaryText="Nested Transitions"
                />
                <MenuItem value="steps" primaryText="Every Step" />
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
                    : this.props.is_connected
                      ? 'Connected'
                      : this.props.state.is('LocalLogger')
                        ? 'Local'
                        : 'Disconnected'
                }
              />
              {this.props.is_rendered ? (
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
              {/*TODO css */}
              <div style={{ width: '9em', paddingRight: '2em' }}>
                <Toggle
                  label="Summary"
                  defaultToggled={this.state.summary}
                  onToggle={this.handleToggleSummary.bind(this)}
                />
              </div>
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
          {/*<ConnectionDialog config={this.props.connectionDialog} />*/}
          <div
            id="graph-container"
            onClick={e => {
              if (e.target.classList.contains('hover')) return
              this.props.onStateSet(e)
              this.props.onScrollTo(e)
              this.props.onTimelineScrollTo(e)
              this.props.onCellSelect(e.target, e)
            }}
            onMouseOver={e => {
              if (!e.target.classList.contains('hover')) {
                // TODO parent hack
                if (e.target.parentNode.classList.contains('hover')) {
                  this.props.onCellSelect(e.target.parentNode, e, true)
                }
                return
              }
              this.props.onCellSelect(e.target, e, true)
            }}
            onMouseOut={e => {
              if (!e.target.classList.contains('hover')) {
                if (e.target.parentNode.classList.contains('hover')) {
                  this.props.onCellSelect(e.target.parentNode, e, false)
                }
                return
              }
              this.props.onCellSelect(e.target, e, false)
            }}
          >
            <div id="minimap">
              <canvas />
              <div className="zoom-window" />
            </div>

            <div id="graph-scroller">
              <div
                id="graph"
                tabIndex="0"
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
                            <span
                              key={entry.machine}
                              className="cell-select hover"
                              data-id={entry.machine}
                            >
                              [{machineName(entry.machine)}]
                            </span>{' '}
                            {entry.states.map(state => {
                              const id = entry.machine + ':' + state
                              return (
                                <span
                                  className="cell-select hover"
                                  data-id={id}
                                  key={id}
                                >
                                  {state}
                                </span>
                              )
                            })}
                          </span>
                        )
                      } else {
                        target_states = entry.states.map(state => (
                          <span
                            key={entry.machine + ':' + state}
                            className="cell-select hover"
                            data-id={entry.machine + ':' + state}
                          >
                            {state}
                          </span>
                        ))
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

                  function StateName({ name, machineId }) {
                    const id = machineId + ':' + name
                    return (
                      <span className="cell-select hover" data-id={id}>
                        {name}{' '}
                      </span>
                    )
                  }

                  function MachineName({ name, id }) {
                    return (
                      <span className="cell-select hover" data-id={id}>
                        {name}
                      </span>
                    )
                  }

                  // TODO merge QueueList and ActiveTransitionsList
                  function TransitionsList({
                    transitions,
                    name
                  }: {
                    transitions: ITransitionData[]
                    name: string
                  }) {
                    const items = transitions.map((entry, i) => {
                      let class_name = `joint-group-${entry.queue_machine_id}`
                      let type = getTransitionType(entry)
                      let target_states
                      if (entry.machine_id != entry.queue_machine_id) {
                        let class_name = `joint-group-${entry.machine_id}`
                        target_states = (
                          <span className={class_name}>
                            [<MachineName
                              name={machineName(entry.machine_id)}
                              id={entry.machine_id}
                            />]{' '}
                            {entry.states.map(state_name => (
                              <StateName
                                key={entry.machine_id + ':' + state_name}
                                name={state_name}
                                machineId={entry.machine_id}
                              />
                            ))}
                          </span>
                        )
                      } else {
                        target_states = entry.states.map(state_name => (
                          <StateName
                            key={entry.machine_id + ':' + state_name}
                            name={state_name}
                            machineId={entry.machine_id}
                          />
                        ))
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
                    const items = Object.entries(touched).map(
                      ([machine_id, states]) => {
                        let class_name = `joint-group-${machine_id}`
                        return (
                          <div key={name + machine_id} className={class_name}>
                            -{' '}
                            <strong>
                              <MachineName
                                name={machineName(machine_id)}
                                id={machine_id}
                              />
                            </strong>
                            {states.length ? ': ' : ''}
                            {states.length
                              ? states.map(state_name => (
                                  <StateName
                                    name={state_name}
                                    machineId={machine_id}
                                    key={machine_id + ':' + state_name}
                                  />
                                ))
                              : ''}
                          </div>
                        )
                      }
                    )
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
                          name="previous"
                        />
                        <TouchedNodes
                          touched={this.props.prev_transitions_touched}
                          transitions={this.props.prev_transitions}
                          name="previous"
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
                          name="active"
                        />
                        <TouchedNodes
                          touched={this.props.active_transitions_touched}
                          transitions={this.props.active_transitions}
                          name="active"
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
                          name="next"
                        />
                        <TouchedNodes
                          touched={this.props.next_transitions_touched}
                          transitions={this.props.next_transitions}
                          name="next"
                        />
                      </div>
                    )
                  }
                  container.push(
                    <div className={'transitions'} key={'transitions'}>
                      {transitions}
                    </div>
                  )
                  function MachineEntry({
                    machine,
                    states,
                    selected_ids,
                    step_type
                  }: {
                    machine: TMachine
                    states?: TSidebarMachineState[]
                    selected_ids?: Set<string>
                    step_type: string
                  }) {
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
                    // STATES
                    let state_list = states.reduce((prev, state) => {
                      // TODO extract / inherit
                      const id = machine.id + ':' + state.name
                      prev.push(
                        <div
                          key={id}
                          style={{ marginLeft: '1em' }}
                        >
                          <span
                            style={{
                              fontWeight: state.is_selected
                                ? 'bolder'
                                : 'normal'
                            }}
                            className={'cell-select hover'}
                            data-id={id}
                          >
                            {state.is_set ? '' : '-'}
                            {state.name}
                          </span>
                          <div className="state details">
                            <a href="#" className="cell-select" data-id={id}>
                              {state.is_selected ? '☑ un-select' : '☐ select'}
                            </a>{' '}
                            {step_type == 'live' ? (
                              <a href="#" className="state-set" data-id={id}>
                                {state.is_set ? 'unset' : 'set'}
                              </a>
                            ) : (
                              ''
                            )}{' '}
                            <a href="#" className="cell-scrollto" data-id={id}>
                              scroll-to
                            </a>{' '}
                            {state.clock}
                          </div>
                        </div>
                      )
                      return prev
                    }, [])
                    // MACHINE ENTRY
                    return (
                      <div key={machine.id} className={class_name}>
                        <h3
                          style={{ marginBottom: '0' }}
                          className={'cell-select hover'}
                          data-id={machine.id}
                        >
                          {machine.name}
                        </h3>
                        <div className="machine details">
                          <a
                            href="#"
                            className="cell-select"
                            data-id={machine.id}
                          >
                            {selected_ids.has(machine.id)
                              ? '☑ un-select'
                              : '☐ select'}
                          </a>{' '}
                          <a
                            href="#"
                            className="cell-scrollto"
                            data-id={machine.id}
                          >
                            scroll-to
                          </a>{' '}
                          {machine.ticks}
                        </div>
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
                        - STATES:
                        {state_list}
                      </div>
                    )
                  }
                  let machines = [<h2 key={'machines-title'}>Machines</h2>]
                  const machines_states = this.props.machines_states
                  for (const machine of Object.values(this.props.machines)) {
                    machines.push(
                      <MachineEntry
                        key={machine.id}
                        machine={machine}
                        states={machines_states[machine.id]}
                        selected_ids={this.props.selected_ids}
                        step_type={this.props.step_type}
                      />
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
                  function closeGroup(nodes, machine_id, patch_id, key) {
                    if (!nodes.length) return
                    const class_name = `joint-group joint-group-${machine_id} cell-select hover timeline-scroll-to`
                    container.push(
                      <div
                        data-id={machine_id}
                        data-patch_id={patch_id}
                        className={class_name}
                        key={key}
                      >
                        {nodes}
                      </div>
                    )
                  }
                  const logs = this.props.logs
                  for (let i = 0; i < logs.length; i++) {
                    let inner_container = []
                    let last_machine_id, last_key, last_patch_id
                    for (let ii = 0; ii < logs[i].length; ii++) {
                      const patch_id = i
                      const entry = logs[i][ii]
                      const key = `log-${i}-${ii}`
                      // flush
                      if (last_machine_id && last_machine_id != entry.id) {
                        closeGroup(
                          inner_container,
                          last_machine_id,
                          last_patch_id,
                          last_key
                        )
                        inner_container = []
                      }
                      last_machine_id = entry.id
                      last_key = key
                      last_patch_id = patch_id
                      const states = this.props.machines_states[entry.id]
                        ? this.props.machines_states[entry.id].map(s => s.name)
                        : []
                      let content = entry.msg
                      if (states.length) {
                        // TODO extract markStatesInHTML
                        // TODO exception `[pipe] 'Eating'
                        //   as 'CustomerEating' to 'Restaurant'`
                        content = content.replace(
                          new RegExp(
                            `(\\s|\\+|-|')(${states.join('|')})(\\s|,|$|')`,
                            'g'
                          ),
                          (m, pre, state, post) => `
                          ${pre}<span
                            class="cell-select hover"
                            data-id="${entry.id}:${state}"
                          >${state}
                          </span>
                          ${post}`
                        )
                      }
                      const class_name = `joint-group joint-group-${entry.id}`
                      // TODO inline-block
                      inner_container.push(
                        <span
                          style={{ display: 'block' }}
                          className={class_name}
                          key={key}
                          dangerouslySetInnerHTML={{
                            __html: content + '<br />'
                          }}
                        />
                      )
                    }
                    closeGroup(
                      inner_container,
                      last_machine_id,
                      last_patch_id,
                      last_key
                    )
                  }
                  return container
                })()}
              </div>
            </Drawer>
          </div>

          {this.state.summary && this.props.summary ? (
            <pre className="summary">{this.props.summary}</pre>
          ) : (
            ''
          )}

          {this.props.step_type != 'live' ? (
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
          ) : null}
          {this.props.step_type != 'live' ? (
            <Chip id="step-counter" style={{ border: '1px solid #808080' }}>
              {d.position} / {d.position_max}
            </Chip>
          ) : null}
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
  let right_sidebar = document.querySelector('.sidebar.right')
  const right_sidebar_scrolled = right_sidebar
    ? right_sidebar.clientHeight + right_sidebar.scrollTop ==
      right_sidebar.scrollHeight
    : true

  const layout = <Main {...props} />
  render(layout, container)

  right_sidebar = document.querySelector('.sidebar.right')

  // scroll to the bottom
  if (right_sidebar_scrolled) {
    right_sidebar.scrollTop = right_sidebar.scrollHeight
  }

  return layout
}
