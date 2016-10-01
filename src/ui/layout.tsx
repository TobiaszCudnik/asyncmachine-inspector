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

type MainProps = {
  diffs: any[];
  msg: string;
  step: number;
  onSlider: Function;
  connectionDialog?: any;
  duringTransition: boolean;
}

/**
 * TODO
 * - legend with state meanings (WHILE during transition)
 * - switches for
 *   - "show transition"
 *   - "show steps"
 * - keystrokes
 *   - space pause/resume (requires the frame time)
 *   - left/right patch left right
 */
export class Main extends Component<MainProps, {msgHidden: boolean}> {
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
          <section id="graph" className={this.props.duringTransition && 'during-transition'} />
          <section id="side-bar">{(()=>{
            var container = []
            for(let i = 0; i < this.props.step; i++) {
                let diff = this.props.diffs[i]
                for (let ii = 0; ii < diff.logs.length; ii++) {
                  let entry = diff.logs[ii]
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
              max={this.props.diffs.length || 1}
              disabled={!this.props.diffs.length}
              step={1}
              value={this.props.step}
              onChange={this.props.onSlider}
            />
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