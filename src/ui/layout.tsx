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
import { ILogEntry } from '../network'
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
// TODO undelete and branch
// import ConnectionDialog from './connection-dialog'

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

export type TLayoutProps = {
  position_max: number
  is_during_transition: boolean
  position: number
  is_connected: boolean
  is_snapshot: boolean
  on_last: boolean
  is_playing: boolean
  logs: ILogEntry[][]
  msg: string
  msgHidden: boolean
  step_type: string
  // listeners
  onDownloadSnapshot: Function
  onTimelineSlider: Function
  onZoomSlider: Function
  onStepType: Function
  onAutoplayToggle: Function
  onPlayButton: Function
}

/**
 * TODO
 * - legend with state meanings (WHILE during transition)
 * - step by
 *   - states
 *   - transitions
 *   - steps
 * - step counter
 * - play/pause button
 * - zoom in/out slider (+background dragging)
 * - keystrokes
 *   - space pause/resume
 *   - left/right patch left right
 */
export class Main extends Component<
  TLayoutProps,
  { msgHidden: boolean; sidebar: boolean }
> {
  constructor(props, context) {
    super(props, context)

    this.state = {
      msgHidden: false,
      sidebar: true
    }
  }

  handleCloseNotifications() {
    this.setState({
      msgHidden: true
    })
  }

  componentWillReceiveProps(props) {
    if (props.msg) {
      this.setState({
        msgHidden: false
      })
    }
  }

  // TODO
  handleToggleSidebar() {
    console.log('handleToggleSidebar')
    this.setState({ sidebar: !this.state.sidebar })
  }

  render() {
    let d = this.props
    console.log('render() data', d)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main>
          <Toolbar className="toolbar">
            <ToolbarGroup firstChild={true}>
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
                  defaultToggled={true}
                  onToggle={this.props.onAutoplayToggle}
                />
              </div>
              <div style={{ width: '7em' }}>
                <Toggle
                  label="Logs"
                  defaultToggled={true}
                  onToggle={this.handleToggleSidebar.bind(this)}
                />
              </div>
              {/*<RaisedButton label="Logs" onClick={this.handleToggleSidebar.bind(this)}/>*/}
            </ToolbarGroup>
          </Toolbar>
          <Chip
            id="step-counter"
            position={d.position}
            position_max={d.position_max}
          >
            {d.position} / {d.position_max}
          </Chip>
          {/*<ConnectionDialog config={this.props.connectionDialog} />*/}
          <div id="graph-wrapper">
            <div
              id="graph"
              className={this.props.is_during_transition && 'during-transition'}
            />

            {/* TODO extract to a separate component */}
            <Drawer
              className="sidebar-container"
              open={this.state.sidebar}
              openSecondary={true}
            >
              <div id="side-bar">
                {(() => {
                  let container = []
                  const logs = this.props.logs
                  for (let i = 0; i < logs.length; i++) {
                    for (let ii = 0; ii < logs[i].length; ii++) {
                      let entry = logs[i][ii]
                      let key = `log-${i}-${ii}`
                      let className = `group-${entry.id}`
                      container.push(
                        <span className={className} key={key}>
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

          <div className="legend">
            <ul className="states">
              <li>
                <span>
                  <svg>
                    <circle
                      stroke-width="3"
                      fill="#ffffff"
                      stroke="#000000"
                      r="30"
                      cx="30"
                      cy="30"
                    />
                  </svg>
                </span>
                <span>Test 1</span>
              </li>
              <li>
                <span>
                  <svg>
                    <circle
                      stroke-width="3"
                      fill="#ffffff"
                      stroke="#000000"
                      r="30"
                      cx="30"
                      cy="30"
                    />
                  </svg>
                </span>
                <span>Test 2</span>
              </li>
              <li>
                <span>
                  <svg>
                    <circle
                      stroke-width="3"
                      fill="#ffffff"
                      stroke="#000000"
                      r="30"
                      cx="30"
                      cy="30"
                    />
                  </svg>
                </span>
                <span>Test 3</span>
              </li>
            </ul>
          </div>
        </main>
      </MuiThemeProvider>
    )
  }
}

export default function(container, props) {
  var layout = <Main {...props} />
  render(layout, container)
  // scroll to the bottom
  document.getElementById('side-bar').scrollTop = 99999

  return layout
}
