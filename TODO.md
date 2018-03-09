# TODO

#### Bugs
- cant connect using the toolbar button
- uploading snapshots doesnt work on safari
- more colors need, as after ~20 machines, rest is gray
- loading a snapshot doesnt show the log entires, but
  - resuming from the last one does (with the same snapshot data)
- autoconnect even without the server param?
- download a snapshot broken?
- legend broken colors (class name prefix?)
- node remote logger doesnt have the file logger features
- changing from step type - step to transitions causes a js error
  - blindSetPosition, assert, position == -1
  - while in the middle of a transition
- refresh doesnt preserve the scroll position
  - becasue of the zoom issue, its impossible to find the rendered graph
  - inspector -> svg -> scroll to view is a tmp workaround
- after the logger reconnects
  - full graph reset required
  - timeline slider moves to 0 (OK)
  - no re-render at all (wrong)
  - after scrolling the timeline, machines arent centered (wrong)
  - state styles remain in the "in transition" (wrong)
    - if the previous step style was "steps" and the rendered view had "step styles" active
- autoplay not honored on a logger re-connect
- dont load the last snapshot automatically if theres a server URL param present
- asyncmachine-inspector npm doesnt work on stackblitz
- long distance zoom out and in blocks scrolling
  - when zoomed out and in 2 distant places
- scroll to the middle, press play 
  - playing starts from a later position
  - should start from the selected one
  - affects all the step types
- is-touched highlighting during a transition is broken
- Cancelled states dont get un-marked (repro)
- cant distinguish cancelled from requested
  - during a transition
- sometimes drag-drop on a machine shifts states out of the machines borders
  - when dragging a machine during rendering (but not only)
  - every time in FF
- pipe source state sometimes not marked as touched
- uploading a snapshot after one is already loaded doesnt work
- current transitions lacks queue source machine as "involved"
- sometimes machine isnt marked as touched, although listed as Involved
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- changing the granularity from Transition Steps to States leaves artifacts
  - state_style, is_touched, .during-transition
- scrollbars in both sidebars
  - should have a dark background
  - overlap the last line and last chars in a line (padding required)
- material UI components dont bubble the hotkeys
- jointjs sometimes incorrectly renders links (out of the viewport)
- BUG? step_type == transitions - cancelled transitions not included
- changing step_type doesnt preserve the proper position
  1 set step_type == transitions
  2 move to in between some transitions
  3 set step_type == steps
  4 go fwd one step
  - expected: the next transition from step 2 should start
  - result: the previous transition from step 2 actually starts 
- the left sidebar gets repainted when new diff arrives, although the content
  doesnt change
- the worker sometimes times out with debug=3 because of the DiffSync state flooding
  - import snapshots in the async way

#### Inspector
- catch errors when loading a snapshot
  - notify the user
  - progress UI
- implement node-debug as a logger
- scroll to a machine
  - toolbar switch to auto scroll to the current transition while stepping
  - click to scroll on machine and state names
    - machines view
    - transitions view
    - log view
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
  - list all the states per machine with their counters
    - including inactive (eg '-Foo')
    - clicking on a state triggers add('Foo')
      - use predefined states as forms, ideally in a separate machine
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
- optimize creating patches
  - port jsondiffpatch to wasm/rust?
- use the new asyncmachine log handlers API
- ability to hook-in a custom logger, visible in the log sidebar
- allow configurable CORS for the server bin
- make it easier to bind to your machines
- transaction's source machine (the active queue) should also be marked as touched
- live stream to a file
- dont depend on the asyncmachine module

#### Server
- support multiple loggers simultaneously

#### Optimizations
- disable console.time calls when in production
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
- click on a state marks it with an outline
  - so its easy to distinguish when zoomed out
  - should work with marking transition-related states
- Transition step type should have 3 steps per transition
  - involved machines are highlighted in all 3 steps
  - before the change, normal state styling
  - involved states highlighted and with the transition styling
  - after the change, normal state styling
  - after & before from different transitions represent the same step
    but are seperate steps on the timeline
- ability to see nested transitions separately
- play mode with transition step should fast-forward the single steps
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
- take advantage of canceling async rendering available in the latest jointjs

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
