/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />
/// <reference path="../../typings/modules/react/index.d.ts" />
/// <reference path="../../typings/modules/react-dom/index.d.ts" />
/// <reference path="../../typings/modules/material-ui/index.d.ts" />


import * as React from 'react';
import { render } from 'react-dom';
import { Component } from 'react'
import {deepOrange500} from 'material-ui/styles/colors'; 
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Slider from 'material-ui/Slider';
import Snackbar from 'material-ui/Snackbar';
import {
  RadioButton, RadioButtonGroup
} from 'material-ui/RadioButton';
import Drawer from 'material-ui/Drawer';
import { ILogEntry } from '../network'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconPlay from 'material-ui/svg-icons/av/play-arrow';
import IconStop from 'material-ui/svg-icons/av/stop';
import Chip from 'material-ui/Chip';
// TODO undelete and branch
// import ConnectionDialog from './connection-dialog'


const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

export type TLayoutProps = {
  position_max: number
  is_during_transition: boolean
  position: number
  is_playing: boolean
  logs: ILogEntry[][]
  msg: string
  msgHidden: boolean
  step_type: string
  // listeners
  onTimelineSlider: Function
  onZoomSlider: Function
  onStepType: Function
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
export class Main extends Component<TLayoutProps, {msgHidden: boolean, sidebar: boolean}> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      msgHidden: false,
      sidebar: true,
    };
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
    this.setState({sidebar: !this.state.sidebar})
  }

  render() {
    let d = this.props
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main>
          <Chip id="step-counter" position={d.position} position_max={d.position_max}>
            {d.position} / {d.position_max}
          </Chip>
          {/*<ConnectionDialog config={this.props.connectionDialog} />*/}
          <section id="graph" className={this.props.is_during_transition && 'during-transition'} />
          {/* TODO extract to a separate component */}

          <Drawer className="sidebar-container" open={this.state.sidebar} openSecondary={true}>
            <div id="side-bar">
              <button onClick={this.handleToggleSidebar.bind(this)}>Hide</button>
              {(()=>{
              var container = []
              var logs = this.props.logs
              for (let i = 0; i < logs.length; i++) {
                for (let ii = 0; ii < logs[i].length; ii++) {
                  let entry = logs[i][ii]
                  let key = `log-${i}-${ii}`
                  let className = `group-${entry.id}`
                  container.push(<span className={className} key={key}>{entry.msg}<br /></span>)
                }
              }
              return container
            })()}</div>
          </Drawer>
          <section id="bottom-bar">
            <FloatingActionButton mini={true} style={{marginRight: '1em'}}
                onClick={d.onPlayButton} id="play-button">
              {this.props.is_playing ? <IconStop /> : <IconPlay />}
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

          <Slider id="zoom-slider"
            style={{height: 100}}
            min={20}
            max={200}
            step={10}
            axis="y"
            defaultValue={100}
            onChange={d.onZoomSlider} />

          <section id="settings-bar">
            <RadioButtonGroup labelPosition="left"
                name="step-type" defaultSelected={this.props.step_type}
                onChange={this.props.onStepType}>
              <RadioButton
                value="states"
                label="States"
              />
              <RadioButton
                value="transitions"
                label="Transitions"
              />
              <RadioButton
                value="steps"
                label="Steps"
              />
            </RadioButtonGroup>
          </section>


          <Snackbar
            open={(!!this.props.msg && !this.state.msgHidden)}
            message={this.props.msg || ''}
            autoHideDuration={2000}
            onRequestClose={this.handleCloseNotifications.bind(this)}
          />
        </main>
      </MuiThemeProvider>
    );
  }
}

export default function(container, props) {
  var layout = <Main {...props} />
  render(layout, container)

  return layout
}