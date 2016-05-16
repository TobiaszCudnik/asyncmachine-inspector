"use strict";
// import * as io from 'socket.io'
// import * as _ from 'underscore'
// import assert from 'assert'
// import { AsyncMachine } from 'asyncmachine'
var io = require('socket.io');
var _ = require('underscore');
var assert = require('assert');
var server = io();
server.on('connection', function () {
    console.log('new connection');
});
var loggerEndpoint = server.of('/logger');
var loggerSockets = [];
loggerEndpoint.on('connection', function (socket) {
    // constructor
    console.log('new logger connected');
    loggerSockets.push(socket);
    // handlers
    socket.on('disconnect', function () {
        loggerSockets = _.without(loggerSockets, socket);
    });
    socket.on('diff-sync', function (diff) {
        console.log(socket.loggerId);
        server.to(socket.loggerId).emit('diff-sync', diff);
    });
    // store the ID    
    assert(socket.handshake.query, 'query param required');
    var id = socket.handshake.query.id;
    assert(id, 'query.id param required');
    socket.loggerId = id;
});
var clientEndpoint = server.of('/client');
var clientSockets = [];
// TODO gc
var clientsPerLogger = new Map();
clientEndpoint.on('connection', function (socket) {
    // constructor
    console.log('new ui connected');
    clientSockets.push(socket);
    // handlers
    socket.on('disconnect', function () {
        clientSockets = _.without(clientSockets, socket);
    });
    // join logic
    socket.on('join', function (event) {
        socket.join(event.loggerId);
        // TODO find by ID
        var loggerSocket = loggerSockets[0];
        if (!clientsPerLogger.has(loggerSocket))
            clientsPerLogger.set(loggerSocket, []);
        clientsPerLogger.get(loggerSocket).push(socket);
        // TODO group clients for this request
        loggerSocket.emit('full-sync');
        loggerSocket.once('full-sync', function (json) {
            socket.emit('full-sync', json);
        });
    });
    // send the list of loggers
    socket.emit('loggers', loggerSockets.map(function (socket) { return socket.loggerId; }));
});
// TODO config
server.listen(3030);
//# sourceMappingURL=server.js.map
