#!/usr/bin/env node

require('source-map-support').install()

var port = process.argv[2] || 3757

require('./server/server').default()
    .listen(port)

console.log(`Listening on ${port}`)
