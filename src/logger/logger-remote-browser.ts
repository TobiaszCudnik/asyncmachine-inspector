import LoggerRemote from './browser-remote'
import Network, {IPatch} from '../network/network'
import * as io from 'socket.io-client/dist/socket.io'

export * from './logger-remote'

export default class LoggerRemote extends LoggerRemoteNode {
  io: SocketIOClient.Socket
  connected = false

  constructor(public network: Network, public url = 'http://localhost:3757') {
    super(network, url)
    url = url.replace(/\/$/, '')
    this.io = io(`${url}/logger`, {
      query: `id=${network.id}`
    })

    this.io.on('connect', () => {
      this.start()
    })
  }

  start() {
    super.start()

    console.log(`Logger connected to ${this.url}`)
    this.connected = true
    this.emit('connect')

    this.io.emit('full-sync', this.full_sync)
    this.on('diff-sync', (patch: IPatch) => {
      this.io.emit('diff-sync', patch)
    })
  }

  getDebugCommand() {
    return `am-inspector --server "${this.url}"`
  }
}
