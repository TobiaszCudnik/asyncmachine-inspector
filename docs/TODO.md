# TODO

#### Bugs
- non-normalized machine names in the machines sidebar
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- transition start should be merged with the first change
  - avoid empty steps with nested transitions
- changing the granularity from Transition Steps to States leaves artifacts
  - state_style, is_touched, .during-transition

#### UI
- memorize the latest state of Log Sidebar and Machines Sidebar
- save as file / download a log on a hotkey
- log sidebar
  - filters
    - by log level / query text
    - bold or fade the matched entries or the rest
  - count transition requests ([add|set|drop])
    - counters outside of the panel, on the left, aligned to the right
- change background to white and align other colors
- sticky graphs (define position once dragged by a user)
- legend
  - list hotkeys
  - grouping
  - descriptions
  - better background, dimmed out
  - close button
- sidebars
  - size change
- minimap
  - using clusters graph positions
  - render as div[width,height], use the colors
  - skip relations
- new machine should be a 2 step highlighted transition
- server config form
- rewrite to grid & flex
  
#### Refactoring
- extract RemoteInspector with socket io
- divide the UI class into several machines

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