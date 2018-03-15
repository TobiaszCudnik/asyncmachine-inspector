#!/usr/bin/env node

require('source-map-support').install()
const cli = require('commander')
const fs = require('fs')
const package = require('./package.json')

cli
  .usage('-p 80 -h 0.0.0.0 -s "http://foo.com:3757"')
  .option('-p, --port [n]', 'Port to listen on (default: 3797, optional)')
  .option('-h, --host [n]', 'Host to listen on (default: localhost, optional)')
  .option('-s, --snapshot [file]', 'Load snapshot from a [file] (optional)')
  .version(package.version)
  .parse(process.argv)

const params = {
  port: cli.port || 3757,
  host: cli.host || 'localhost',
  snapshot_file: cli.snapshot
}

if (params.snapshot_file) {
  console.log(`Loading a snapshot from ${params.snapshot_file}`)
}
const snapshot = params.snapshot_file
  ? JSON.parse(fs.readFileSync(params.snapshot_file))
  : null

console.log(`Listening on ${params.port}`)
require('./server/server')
  .default(snapshot)
  // .listen(params.port, params.host)
  .listen(params.port)
console.log(`.listen(${params.port}, '${params.host}')`)