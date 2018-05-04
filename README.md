# AsyncMachine Inspector

Inspector and a debugger for [AsyncMachine](https://github.com/TobiaszCudnik/asyncmachine).

[![Preview](http://tobiaszcudnik.github.io/asyncmachine-inspector/sample.png)](http://tobiaszcudnik.github.io/asyncmachine-inspector/sample.mp4)

## Features
- shows a graph of [AsyncMachines](https://github.com/TobiaszCudnik/asyncmachine) with their states and relations
- rendered with [JointJS](https://github.com/clientIO/joint) (drag-drop, drag-scroll, zooming)
- automatically layout the graph ([dagre](https://github.com/dagrejs/dagre) in a worker, diff repaints)
- supports multiple machines and pipes between them
- live updates
- log view
- machines view
- transitions view
- minimap
- scrolling through the history
- step by state changes, transitions or everything
- highlight transition-related elements
- highlighting and scrolling to states
- preserve the UI settings to localstorage
- export / import of snapshots to json
- remote logger support via [socket.io](https://github.com/socketio/socket.io)
- automatic colors
- keyboard navigation
- legend
- still [work in progress](https://github.com/TobiaszCudnik/asyncmachine-inspector/blob/master/docs/TODO.md)

## [Live demo](https://stackblitz.com/edit/asyncmachine-inspector-restaurant)

## Install

```bash
# UI
npm install -g asyncmachine-inspector
# Logger module
npm install ami-logger
# Server component
# (connects the logger directly to the UI)
npm install -g ami-server
```

## Example

```typescript
import { Logger, Network } from 'ami-logger'
import { machine } from 'asyncmachine'
// example machine
const state = {
  Wet: { drop: ['Dry'], require: ['Water'] },
  Dry: { drop: ['Wet'] },
  Water: { add: ['Wet'] }
}
const example = machine(state)
// instantiate the logger
const network = new Network(example)
const logger = new Logger(network)
// make changes
example.add('Dry')
example.add('Water')
// save a snapshot
logger.saveFile('./snapshot.json')
```

## Usage

**Using snapshots**

1. Generate a snapshot
1. `$ am-inspector`
1. Load the snapshot using the toolbar

**Using the server**

1. `$ am-server`
1. Use the `ami-logger/remote` module
1. `$ am-inspector -s`

**Logging in the browser**

- `import { Logger, Network } from 'ami-logger/browser`
- `import { Logger, Network } from 'ami-logger/browser-remote`
- Both are bundled UMD modules, so `<script src='ami-logger/browser.js'><script>`