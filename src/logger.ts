/**
 * TODO network-to-ui-json should be handled by the server
 */
import Network, {
    PatchType
} from "./network"
import * as io from 'socket.io-client'
// import NetworkJson, {
//     JsonDiffFactory
// } from "./ui/cola-network"
import NetworkJson, {
    JsonDiffFactory,
    INetworkJson
} from "./ui/joint-network"
// import NetworkJson, {
//     JsonDiffFactory
// } from "./ui/graphviz-network"

type MachineId = string;

/**
 * TODO rename to LoggerClient
 * fix d.ts files generation
 * TODO introduce revision hashes
 */
export default class Logger {
    io: SocketIOClient.Socket;
    json: NetworkJson;
    diff: JsonDiffFactory;
    base_version: INetworkJson;
    connected = false

    constructor(
            public network: Network,
            public serverHost) {
        this.io = io(serverHost, {
            query: `id=${network.id}`
        });

        this.json = new NetworkJson(network)
        this.diff = new JsonDiffFactory(this.json)
        
        // this.io.on('full-sync', () => this.onFullSync())
        this.io.on('connect', () => {
            this.onConnected()
        })
        // this.io.on('full-sync', () => this.onFullSync())
        this.io.on('full-sync', () => {
            this.base_version = this.diff.previous_json
            this.io.emit('full-sync', this.base_version)
        })
    }

    onConnected() {
        console.log(`Logger connected to ${this.serverHost}`)
        this.connected = true
        this.diff.generateJson()
        this.base_version = this.diff.previous_json
        this.io.emit('full-sync', this.base_version)

        this.json.network.on('change', (type, machine_id, ...params) =>
            this.onGraphChange(type, machine_id, ...params))
    }

    // TODO merge many empty transition-end events into 1
    onGraphChange(type: PatchType, machine_id, ...params) {
        let diff = this.diff.generateDiff()
        let packet = {
            diff, type, machine_id,
            logs: this.network.logs,
        }
        // skip empty steps
        if (type == PatchType.TRANSITION_STEP && !diff &&
                !this.network.logs.length) {
            return
        }
        this.io.emit('diff-sync', packet)
        // console.dir(diff && diff.cells)
        this.network.logs = []
    }
}
