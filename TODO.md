# TODO

#### Bugs
- involved states in the transiton sidebar are missing separators
- links (edges) are highlighted as changed elements (red border)
- no UI msg when trying to load a broken snapshot
- links inside of the machine with step-type=step arent marked as touched
  - related to changed_ids logic
- clicking on the log sidebar to scroll the timeline with AutoPlay off
  - scrolls properly and then plays till the end
- when trying to load the 3rd snapshot, nothing happens
- bundle d.ts files
  - ami-logger
  - ami-server
- autoplay doesnt resume when set and timeline on the last position
- minimap sometimes shows the previous step
  - eg when going back in time with step type = steps
  - stiil reporo?
- logs scrollbar is forcefully scrolled down even if not at the bottom
- nested transitions are missing the stable-state/between-transitions step
- doesnt work on stackblitz
- switching StepType while Playing
  - causes a scrollTo with the old position value (of the next step)
- switching from LIVE to STATES mixes up the indexes
- not all touched machines drawn on the minimap
- selecting a machine isnt visible
- elements rendered out of the viewport (after layout)
- types missing when using ami-logger in a TS project
- worker dying while selecting a file (modal dialog, eg ios)
  - this.layout_worker.reset - undefined is not an object
- last position of playing doesnt change the button icon to Pause (from Playing)
- rendering out of canvas (use clientWidth for dagre layout consts)
- during Live step type
  - Play button should be grayed out
  - timeline should be scrollable
- uploading snapshots doesnt work on safari
- Cancelled states dont get un-marked
  - repro?
- cant distinguish cancelled from requested
  - during a transition
  - repro?
- sometimes drag-drop on a machine shifts states out of the machines borders
  - when dragging a machine during rendering (but not only)
  - every time in FF
- pipe source state sometimes not marked as touched
- current transitions lacks queue source machine as "involved"
- sometimes machine isnt marked as touched, although listed as Involved
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- changing the granularity from Transition Steps to States leaves artifacts
  - state_style, is_touched, .during-transition
- scrollbars in both sidebars
  - should have a dark background
- material UI components dont bubble the hotkeys
- jointjs sometimes incorrectly renders links (out of the viewport)
- BUG? step_type == transitions - cancelled transitions not included
- the left sidebar gets repainted when new diff arrives, although the content
  doesnt change
- the worker sometimes times out with debug=3 because of the DiffSync state flooding

#### Inspector
- ability to define the state of the UI when initializing the inspector
  - open sidebars, buttons states, step type
- narrow down timeline steps
  - to those related (touching) a selected machine(s)
- two finger trackpad zoom / out
- progress indicator (on the toolbar, from material)
- hovering over a graph cell highlights all the instances in the sidebars
- merge select, scroll-to, state names and the unicode checkbox into 1 feature
- summary
  - draggable
  - change size?
  - show the toolbar button only if there is a summary
- tabindex for
  - transitions sidebar
  - machines sidebar
  - logs sidebar
- click on a state to give cursor
  - Enter sets/unsets
  - space selects
- CLI flag to serve via the file protocol
- adjust zooming params
  - scroll zoom snaps to edges
  - pinch zoom works like a scroll zoom (`1, 2, 3` instead of `+1+1+1+1...`)
- Next / Prev button next to the step counter (left & right)
  - material ui Chip
- minimap
  - add materialui/paper (shadow)
  - drag scroll the minimap with a mouse
  - clicking on the minimap scrolls to the (clicked) machine
  - size should be responsive to the viewport size
- hotkeys
  - go to step
  - change step type
  - zoom in/out
  - show left sidebar
  - show right sidebar
- focus indicators
- API for setting markers on the timeline
  - query of state sets with context
  - eg [Reading] set/unset while [Foo,Bar] touched
- number of state changes or touched states as a flage graph above the timeline
- regenerate am-types
- catch errors when loading a snapshot
  - notify the user
  - progress UI
- implement node-debug as a logger
- scroll to a machine
  - toolbar switch to auto scroll to the current transition while stepping
  - click to scroll on machine and state names
    - log view
- load snapshots from URLs
- show the legend on the first load
- confirmation message for Reset
- Compare 2 snapshots with a diff on the timeline
- Options menu
  - Remember current positions
  - Reset
    - All Settings
    - Positions
    - Last Snapshot
  - Autoplay (checkbox)
  - Show Minimap
- download a snapshot keybinding
- mark a cancelled transition on the transition sidebar
- machines sidebar
  - machines - current transitions - involved: order alphabetically
  - add number of (output) pipes
  - sort-by select
    - default: queue length, listeners count
    - others: name, ticks, pipes
  - list all the states per machine with their counters
    - including inactive (eg '-Foo')
    - clicking on a state triggers add('Foo')
      - use predefined states as forms, ideally in a separate machine
	- text selection highlights the selected states / machines
- keep in localstorage / settings
  - Step Type
  - last timeline scroll position
  - the latest connection host
- full rerender as a button / action
- show time on the main UI
- maybe - auto-reconnect button
  - kept in the settings
- support multiple loggers simultaneously
  - allow to show/hide specific ones
- smaller toolbar
  - redesign
  - actions menu
    - reset positions
    - hotkeys for each (one hotkey -> focus -> keyboard navigation)
- legend
  - generate the graph elements using the graph engine
