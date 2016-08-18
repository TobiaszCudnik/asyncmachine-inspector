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

export class Main extends Component<{connected: boolean}, {}> {
  constructor(props, context) {
    super(props, context);

    this.handleCloseNotifications = this.handleCloseNotifications.bind(this)

    this.state = {
      msgsCount: 1,
      step: 1,
      hideConnected: false
    };
  }

//   handleRequestClose() {
//     this.setState({
//       open: false,
//     });
//   }

//   handleTouchTap() {
//     this.setState({
//       open: true,
//     });
//   }

  handleSlider(event, value) {
    this.setState({step: value});
  }

  handleCloseNotifications() {
    this.setState({hideConnected: true})
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main>
          <section id="graph" />
          <section id="side-bar">
TODOoo...<br />
[add] B<br />
[add:implied] Foo<br />
[transition] Foo_enter<br />
[cancelled] B, Foo by the method Foo_enter<br />
[add] A<br />
[add:implied] Foo<br />
[transition] Foo_enter<br />
[states] +A +Foo<br />
[ 'A', 'Foo' ]<br />
          </section>
          <section id="bottom-bar">
            <Slider
              min={0}
              max={this.state.msgsCount}
              step={1}
              value={this.state.step}
              onChange={this.handleSlider.bind(this)}
            />
          </section>


          <Snackbar
            open={this.props.connected && !this.state.hideConnected}
            message="Connected!"
            autoHideDuration={2000}
            onRequestClose={this.handleCloseNotifications}
          />
        </main>
      </MuiThemeProvider>
    );
  }
}

export default function(container, connected) {
  var layout = <Main connected={connected} />
  render(layout, container)

  return layout
}