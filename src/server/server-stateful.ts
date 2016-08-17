import AsyncMachine from 'asyncmachine'
import * as io from 'socket.io'

class ServerStates extends AsyncMachine {
    UiConnected: {}
    LoggerConnected: {}
}

class ClientStates extends AsyncMachine {
    Connected: {}
    Disconnected: {}

    Error: {}
}

class LoggerStates extends ClientStates  {
    PerformingDiffSync: {
        require: ['Connected'],
        drop: ['DiffSyncDone']
    }
    DiffSyncDone: {
        require: ['Connected'],
        drop: ['']}
}

class UiStates extends ClientStates {
    // join
    Joining: {
        require: ['Connected'],
        drop: ['Joined']
    }
    Joined: {
        require: ['Connected'],
        drop: ['Joining']
    }

    // list of logger
    SendingListOfLoggers: {
        drop: ['ListOfLoggersDelivered']
    }
    ListOfLoggersDelivered: {
        drop: ['SendingListOfLoggers']
    }

    // full sync
    PerformingFullSync: {
        require: ['Joined'],
        drop: ['FullSyncDone']
    }
    FullSyncDone: {
        drop: ['PerformingFullSync']
    }
}

class Client {
    states: ClientStates;
    server: SocketIO.Server;
    socket: SocketIO.Socket;

    constructor(socket, server) {
        this.socket = socket
        this.server = server
        this.states = this.createStates()

        socket.on('error', this.states.addLater('Error'))
        socket.on('disconnect', this.states.addLater('Disconnected'))

        this.states.add('Connected')
    }

    createStates() {
        return new ClientStates(this)
    }
}

class UiClient extends Client {
    constructor(socket, server) {
        super(socket, server)
    }

    createStates() {
        return new UiStates(this)
    }

    Connected_state() {
        this.socket.emit('loggers', this.server.getLoggerIds())
    }
}