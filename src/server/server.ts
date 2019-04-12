import * as io from 'socket.io'
import * as delay from 'delay'

export interface LoggerSocket extends SocketIO.Socket {
  loggerId: string
}

export default function createServer(snapshot = null) {
  const server = io()

  // TODO ?
  // @ts-ignore
  server.set('origins', '*:*')

  // LOGGER ENDPOINT

  const logger_endp = server.of('/logger')
  let data = snapshot
    ? snapshot
    : {
        full_sync: null,
        patches: []
      }

  logger_endp.on('connection', function(logger_socket: LoggerSocket) {
    console.log('logger connected')
    data = {
      full_sync: null,
      patches: []
    }
    // TODO disconnect the previous logger
    logger_socket.on('diff-sync', function(diff) {
      data.patches.push(diff)
      inspector_endp.emit('diff-sync', diff)
    })
    logger_socket.on('full-sync', function(full) {
      data.full_sync = full
      inspector_endp.emit('full-sync', full)
    })
    logger_socket.on('error', console.error.bind(console))
  })

  // INSPECTOR ENDPOINT

  type clientSocket = SocketIO.Socket
  const inspector_endp = server.of('/client')

  inspector_endp.on('connection', async function(
    inspector_socket: clientSocket
  ) {
    console.log('inspector connected')
    // logger_endp.emit('full-sync')
    // re-send existing data if an inspector connects after the logger
    if (data.patches.length) {
      inspector_socket.emit('full-sync', data.full_sync)
      console.log(`sending ${data.patches.length} patches...`)
      let c = 0
      let buffer = []
      for (let patch of data.patches) {
        // TODO check if still connected / cancel the loop
        // inspector_socket.emit('diff-sync', patch)
        buffer.push(patch)
        c++
        // if (c % 100) {
        //   console.log(c + '00')
        //   await delay(100)
        // }
        if (c % 1000 == 0) {
          inspector_socket.emit('batch-sync', buffer)
          buffer = []
          console.log(c)
          await delay(500)
        }
      }
      if (buffer.length) {
        inspector_socket.emit('batch-sync', buffer)
      }
    }

    // TODO hide it behind a flag
    inspector_socket.on('state-add', states => {
      logger_endp.emit('state-add', states)
    })
    inspector_socket.on('state-drop', states => {
      logger_endp.emit('state-drop', states)
    })
    inspector_socket.on('error', console.error.bind(console))
  })

  return server
}
