# TODO

#### Bugs
- rewinding should pause
- require highlighted after the target state
  - target state - add - another state, not highlighted as separate steps
- transition start should be merged with the first change
  - avoid empty steps with nested transitions

#### UI
- save as file / download a log on a hotkey
- right panel
  - bold log level 1
  - size change
- change background to white and align other colors
- sticky graphs (define position once dragged by a user)
- legend
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
- server config form
- rewrite to grid & flex
  
#### Refactoring
- extract RemoteInspector with socket io
- divide the UI class into several machines

#### Graph
- update to jointjs 2.1
- better colors
- descriptive transition styles

#### Transition Tree
- show transition as a tree
  - every nested transition duplicates the states
  - machines are nodes, states are leafs
  
#### Project