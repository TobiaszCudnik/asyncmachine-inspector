import Network, { IPatch } from '../network/network'
import Logger from './remote-base'
import * as fs from 'fs'
import * as io from 'socket.io-client'

export * from './remote-base'
export { Network, LoggerRemote as Logger }

export default class LoggerRemote extends Logger {
  io: SocketIOClient.Socket
  get socket_io(): SocketIOClientStatic {
    return io
  }

  saveFile(path) {
    fs.writeFileSync(path, JSON.stringify(this.snapshot))
  }
}
