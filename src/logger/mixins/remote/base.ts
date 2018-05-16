// TODO check if /mixin/ symlink doesnt break here
import { IOptions, Logger, Granularity, Constructor } from '../../logger'
import Network, {
  IPatch,
  ITransitionData,
  PatchType
} from '../../../network/network'
import NetworkJson, {
  JsonDiffFactory,
  INetworkJson
} from '../../../network/json/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../../network/json'

export { Constructor }

export default function RemoteBaseMixin<TBase extends Constructor>(
  Base: TBase
) {
  return class RemoteBase extends Base {
    io: SocketIOClient.Socket
    socket_io: SocketIOClientStatic
    connected = false
    url: string
    is_started = false

    constructor(...args: any[]) {
      super(...args)
      const url = this.options.url || 'http://localhost:3757'
      this.url = url.replace(/\/$/, '')
      this.io = this.socket_io(`${this.url}/logger`, {
        query: `id=${this.network.id}`
      })

      this.io.on('connect', () => {
        // TODO support re-connecting
        this.io.emit('full-sync', this.full_sync)
        // @ts-ignore
        this.on('diff-sync', (patch: IPatch) => {
          this.io.emit('diff-sync', patch)
        })
      })
      this.io.on('error', err => {
        console.error(err)
      })
      // compatibility with /src/logger/mixin/state-change
      this.io.on('state-add', states => {
        // @ts-ignore
        this.emit('state-add', states)
      })
      this.io.on('state-drop', states => {
        // @ts-ignore
        this.emit('state-drop', states)
      })
    }

    getDebugCommand() {
      return `am-inspector --server "${this.url}"`
    }
  }
}
