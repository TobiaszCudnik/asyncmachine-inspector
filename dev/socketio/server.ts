var io = require('socket.io')();
io.on('connection', function(socket){
    console.log('server:new-client')
    //console.log(socket.client)
    io.emit('test', {a: 1});
});
io.listen(3000)