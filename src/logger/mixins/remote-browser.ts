import * as io from 'socket.io-client/dist/socket.io'
import RemoteBaseMixin, { Constructor } from './remote/base'
import { IOptions, Logger, Granularity } from '../logger'
import Network, {
  IPatch,
  ITransitionData,
  PatchType
} from '../../network/network'
import NetworkJson, {
  JsonDiffFactory,
  INetworkJson
} from '../../network/json/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../network/json'

export function InnerMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    get socket_io(): SocketIOClientStatic {
      return io
    }
  }
}

export { RemoteBrowserMixin }

export default function RemoteBrowserMixin<TBase extends Constructor>(
  Base: TBase
) {
  return InnerMixin(RemoteBaseMixin(Base))
}
