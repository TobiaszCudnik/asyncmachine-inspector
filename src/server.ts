import * as io from 'socket.io'
import * as _ from 'underscore'
import * as assert from 'assert'
import AsyncMachine from 'asyncmachine'


// const io = require('socket.io')
// const _ = require('underscore')
// const assert = require('assert')

const server = io()

server.on('connection', () => {
    console.log('new connection')
})

// class LoggerClient {
//     io: SocketIO.Socket
//     states: AsyncMachine
    
//     constructor(io) {
//         this.io = io
//         this.states = AsyncMachine.factory({
//             Connecting: {
//                 blocks: ['Connected']
//             },
//             Connected: {
//                 blocks: ['Disconnected']
//             },
//             Disconnecting: {
//                 blocks: ['Disconnected']
//             },
//             Disconnected: {
//                 blocks: ['Disconnecting']
//             }
//         })
//     }
    
//     Disconnect_state() {
//         loggerSockets = _.without(loggerSockets, socket)
//     }
    
//     Sync_Sync() {
//         return this.Sync_state(...arguments)
//     }
    
//     Sync_state() {
//         var abort = this.states.getAbo
//         this.io.emit('full-sync', diff)
//         this.io.on('full-sync', this.)
//     }
    
//     Diff_Sync() {
//         return this.Sync_state(...arguments)
//     }
    
//     Diff_state() {
//         server.to(socket.loggerId).emit('diff-sync', diff)
//     }
// }

// SERVER ENDPOINT

type loggerSocket = SocketIO.Socket
var loggerEndpoint = server.of('/logger')
var loggerSockets: loggerSocket[] = []

loggerEndpoint.on('connection', function(socket: loggerSocket) {
    // constructor
    console.log('new logger connected')
    loggerSockets.push(socket)
    // handlers
    socket.on('disconnect', function() {
        loggerSockets = _.without(loggerSockets, socket)
    })
    socket.on('diff-sync', function(diff) {
        console.log(socket.loggerId)
        server.to(socket.loggerId).emit('diff-sync', diff)
    })
    // store the ID    
    assert(socket.handshake.query, 'query param required')
    let id = socket.handshake.query.id
    assert(id, 'query.id param required')
    socket.loggerId = id
})

// CLIENT ENDPOINT

type clientSocket = SocketIO.Socket
var clientEndpoint = server.of('/client')
var clientSockets: clientSocket[] = []

// TODO gc
var clientsPerLogger = new Map<loggerSocket, clientSocket[]>()

clientEndpoint.on('connection', function(socket: clientSocket) {
    // constructor
    console.log('new ui connected')
    clientSockets.push(socket)
    // handlers
    socket.on('disconnect', function() {
        clientSockets = _.without(clientSockets, socket)
    })
    
    // join logic
    socket.on('join', function(event: IJoinEvent) {
        socket.join(event.loggerId)
        // TODO find by ID
        let loggerSocket = loggerSockets[0]
        if (!clientsPerLogger.has(loggerSocket))
            clientsPerLogger.set(loggerSocket, [])
        clientsPerLogger.get(loggerSocket).push(socket)
        // TODO group clients for this request
        loggerSocket.emit('full-sync')
        loggerSocket.once('full-sync', function(json) {
            socket.emit('full-sync', json)
        })
    })
    
    // send the list of loggers
    socket.emit('loggers', loggerSockets.map( socket => socket.loggerId ))
})

// TODO config
server.listen(3030)

interface IJoinEvent {
    loggerId: string;
}
    