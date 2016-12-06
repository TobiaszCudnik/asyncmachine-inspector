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
// import '../polyfill'
// import AsyncMachine from 'asyncmachine'


interface IJoinEvent {
    loggerId: string;
}

export interface LoggerSocket extends SocketIO.Socket {
    loggerId: string;
}

export default function createServer() {
    const server = io()

    // LOGGER ENDPOINT

    var loggerEndpoint = server.of('/logger')
    var loggerSockets: LoggerSocket[] = []

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
    var uiEndpoint = server.of('/client')
    var clientSockets: clientSocket[] = []

    uiEndpoint.on('connection', function(socket: clientSocket) {
        loggerEndpoint.emit('full-sync')
        // constructor
        console.log('new ui connected')
        socket.on('error', console.error.bind(console))
    })
    
    return server
}
