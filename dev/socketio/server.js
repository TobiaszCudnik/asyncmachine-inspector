"use strict";
var io = require('socket.io');
var server = io();
var foo = server.of('/foo');
foo.on('connection', function (socket) {
    console.log('server:new-client');
    socket.join('bar', function () {
        foo.to('bar').emit('test', '1');
        foo.to('bar').emit('test', '2');
    });
});
server.listen(3000);
