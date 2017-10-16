/**
 * Intermediate server proxying traffic between Loggers (sources) and UIs
 * (consumers).
 * 
 * A lot of traffic is being duplicated at the moment.
 * 
 * TODO:
 * - when logger reconnects, re-bind the clients, perform a full sync
 */

import * as io from 'socket.io'
import * as _ from 'underscore'
import * as assert from 'assert/'
import { EventEmitter } from 'events'
// import '../polyfill'
// import AsyncMachine from 'asyncmachine'

interface IJoinEvent {
  loggerId: string
}

export interface LoggerSocket extends SocketIO.Socket {
  loggerId: string
}

export default function createServer(json): SocketIO.Server {
  const server = io()

  server.on('connection', () => {
    console.log('new connection')
  })

  // UI ENDPOINT

  let mockSocket = new EventEmitter()
  mockSocket.loggerId = 'mock'
  let loggerSockets = [mockSocket]
  type clientSocket = SocketIO.Socket
  var uiEndpoint = server.of('/client')
  var clientSockets: clientSocket[] = []

  // TODO gc
  var clientsPerLogger = new Map<LoggerSocket, clientSocket[]>()

  uiEndpoint.on('connection', function(socket: clientSocket) {
    // constructor
    console.log('new ui connected')
    clientSockets.push(socket)
    // handlers
    socket.on('disconnect', function() {
      clientSockets = _.without(clientSockets, socket)
    })

    // join logic
    socket.on('join', function(event: IJoinEvent) {
      console.log(`join ${event.loggerId}`)
      socket.join(event.loggerId)
      // TODO find by ID
      let loggerSocket = _.findWhere(loggerSockets, {
        loggerId: event.loggerId
      })

      if (!clientsPerLogger.has(loggerSocket))
        clientsPerLogger.set(loggerSocket, [])
      clientsPerLogger.get(loggerSocket).push(socket)
      // TODO group clients for this request
      loggerSocket.on('full-sync', function(json) {
        console.log(`full-sync from ${loggerSocket.loggerId}`)
        socket.emit('full-sync', json)
        // TODO stream-based full-sync
        // for (let cell of json.cells)
        //     socket.emit('full-sync', cell)
        // socket.emit('full-sync', null)
      })
      loggerSocket.emit('full-sync', json)
    })
    socket.on('error', console.error.bind(console))

    // send the list of loggers
    if (loggerSockets.length) {
      socket.emit('loggers', loggerSockets.map(socket => socket.loggerId))
    }
  })

  return server
}
