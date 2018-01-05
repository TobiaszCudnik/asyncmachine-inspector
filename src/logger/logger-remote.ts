import Network, { IPatch } from '../network/network'
import * as io from 'socket.io-client'
import Logger from './logger'

export { Network, LoggerRemote as Logger }

export default class LoggerRemote extends Logger {
  io: SocketIOClient.Socket
  connected = false

  constructor(public network: Network, public url = 'http://localhost:3757') {
    super(network, false)
    url = url.replace(/\/$/, '')
    this.io = io(`${url}/logger`, {
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

    console.log(`Logger connected to ${this.url}`)
    this.connected = true

    this.io.emit('full-sync', this.full_sync)
    this.on('diff-sync', (patch: IPatch) => {
      this.io.emit('diff-sync', patch)
    })
  }
}
