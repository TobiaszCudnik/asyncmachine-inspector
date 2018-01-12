# TODO

#### Bugs
- is-touched highlighting during a transition is broken
- Cancelled states dont get un-marked (repro)
- cant distinguish cancelled from requested
  - during a transition
- uploading a snapshot after one is already loaded doesnt work
- current transitions lacks queue source machine as "involved"
- sometimes machine isnt marked as touched, although listed as Involved
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- changing the granularity from Transition Steps to States leaves artifacts
  - state_style, is_touched, .during-transition
- material UI components dont bubble the hotkeys
- jointjs sometimes incorrectly renders links (out of the viewport)
- BUG? step_type == transitions - cancelled transitions not included, result:
  - when step_type == steps - more transitions shown
  - while not included in the "next / current / prev transition" sidebar
- the left sidebar gets repainted when new diff arrives, although the content
  doesnt change
- the worker sometimes times out with debug=3 because of the DiffSync state flooding
  - import snapshots in the async way

#### Inspector
- load snapshots from URLs
- show the legend on the first load
- reset confirmation message
- download a snapshot keybinding
- mark a cancelled transition on the transition sidebar
- machines sidebar
  - machines - current transitions - involved: order alphabetically
  - add number of (output) pipes
  - sort-by select
    - default: queue length, listeners count
    - others: name, ticks, pipes
- keep in localstorage / settings
  - Step Type
  - last timeline scroll position
  - the latest connection host
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
  - count transition requests ([add|set|drop])
    - counters outside of the panel, on the left, aligned to the right
- split Machines Sidebar horizontally (transitions / machines), like in dev tools
- change background to white and align other colors
- sidebars
  - size change by mouse / hotkey
- minimap
  - using clusters graph positions
  - render as div[width,height], use the colors
  - skip relations
- hovering over state / machine / link names
  - highlights them / dims the background
  - AND/OR highlights all the other instances of that element
  - places like machine info, log view, graph, even the timeline
  - click scrolls to the element
  
#### Data service worker
- keep cache in IndexedDB
  - validate by hash
  
#### Logger
- allow configurable CORS for the server bin
- make it easier to bind to your machines
- transaction's source machine (the active queue) should also be marked as touched
- live stream to a file
- dont depend on the asyncmachine module

#### Server
- support multiple loggers simultaneously

#### Optimizations
- start applygin styles on the existing nodes
  - while the new ones still being processed by the worker
- eliminate updateRelativeAttributes/getBBox calls in jointjs
  - use translateBy
- keep a merged diff against the full_sync every 100 patches in the exported snapshot
  - reduces the scrolling times
  - expand the merged patches to full jsons in the background
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
- resize machine #1
- better colors
- descriptive transition styles
- pipe isnt exactly like add, nor pipe invert like drop, although shown like that
- take advantage of canceling async rendering available in the latest jointjs
- include state counters
- visualize a number of listeners
- visualize an active queue
- show the number of ticks in the state's UI

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
  - links to live demos on stackblitz
- maybe - extract the cluster graph, worker-based dagre layout for jointjs
  into a module
