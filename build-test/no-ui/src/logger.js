"use strict";

var io = require('socket.io-client');
var d3network_1 = require("./d3network");
var Logger = (function () {
    function Logger(network, serverHost) {
        var _this = this;
        this.network = network;
        this.serverHost = serverHost;
        this.io = io(serverHost, {
            query: "id=" + network.id
        });
        this.json = new d3network_1.default(network);
        this.json.network.on('change', function () {
            return _this.onGraphChange();
        });
        this.diff = new d3network_1.D3JsonDiffFactory(this.json);
        this.diff.generateJson();
        this.io.on('full-sync', function () {
            return _this.onFullSync();
        });
        this.io.on('connected', function () {
            console.log('connected');
        });
    }
    Logger.prototype.onFullSync = function () {
        this.io.emit('full-sync', this.diff.previous_json);
    };
    Logger.prototype.onGraphChange = function () {
        this.io.emit('diff-sync', this.diff.generateDiff());
    };
    return Logger;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logger;
//# sourceMappingURL=logger.js.map
