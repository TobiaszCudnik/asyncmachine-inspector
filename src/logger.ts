import { State } from 'asyncmachine';
import StateGraph from "./stategraph";

type MachineId = string;

export class Logger {
    transport: LoggerTransport;

    constructor(
            public graph?: StateGraph) {
        this.transport = new SocketIo;
    }
}