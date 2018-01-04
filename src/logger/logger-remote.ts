import Network, {IPatch} from '../network/network'
import * as io from 'socket.io-client'
import Logger from './logger'


export default class LoggerRemote extends Logger {
  io: SocketIOClient.Socket
  connected = false

  constructor(public network: Network, public server_host) {
    super(network, false)
    this.io = io(server_host, {
      query: `id=${network.id}`
    })

    this.io.on('connect', () => {
      this.start()
    })
    // TODO not needed with a single-network server?
    // this.io.on('full-sync', () => {
    //   this.base_version = this.diff.previous_json
    //   this.io.emit('full-sync', this.base_version)
    // })
  }

  start() {
    super.start()

    console.log(`Logger connected to ${this.server_host}`)
    this.connected = true

    this.io.emit('full-sync', this.full_sync)
    this.on('diff-sync', (patch: IPatch) => {
      this.io.emit('diff-sync', patch)
    })
  }
}
