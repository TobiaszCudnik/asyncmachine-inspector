import * as io from 'socket.io'

export interface LoggerSocket extends SocketIO.Socket {
  loggerId: string
}

export default function createServer() {
  const server = io()

  server.set('origins', '*:*')

  // LOGGER ENDPOINT

  const loggerEndpoint = server.of('/logger')
  let data = {
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

  uiEndpoint.on('connection', function(socket: clientSocket) {
    console.log('inspector connected')
    // loggerEndpoint.emit('full-sync')
    // re-send existing data if an inspector connects after the logger
    if (data.patches.length) {
      socket.emit('full-sync', data.full_sync)
      for (let patch of data.patches) {
        socket.emit('diff-sync', patch)
      }
    }
    socket.on('error', console.error.bind(console))
  })

  return server
}
