import * as io from 'socket.io'
import * as delay from 'delay'

export interface LoggerSocket extends SocketIO.Socket {
  loggerId: string
}

export default function createServer(snapshot = null) {
  const server = io()

  server.set('origins', '*:*')

  // LOGGER ENDPOINT

  const loggerEndpoint = server.of('/logger')
  let data = snapshot
    ? snapshot
    : {
        full_sync: null,
        patches: []
      }

  loggerEndpoint.on('connection', function(socket: LoggerSocket) {
    console.log('logger connected')
    data = {
      full_sync: null,
      patches: []
    }
    // TODO disconnect the previous logger
    socket.on('diff-sync', function(diff) {
      data.patches.push(diff)
      uiEndpoint.emit('diff-sync', diff)
    })
    socket.on('full-sync', function(full) {
      data.full_sync = full
      uiEndpoint.emit('full-sync', full)
    })
    socket.on('error', console.error.bind(console))
  })

  // INSPECTOR ENDPOINT

  type clientSocket = SocketIO.Socket
  const uiEndpoint = server.of('/client')

  uiEndpoint.on('connection', async function(socket: clientSocket) {
    console.log('inspector connected')
    // loggerEndpoint.emit('full-sync')
    // re-send existing data if an inspector connects after the logger
    if (data.patches.length) {
      socket.emit('full-sync', data.full_sync)
      console.log(`sending ${data.patches.length} patches...`)
      let c = 0
      let buffer = []
      for (let patch of data.patches) {
        // TODO check if still connected / cancel the loop
        // socket.emit('diff-sync', patch)
        buffer.push(patch)
        c++
        // if (c % 100) {
        //   console.log(c + '00')
        //   await delay(100)
        // }
        if (c % 1000 == 0) {
          socket.emit('batch-sync', buffer)
          buffer = []
          console.log(c)
          await delay(500)
        }
      }
      if (buffer.length) {
        socket.emit('batch-sync', buffer)
      }
    }
    socket.on('error', console.error.bind(console))
  })

  return server
}
