#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const open = require('open')
const cli = require('commander')
const package = require('./package.json')

cli
  .usage('-p 80 -h 0.0.0.0 -s "http://foo.com:3757"')
  .option('-p, --port [n]', 'Port to listen on (default: 3797, optional)')
  .option('-h, --host [n]', 'Host to listen on (default: localhost, optional)')
  .option('-s, --server [url]', 'Auto connect to a specific server (optional)')
  .version(package.version)
  .parse(process.argv)

const params = {
  port: cli.port || 3797,
  host: cli.host || 'localhost',
  server: cli.server
}

http.createServer(function (req, res) {
  let dir = __dirname
  let path

  switch (req.url) {
    case '/':
    case '/index.html':
      path = '/index.html'
      break
    case '/am-inspector.umd.js':
      path = '/am-inspector.umd.js'
      break
  }

  if (!path && req.url.match(/^\/\?/)) {
    path = '/index.html'
  }

  if (!path || !fs.existsSync(dir+path)) {
    res.statusCode = 404
    res.end(`File ${req.url} not found!`)
    return
  }

  fs.createReadStream(dir+path).pipe(res)
}).listen(params.port, params.host)

let url = `http://localhost:${params.port}/`
if (params.server) {
  url += '?server='+encodeURIComponent(params.server)
}
open(url)
console.log(`AsyncMachine Inspector available at:
${url}`)
