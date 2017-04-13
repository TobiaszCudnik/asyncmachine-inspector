0. build asyncmachine (optional)
`make build`
1. build the inspector
`webpack --watch`
2. start the server for the main UI
`./bin/sever`
3. start the server for the debug UI
`./bin/sever 4040`
4. open the main UI in the browser
`file://.../serc/ui/index.html`
5. open the debug UI in the browser
`file://.../serc/ui/index.html?port=4040`
6. start the logger client
...