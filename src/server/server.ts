import * as io from 'socket.io'

export interface LoggerSocket extends SocketIO.Socket {
  loggerId: string
}

export default function createServer() {
  const server = io()

  server.set('origins', '*:*')
  server.on('connect', () => {
    console.log('new connection')
  })

  // LOGGER ENDPOINT

  const loggerEndpoint = server.of('/logger')

  loggerEndpoint.on('connection', function(socket: LoggerSocket) {
    console.log('logger connected')
    socket.on('diff-sync', function(diff) {
      uiEndpoint.emit('diff-sync', diff)
    })
    socket.on('full-sync', function(full) {
      uiEndpoint.emit('full-sync', full)
    })
    socket.on('error', console.error.bind(console))
  })

  // INSPECTOR ENDPOINT

  type clientSocket = SocketIO.Socket
  const uiEndpoint = server.of('/client')

  uiEndpoint.on('connection', function(socket: clientSocket) {
    console.log('inspector connected')
    loggerEndpoint.emit('full-sync')
    socket.on('error', console.error.bind(console))
  })

  return server
}