- ability to add a note to a graph
- live view, render in real time from a source
  - add as a new step type "live"
  - fps limit
- save as file / download a log on a hotkey
- log sidebar
  - filters
    - by log level / query text
    - bold or fade the matched entries or the rest
    - types (add, drop, set, rejected, transitions, etc...)
  - counters for log groups (patch index) and transitions (first-level, later nested)
    - click on the counter scrolls the timeline to that moment
    - hover on the transition number previews the whole transition
  - an option to show machine names
- timeline
  - tooltip with info about the step
    - transitions active
    - log entries from that step
    - states changed
  - stepping through nested transition (same UI as when hovering)
- split Machines Sidebar horizontally (transitions / machines), like in dev tools
- change background to white and align other colors
- sidebars
  - two fingers scroll
  - size change by mouse / hotkey
  
#### Data service worker
- keep cache in IndexedDB
  - validate by hash
  
#### Logger
- worker pool for jsondiffpatch
  - transfer data using redis / indexedb
  - GC
- optimize creating patches
  - port jsondiffpatch to wasm/rust?
- allow configurable CORS for the server bin
- transaction's source machine (the active queue) should also be marked as touched
- live stream to a file

#### Server
- https support
- support multiple loggers simultaneously

#### Optimizations
- take advantage of canceling async rendering available in the latest jointjs
- cache more stuff
  - `// TODO cache` comments
- send summary as a diff (npm:jsdiff)
- move the canvas rendering to a worker
- preheat jointjs by rendering 10 machines with 10 states each
  - then customize the names with first fullsync
  - always keep a buffor of 5 rendered machines
- extract layout.tsx into separate react components
  - implement custom shouldComponentUpdate
  - reduce re-renders, especially the log and machines view
- optimize jointjs'es render methods
  - drop translate, scale, rotate
  - use x/y coordinates directly from svg
- stream diffsync patches to the DB and throttle notifications to the worker
- start applying styles on the existing nodes
  - while the new ones are still being processed by the requested worker
- eliminate updateRelativeAttributes/getBBox calls in jointjs
  - use translateBy
- keep a merged diff against the full_sync every 100 patches in the exported snapshot
  - reduces scrolling times
  - expand the merged patches to full jsons, in the background
  - create patches between them (to get changed_ids easily)
- cancel rendering in case of the manual scroll position changed
  - MANUAL scroll only
  - dont render the intermidiate frames
- merge deltas instead of re-diffing
  - https://github.com/benjamine/jsondiffpatch/issues/39
- avoid binding to LayoutWorkerReady on every DiffSync
- render only selected machines (helps with big networks)
  - keep the visibility state in the settings
- properly tree-shake asyncmachine as a logger dependency (its type-only)
- cache data service scrolling
  - including next & prev transitions
- move DataService patch scrolling to a separate worker
  - separate from the one dagre layout is in
- network should update the json based on incoming events, not a full rebuild
- react-render sidebars (transitions, machines, logs) only if they are visible
- progressive list rendering for logs
- pre-render N next steps when playing (possibly in a pool of workers)
- longer delay for msgs than for a step they come from
- queue & merge scroll requests while rendering
  - ideally cancel the current rendering
  
#### Refactoring
- migrate to stock workerio
- switch from underscore to lodash
- extract /src/network to a separate module
- update jsondiffpatch
  - pull request the webworker compat
- update to webpack4 / parcel
- divide joint/graph.ts into smaller files
- extract layout.tsx into separate react components
  - implement custom shouldComponentUpdate
  - reduce re-renders, especially the log and machines view
- custom shape constructors (fsa.Arrow etc)
- renderUI() as a state
- rewrite the UI to grid & flex
- divide the UI class into several machines
- merge similar types and UI components
- graph-layout agnostic
  - UI class contains some jointjs structs
  - base class of the DataService needs to be extracted
- use the workerify webpack loader to simplify the build process

#### Graph
- TwoFingers gesture switches to drag scroll anywhere on the surface
- states should have a restriction area of the parent machine
- Transition step type should have 3 steps per transition
  - involved machines are highlighted in all 3 steps
  - 1 before the change, normal state styling
  - 2 involved states highlighted and with the transition styling
  - 3 after the change, normal state styling
  - after & before from different transitions represent the same step
    but are seperate steps on the timeline
  - 0.2s per step?
- visualize if a machine is during transition
  - to distinguish nested transitions
- show the number of ticks in the state's UI
- visualize the number of listeners (per machine)
- visualize if the queue is active (per machine)
- resize a machine
  - requires 'resisable' elements from jointjs
- better colors
- more descriptive transition styles
- 'pipe' isnt exactly like add, nor 'pipe invert' like drop
  - although shown like that

#### Transition Tree
- show transition as a tree
  - every nested transition duplicates the states
  - machines are nodes, states are leafs
  
#### Project
- READMEs for
  - examples
  - npm packages
- more dist forms
  - ES6 modules
    - es6 dist for the browser logger
  - TS files / d.ts
  - source maps
- webpack & typescript deps for the examples
- examples on stackblitz
  - generated state types
  - fixed types generator for merges
- comments in the stackblitz demo file
  - Restaurant class should have a separate target
- short screencasts showing off specific features
  - links to live demos on stackblitz / asciinema
- maybe - extract the cluster graph, worker-based dagre layout for jointjs
  - into a npm module
