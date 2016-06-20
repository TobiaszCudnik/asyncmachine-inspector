

class ServerStates {
    UiConnected: {}
    LoggerConnected: {}
}

class ClientStates {
    Connected: {}
    Disconnected: {}

    Error: {}
}

class LoggerStates extends ClientStates  {
    PerformingDiffSync: {
        requires: ['Connected'],
        blocks: ['DiffSyncDone']
    }
    DiffSyncDone: {
        requires: ['Connected'],
        blocks: ['']}
}

class UiStates extends ClientStates {
    // join
    Joining: {
        requires: ['Connected'],
        blocks: ['Joined']
    }
    Joined: {
        requires: ['Connected'],
        blocks: ['Joining']
    }

    // list of logger
    SendingListOfLoggers: {
        blocks: ['ListOfLoggersDelivered']
    }
    ListOfLoggersDelivered: {
        blocks: ['SendingListOfLoggers']
    }

    // full sync
    PerformingFullSync: {
        requires: ['Joined'],
        blocks: ['FullSyncDone']
    }
    FullSyncDone: {
        blocks: ['PerformingFullSync']
    }
}

class Client {
    constructor(socket, server) {
        this.socket = socket
        this.server = server
        this.states = this.createStates()

        socket.on('error', this.states.addLater('Error'))
        socket.on('disconnect', this.states.addLater('Disconnected'))

        this.states.add('Connected')
    }

    createStates() {
        throw new Error('abstract')
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