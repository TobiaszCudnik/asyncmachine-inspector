import StateGraph from "./stategraph"


export interface ISync {
    states: LoggerTransportStates;

    addChange(change: Change): boolean;
    getGraph(): StateGraph;
}

export interface LoggerTransportStates {
    Enabled: State;
    Disconnected: State;
    Connected: State;
    Ready: State;
    Sending: State;
}

export class Socketio implements ISync {
    protected client: SocketIo.Socket;

    constructor(config: {host: string, port: number, username?: string, password?: string}) {

    }
    send(change: StateChange): Promise {

    }
}

export class Local implements ISync {

}

export class StateChange {
    machine: MachineId;
    added: string[];
    dropped: string[];
}