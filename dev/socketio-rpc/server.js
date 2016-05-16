var RPC = require('socket.io-rpc');
var port = 8080;
var rpcApp = RPC(port);
rpcApp.expose({
    test: function (num) {
        console.log(this);
        return num;
    }
});
rpcApp.io.on('connection', function (socket) {
    console.log('connection');
    socket.rpc.fetchNode('').then(function (client) {
        console.log('calling');
        client.asyncOnClient().then(function (ret) {
            console.log(ret);
        });
    }, 1000);
});
//# sourceMappingURL=server.js.map