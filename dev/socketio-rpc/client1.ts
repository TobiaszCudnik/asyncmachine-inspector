var rpcClient = require('socket.io-rpc-client');

var server = rpcClient('http://localhost:8080');

var api

server.expose({
    fnOnClient: function() {
        console.log('called client method');
        return 42;
    },
    asyncOnClient: function() {
        console.log('called asyncOnClient method');
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                api.test(10).then( ret => {
                    resolve('resolved after ' + ret + 'ms');
                });
            }, 1000)
        });
    },
    erroringMethod: function() {
        notdefined.error.will.propagate;
    }
});
server.fetchNode('').then(ret => api = ret)