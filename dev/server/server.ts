import socketio from 'socket.io'
import EventEmitter from 'eventemitter3'
import am from 'asyncmachine'
import StateGraph from "./stategraph";
import Change from "./logger";

export default class Server extends EventEmitter {
    server: SocketIO.Server
    loggers: []
    uis: []

    constructor(
            public port?: number = 3000) {
        super()

        this.server = rpc(this.port)

        this.server('connection', this.states.addLater('Uis'))
        // TODO auto export all generator methods
        this.on(this.server, 'message', this.dispatchMessage)

        //io.listen(this.port)
    }

    unserialize(socket: SocketIO.Socket, message: Object): IMessage {
        return RESPONSES[message.type].userialize (message)
    }

    // Uis

    Uis_enter() {
        this.Uis_Uis(...arguments)
    }

    Uis_Uis(states: string[], socket: SocketIO.Socket) {
        console.log('server:new-Uis')
        // TODO create a room for this machine or visualizer

        this.of()
        socket.on('disconnect', this.states.dropLater('Uis'))
    }

    // keep the state until Uis are connected
    Uis_exit() {
        return this.server.nsps['Uis'].sockets
    }

    // Loggers

    Loggers_enter() {
        this.Loggers_Loggers(...arguments)
    }

    Loggers_Loggers(states: string[], socket: SocketIO.Socket) {
        console.log('server:new-Uis')
        // TODO create a room for this machine or visualizer

        this.of()
        socket.on('disconnect', this.states.dropLater('Uis'))
    }

    // keep the state until Loggers are connected
    Loggers_exit() {
        return this.server.nsps['Uis'].sockets
    }

    async listLoggers(socket: SocketIO.Socket): string[];
    listLoggers(socket: SocketIO.Socket): string[] {
        return this.server.nsps['loggers'].sockets
    }

    async bindToLogger(socket: SocketIO.Socket, roomId: string);
    bindToLogger(socket: SocketIO.Socket, roomId: string) {
        socket.join(roomId)
    }

    async unbindFromLogger(socket: SocketIO.Socket, roomId: string);
    unbindFromLogger(socket: SocketIO.Socket, roomId: string) {
        socket.leave(roomId)
    }
}

export class ServerStates extends am.AsyncMachine {
    Uis: {}
    Loggers: {}
    Listening: {}
}

export class ClientStates extends am.AsyncMachine {
    Connected = {}

    Unknown = {
        auto: true,
        blocks: ['Logger', 'Ui']
    }
    Logger = {
        blocks: ['Unknown', 'Ui']
    }
    Ui = {
        blocks: ['Unknown', 'Logger']
    }

    Discovered = {}
}

interface Serializable<T> {
    unserialize(data: Object): T;
    serialize(): Object;
    RequestId: number;
}

function unpackSocket(func) {
    var socket = this.socket
    return function() {
        return func(socket, ...arguments)
    }}

enum VISUALIZER_MESSAGE_TYPE {
    JOIN,
    LEAVE,
    FULL_SYNC
}

enum LOGGER_MESSAGE_TYPE {
    STATE_GRAPH,
    CHANGE
}

var RESPONSES = {
    [LOGGER_MESSAGE_TYPE.STATE_GRAPH]: StateGraph,
    [LOGGER_MESSAGE_TYPE.CHANGE]: Change,
    [VISUALIZER_MESSAGE_TYPE.JOiN]: Join,
    [VISUALIZER_MESSAGE_TYPE.LEAVE]: Leave,
    [VISUALIZER_MESSAGE_TYPE.FULL_SYNC]: FullSync
}