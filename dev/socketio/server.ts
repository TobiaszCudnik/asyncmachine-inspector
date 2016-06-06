import * as io from 'socket.io'
const server = io()
const foo = server.of('/foo')
foo.on('connection', function(socket){
    console.log('server:new-client')
    socket.join('bar', () => {
        foo.to('bar').emit('test', '1')
        foo.to('bar').emit('test', '2')
    })
});
server.listen(3000)