#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const open = require('open')

const PORT = process.argv[3] || 3797

http.createServer(function (req, res) {
  let path

  switch (req.url) {
    case '/':
    case '/index.html':
      path = 'index.html'
      break
    case '/am-inspector.umd.js':
      path = 'am-inspector.umd.js'
      break
  }

  if (!path) {
    res.statusCode = 404
    res.end(`File ${req.url} not found!`)
    return
  }

  fs.createReadStream(path).pipe(res)
}).listen(PORT)

const url = `http://localhost:${PORT}/`
open(url)
console.log(`AsyncMachine Inspector available at:
${url}`)
