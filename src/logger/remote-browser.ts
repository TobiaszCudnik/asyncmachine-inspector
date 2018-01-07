import LoggerRemoteNode from './remote'
import * as io from 'socket.io-client/dist/socket.io'

export * from './remote'
export { Logger }

export default class Logger extends LoggerRemoteNode {
  get socket_io() {
    return io
  }
}
