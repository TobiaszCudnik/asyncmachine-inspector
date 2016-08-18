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
import Ui from './joint'


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

export class Main extends Component<{}, {}> {
//   constructor(props, context) {
//     super(props, context);

//     this.handleRequestClose = this.handleRequestClose.bind(this);
//     this.handleTouchTap = this.handleTouchTap.bind(this);

//     this.state = {
//       open: false,
//     };
//   }

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

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <h1>Material-UI</h1>
          <h2>example project</h2>
          <div id="graph"></div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default function(container) {
  var layout = <Main/>
  render(layout, container)

  return layout
}