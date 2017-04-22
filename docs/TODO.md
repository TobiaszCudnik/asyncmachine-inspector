# TODO

#### Bugs
- machine's name duplicated inside of the background
- new machine lacks the style
- clicking play shows the bottom message "Connected"
- Transitions view is broken
- when dragging a node/machine the double-links remain sticky

#### UI
- right panel 
  - size change
- save / load from file
- server config form
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