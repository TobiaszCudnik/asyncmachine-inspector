# TODO

#### Bugs
- reversing on Transition Steps gives a diff result than going from the 
  beginning of the transition
  - difference in requested transitions
- pause, change step type - starts playing
- transaction's source machine (the active queue) should also be marked as touched
- machines sidebar should use full machine names
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- transition start should be merged with the first change
  - avoid empty steps with nested transitions
- changing the granularity from Transition Steps to States leaves artifacts
  - state_style, is_touched, .during-transition
- material UI components dont bubble the hotkeys
- jointjs sometimes incorrectly renders links (out of the viewport)
- grab & scroll "jumps" after grabbing
- new machine should be a 2 step highlighted transition

#### UI
- smaller toolbar
  - redesign
  - actions menu
    - reset all settings
    - reset positions
    - hotkeys for each (one hotkey -> focus -> keyboard navigation)
- machines sidebar
  - show the next transition
  - sort by queue length, length, index
- keep in local storage
  - Log Sidebar open state
  - Machines Sidebar open state
  - Step Type open state
  - fixed-position states (based on url & machine IDs)
  - introduce "reset" menu, resetting each or all of the above
- legend
  - list of hotkeys
  - grouping by type
    - active states
    - non active states
    - transition states
    - hotkeys
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

#### Optimizations
- move DataService patch scrolling to a separate worker then dagre layout is in
- network should update the json based on incoming events, not a full rebuild
- render sidebars only when visible
  
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
- maybe - extract the cluster graph, worker-based dagre layout for jointjs
  into a module
  