import Network, { IPatch } from '../network/network'
import Logger from './base'
import * as fs from 'fs'

export { Network, LoggerRemote as Logger }

export default class LoggerRemote extends Logger {
  io: SocketIOClient.Socket
  connected = false
  url: string

  constructor(public network: Network, url = 'http://localhost:3757', options = {}) {
    super(network, options)
    url = url || 'http://localhost:3757'
    this.url = url.replace(/\/$/, '')
    this.io = this.socket_io(`${this.url}/logger`, {
      query: `id=${network.id}`
    })

    this.io.on('connect', () => {
      this.start()
    })
    this.io.on('error', err => {
      console.error(err)
    })
    this.io.on('state-add', states => {
      // TODO group by machines and add in bulks
      for (const id of states) {
        const [machine_id, name] = id.split(':')
        const node = this.network.getNodeByName(name, machine_id)
        node.machine.add(name)
      }
    })
    this.io.on('state-drop', states => {
      // TODO group by machines and add in bulks
      for (const id of states) {
        const [machine_id, name] = id.split(':')
        const node = this.network.getNodeByName(name, machine_id)
        node.machine.drop(name)
      }
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
