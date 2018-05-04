# AsyncMachine Inspector

Inspector and a debugger for [AsyncMachine](https://github.com/TobiaszCudnik/asyncmachine).

[![Preview](http://tobiaszcudnik.github.io/asyncmachine-inspector/sample.png)](https://photos.app.goo.gl/ZZCQ6vH9iD1o9tEw6)

## Features
- shows a graph of asyncmachines with their states and relations
- rendered with jointjs (drag-drop, drag-scroll, zooming)
- automatically layout the graph (dagre in a worker, diff repaints)
- supports multiple machines and pipes between them
- live updates
- log view
- machines view
- transitions view
- minimap
- scrolling through the history
- highlighting and scrolling to states
- step by state changes, transitions or everything
- highlight transition-related elements
- preserve the UI settings to localstorage
- export / import of snapshots to json
- remote logger support via socketio
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
# connects the logger directly to the UI
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
  Water: {}
}
const example = machine(state)
// instantiate the logger
const network = new Network(example)
const logger = new Logger
// make changes
example.add('Dry')
// save a snapshot
logger.saveFile('./snapshot.json')
```

## Usage

### Using snapshots

1. Generate a snapshot
1. Run `am-inspector`
1. Load the snapshot using the toolbar

### Using the server

1. Run `am-server`
1. Use the `ami-logger/remote` module
1. Run `am-inspector`
