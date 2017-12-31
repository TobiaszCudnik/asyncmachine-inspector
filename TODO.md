# TODO

#### Bugs
- grab & scroll "jumps" after grabbing
- current transitions lacks queue source machine as "involved"
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

#### UI
- download a snapshot keybinding
- mark a cancelled transition on the transition sidebar
- actions menu
  - reset positions
  - hotkeys for each (one hotkey -> focus -> keyboard navigation)
- smaller toolbar
  - redesign
- machines sidebar
  - machines - current transitions - involved: order alphabetically
  - add number of (output) pipes
  - sort-by select
    - default: queue length, listeners count
    - others: name, ticks, pipes
- keep in local storage
  - Step Type
- legend
  - grouping by type
    - active states
    - non active states
    - transition states
    - relations
  - descriptions
  - better background, dimmed out
  - a close button
    - esc key to close
  - generate the graph elements using the graph engine
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
- server config form
- hovering over state / machine / link names
  - highlights them / dims the background
  - AND/OR highlights all the other instances of that element
  - places like machine info, log view, graph, even the timeline
  - click scrolls to the element
  
#### Logger
- make it easier to bind to your machines
- transaction's source machine (the active queue) should also be marked as touched

#### Optimizations
- properly tree-shake asyncmachine as a logger dependency (its type-only)
- cache data service scrolling
  - including next & prev transitions
- move DataService patch scrolling to a separate worker
  - separate from the one dagre layout is in
- network should update the json based on incoming events, not a full rebuild
- render sidebars only when visible
- progressive list rendering for logs
- reduce the bundle size
  
#### Refactoring
- split into 3 npm modules
  - am-inspector
  - am-logger
  - am-inspector-server
- extract RemoteInspector with socket io
- rewrite the UI to grid & flex
- divide the UI class into several machines
- extract the main template
- merge similar types and UI components
- move different layouts into separate dirs
- graph-layout agnostic
  - UI class contains some jointjs structs
  - base class of the DataService needs to be extracted

#### Graph
- resize machine #1
- better colors
- descriptive transition styles
- pipe isnt exactly like add, nor pipe invert like drop, although shown like that
- take advantage of canceling async rendering available in the latest jointjs
- include state counters
- visualize the queue and listeners size
- visualize an active queue
- show the number of ticks in the state's UI

#### Transition Tree
- show transition as a tree
  - every nested transition duplicates the states
  - machines are nodes, states are leafs
  
#### Project
- bring back the socket IO client
- make a demo
- comments in the stackblitz demo file
  - Restaurant class should have a separate target
- short screencasts showing off specific features
  - links to live demos on stackblitz
- maybe - extract the cluster graph, worker-based dagre layout for jointjs
  into a module
