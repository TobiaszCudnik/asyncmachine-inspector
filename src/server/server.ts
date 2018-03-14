import * as io from 'socket.io'
import * as delay from 'delay'

export interface LoggerSocket extends SocketIO.Socket {
  loggerId: string
}

export default function createServer(
  port = 3757,
  host = 'localhost',
  snapshot = null
) {
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
      for (let patch of data.patches) {
        socket.emit('diff-sync', patch)
        c++
        if (c % 100) {
          console.log(c + '00')
          await delay(100)
        }
      }
    }
    socket.on('error', console.error.bind(console))
  })

  return server
}
