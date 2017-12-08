# TODO

#### Bugs
- pause, change step type - starts playing
- non-normalized machine names in the machines sidebar
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- transition start should be merged with the first change
  - avoid empty steps with nested transitions
- changing the granularity from Transition Steps to States leaves artifacts
  - state_style, is_touched, .during-transition
- material UI components dont bubble the hotkeys
- jointjs sometimes incorrectly renders links (out of the viewport)

#### UI
- memorize the latest state of Log Sidebar and Machines Sidebar, Step Type
- sticky graphs (define position once dragged by a user)
- legend
  - list hotkeys
  - grouping
  - descriptions
  - better background, dimmed out
  - close button
  - generate the graph elements using the graph engine
- save as file / download a log on a hotkey
- log sidebar
  - filters
    - by log level / query text
    - bold or fade the matched entries or the rest
  - count transition requests ([add|set|drop])
    - counters outside of the panel, on the left, aligned to the right
- change background to white and align other colors
- sidebars
  - size change
- minimap
  - using clusters graph positions
  - render as div[width,height], use the colors
  - skip relations
- new machine should be a 2 step highlighted transition
- server config form
- hovering over state / machine / link names
  - highlights them / dims the background
  - AND/OR highlights all the other instances of that element
  - places like machine info, log view, graph, even the timeline
  - click scrolls to the element
  
#### Logger
- make it easier to bind to your machines

#### Optimizations
- move DataService patch scrolling to a separate worker then dagre layout is in
- network should update the json based on incoming events, not a full rebuild
- render sidebars only when visible
  
#### Refactoring
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
- better colors
- descriptive transition styles
- pipe isnt exactly like add, nor pipe invert like drop, although shown like that
- take advantage of canceling async rendering available in the latest jointjs
- include state counters
- visualize the queue and listeners size
- visualize an active queue

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
