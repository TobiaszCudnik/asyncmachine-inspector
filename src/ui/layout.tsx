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
import { ILogEntry } from '../network'
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
  getPatchesCount(): number,
  isDuringTransition(): boolean,
  getPosition(): number,
  getLogs(): ILogEntry[][],
  onSlider: Function;
  msg: string;
  msgHidden: boolean;
  connectionDialog?: any;
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
export class Main extends Component<TLayoutProps, {msgHidden: boolean}> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      msgHidden: false
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

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main>
          {/*<ConnectionDialog config={this.props.connectionDialog} />*/}
          <section id="graph" className={this.props.isDuringTransition() && 'during-transition'} />
          <section id="side-bar">{(()=>{
            var container = []
            var logs = this.props.getLogs()
            for (let i = 0; i < logs.length; i++) {
                for (let ii = 0; ii < logs[i].length; ii++) {
                  let entry = logs[i][ii]
                  let key = `log-${i}-${ii}`
                  let className = `group-${entry.id}`
                  container.push(<span className={className} key={key}>{entry.msg}<br /></span>)
                }
            }
            return container
          })()}</section>
          <section id="bottom-bar">
            <Slider
              min={0}
              max={this.props.getPatchesCount() || 1}
              disabled={!this.props.getPatchesCount()}
              step={1}
              value={this.props.getPosition()}
              onChange={this.props.onSlider}
            />
          </section>

          <Slider id="zoom" style={{height: 100}} axis="y" defaultValue={0.5} />

          <section id="settings-bar">
            <RadioButtonGroup labelPosition="left" name="step-type" defaultSelected="states">
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