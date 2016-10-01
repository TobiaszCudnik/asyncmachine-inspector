/**
 * TODO network-to-ui-json should be handled by the server
 */
import Network, {
    ChangeType
} from "./network"
import * as io from 'socket.io-client'
// import D3NetworkJson, {
//     D3JsonDiffFactory
// } from "./ui/cola-network"
import NetworkJson, {
    JsonDiffFactory
} from "./ui/joint-network"

type MachineId = string;

export default class Logger {
    io: SocketIOClient.Socket;
    json: NetworkJson;
    diff: JsonDiffFactory;

    constructor(
            public network: Network,
            public serverHost) {
        this.io = io(serverHost, {
            query: `id=${network.id}`
        });

        this.json = new NetworkJson(network)
        this.json.network.on('change', (type, machine_id, ...params) =>
            this.onGraphChange(type, machine_id, ...params))

        this.diff = new JsonDiffFactory(this.json)
        this.diff.generateJson()
        
        this.io.on('full-sync', () => this.onFullSync())
        this.io.on('connected', () => {
            console.log('connected')
        })
    }

    onFullSync() {
        this.io.emit('full-sync', this.diff.previous_json)
    }

    // TODO merge many empty transition-end events into 1
    onGraphChange(type: ChangeType, machine_id, ...params) {
        let diff = this.diff.generateDiff()
        let packet = { diff, type, machine_id,
            machine_id_normalized: machine_id.replace(/[^\w\d]/g, '-'),
            logs: this.network.logs
        }
        // skip empty steps
        if (type == ChangeType.TRANSITION_STEP && !diff && !this.network.logs.length)
            return
        this.io.emit('diff-sync', packet)
        console.dir(diff && diff.cells)
        this.network.logs = []
    }

    onLogMsg(msg: {id: string, text: string}) {
        this.io.emit('log', msg)
    }
}

