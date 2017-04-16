# TODO

#### Bugs
- machine's name duplicated inside of the background
- new machine lacks the style
- scrolling mixes up step_types
- autoplay stops before the last position
- grab scroll shifts the position to the bottom 
  - coz of padding / margin?

#### UI
- counters
- grab to scroll
- right panel 
  - collapsable
  - size change
- save / load from file
- server config form
- scroll zooms into the cursor position
- fix bottom layout
  - text backgrounds
  - paddings
  - slider size / background
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
  
#### Refactoring
- divide the UI class to several machines

#### Graph
- split camel names `FooBar` to `Foo Bar`
- prevent link overlapping between graph nodes
- update to jointjs 2.1
- better colors
- descriptive transition styles

#### Transition Tree
- show transition as a tree
  - every nested transition duplicates the states
  - machines are nodes, states are leafs
  
#### Project
- run script (server, httpserver, browser UI)