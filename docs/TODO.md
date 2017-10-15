# TODO

#### Bugs
- when dragging a node/machine the double-links remain sticky
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- transition start should be merged with the first change
- zoom level too low

#### UI
- right panel 
  - size change
- server config form¡
- sticky graphs (define position once dragged by a user)
- legend
  - colors
  - transition styles (only during a transition)
  - background
- left sidebar
  - machine stats
    - queue size
    - listeners count
    - abort functions count
  - currently processing machine
- minimap
- new machine should be a 2 step highlighted transition
- touched states during transition (not a relation) should have a temp links
  from the source
  
#### Refactoring
- divide the UI class to several machines

#### Graph
- update to jointjs 2.1
- better colors
- descriptive transition styles

#### Transition Tree
- show transition as a tree
  - every nested transition duplicates the states
  - machines are nodes, states are leafs
  
#### Project
- run script (server, httpserver, browser UI)