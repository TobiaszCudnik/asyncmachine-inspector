# AsyncMachine Inspector

Inspector and a debugger for the [AsyncMachine](https://github.com/TobiaszCudnik/asyncmachine).

![Preview](http://tobiaszcudnik.github.io/asyncmachine-inspector/sample.png)

## Features
- shows a graph of asyncmachines with their states and relations
- rendered with jointjs (drag-drop, drag-scroll, zooming)
- automatically layout the graph (dagre in a worker, diff repaints)
- supports multiple machines and pipes between them
- live updates
- log view
- machines view
- transitions view
- scrolling through the history
- step by state changes, transitions or everything
- highlight transition-related elements
- preserve the UI settings to localstorage
- export / import of snapshots to json
- remote logger support via socketio
- automatic colors
- keyboard navigation
- legend
- a lot more on the [TODO list](https://github.com/TobiaszCudnik/asyncmachine-inspector/blob/master/docs/TODO.md)

## Live demos

- [restaurant example](https://stackblitz.com/edit/asyncmachine-inspector-restaurant)

## Install

```
npm install asyncmachine-inspector
```
