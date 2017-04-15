0. build asyncmachine (optional)
`make build`
1. build the inspector
`webpack --watch`
3. compile TS for node
`tsc --watch`
4. start the server for the main UI
`./bin/sever`
5. start the server for the debug UI
`./bin/sever 4040`
6. open the main UI in the browser
`file://.../serc/ui/index.html`
7. open the debug UI in the browser
`file://.../serc/ui/index.html?port=4040`
8. start the logger client
...