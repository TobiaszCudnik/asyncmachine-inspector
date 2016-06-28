/**
 * Itermidate server proxying traffic between Loggers (sources) and UIs (consumers).
 * 
 * A lot of traffic is being duplicated at the moment.
 * 
 * TODO:
 * - when logger reconnects, re-bind the clients, perform a full sync
 */

import * as io from 'socket.io'
import * as _ from 'underscore'
import * as assert from 'assert'
// import AsyncMachine from 'asyncmachine'


interface IJoinEvent {
    loggerId: string;
}

export interface LoggerSocket extends SocketIO.Socket {
    loggerId: string;
}

export default function createServer() {
    const server = io()

    server.on('connection', () => {
        console.log('new connection')
    })

    // SERVER ENDPOINT

    var loggerEndpoint = server.of('/logger')
    var loggerSockets: LoggerSocket[] = []

    loggerEndpoint.on('connection', function(socket: LoggerSocket) {
        // constructor
        console.log('new logger connected')
        loggerSockets.push(socket)
        // handlers
        socket.on('disconnect', function() {
            loggerSockets = _.without(loggerSockets, socket)
        })
        socket.on('diff-sync', function(diff) {
            console.log(`diff-sync from ${socket.loggerId}`)
            console.dir(diff)
            uiEndpoint.to(socket.loggerId).emit('diff-sync', diff)
        })
        socket.on('error', console.error.bind(console))
        // store the ID    
        assert(socket.handshake.query, 'query param required')
        let id = socket.handshake.query.id
        assert(id, 'query.id param required')
        socket.loggerId = id
    })

    // CLIENT ENDPOINT

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
            socket.join(event.loggerId)
            // TODO find by ID
            let loggerSocket = _.findWhere(loggerSockets, {
                loggerId: event.loggerId})
                
            if (!clientsPerLogger.has(loggerSocket))
                clientsPerLogger.set(loggerSocket, [])
            clientsPerLogger.get(loggerSocket).push(socket)
            // TODO group clients for this request
            loggerSocket.on('full-sync', function(json) {
                console.log(`full-sync from ${loggerSocket.loggerId}`)
                socket.emit('full-sync', json)
            })
            loggerSocket.emit('full-sync')
        })
        socket.on('error', console.error.bind(console))
        
        // send the list of loggers
        socket.emit('loggers', loggerSockets.map( socket => socket.loggerId ))
    })
    
    return server
}
