// import { IState } from 'asyncmachine';
import Network from "./network";
import * as io from 'socket.io-client'
import D3NetworkJson, {
    D3JsonDiffFactory
} from "./d3network";

type MachineId = string;

export default class Logger {
    io: SocketIOClient.Socket;
    json: D3NetworkJson;
    diff: D3JsonDiffFactory;

    constructor(
            public network: Network,
            public serverHost) {
        this.io = io(serverHost, {
            query: `id=${network.id}`
        });

        this.json = new D3NetworkJson(network)
        this.json.network.on('change', () => this.onGraphChange())

        this.diff = new D3JsonDiffFactory(this.json)
        this.diff.generateJson()
        
        this.io.on('full-sync', () => this.onFullSync())
        this.io.on('connected', () => {
            console.log('connected')
        })
    }

    onFullSync() {
        this.io.emit('full-sync', this.diff.previous_json)
    }

    onGraphChange() {
        this.io.emit('diff-sync', this.diff.generateDiff())
    }
}