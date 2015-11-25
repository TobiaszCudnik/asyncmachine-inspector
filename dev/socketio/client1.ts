var socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect', function() {
    console.log('client:connected')
});
socket.on('test', function(data){
    console.log('test event', data)
});
socket.on('disconnect', function(){});