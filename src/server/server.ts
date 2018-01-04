import * as io from 'socket.io'

export interface LoggerSocket extends SocketIO.Socket {
  loggerId: string
}

export default function createServer() {
  const server = io()

  server.set('origins', '*:*')

  // LOGGER ENDPOINT

  const loggerEndpoint = server.of('/logger')

  loggerEndpoint.on('connection', function(socket: LoggerSocket) {
    console.log('logger connected')
    socket.on('diff-sync', function(diff) {
      console.dir(diff)
      uiEndpoint.emit('diff-sync', diff)
    })
    socket.on('full-sync', function(full) {
      uiEndpoint.emit('full-sync', full)
    })
    socket.on('error', console.error.bind(console))
  })

  // UI ENDPOINT

  type clientSocket = SocketIO.Socket
  const uiEndpoint = server.of('/client')

  uiEndpoint.on('connection', function(socket: clientSocket) {
    loggerEndpoint.emit('full-sync')
    // constructor
    console.log('new ui connected')
    socket.on('error', console.error.bind(console))
  })

  return server
}
