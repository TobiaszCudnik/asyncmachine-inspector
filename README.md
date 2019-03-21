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
- workerpool for logger diffs
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
// main logger class
import { Logger, Network } from 'ami-logger'
// mixin to save files using the fs module
import FileFSMixin from 'ami-logger/mixins/snapshot/fs'
import { machine } from 'asyncmachine'
// example machine
const state = {
  Wet: { require: ['Water'] },
  Dry: { drop: ['Wet'] },
  Water: { add: ['Wet'], drop: ['Dry'] }
}
const example = machine(state)
// construct the logger class
const LoggerClass = FileFSMixin(Logger)
// instantiate the logger
const network = new Network(example)
const logger = new LoggerClass(network)
logger.start()
// make changes
example.add('Dry')
example.add('Water')
// save a snapshot
logger.saveFile('./snapshot.json')
```

## Usage

**Using snapshots**

1. Generate a snapshot using one of the following mixins
   - `ami-logger/mixins/file-fs` (node)
   - `ami-logger/mixins/file-http` (browser)
1. `$ am-inspector`
1. Load the snapshot using the toolbar

**Using the server**

1. `$ ami-server`
1. Use one of the following mixins
   - `ami-logger/mixins/remote-node`
   - `ami-logger/mixins/remote-browser`
1. `$ am-inspector -s`

**Browser bundles**

- `import { Logger, Network } from 'ami-logger/browser`
- `import { Logger, Network } from 'ami-logger/browser-remote`
- Both are bundled UMD modules, so the following will also work
  - `<script src='ami-logger/browser.js'><script>`
