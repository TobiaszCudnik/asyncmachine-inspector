import { Logger, Granularity, IOptions } from './logger'
import FileHTTPMixin from './mixins/snapshot/http'
import RemoteBrowserMixin from './mixins/remote-browser'
import Network, { IPatch, ITransitionData, PatchType } from '../network/network'
import NetworkJson, {
  JsonDiffFactory,
  INetworkJson
} from '../network/json/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../network/json'

const LoggerBrowser = RemoteBrowserMixin(FileHTTPMixin(Logger))
export { LoggerBrowser as Logger, Network, Granularity }

export default LoggerBrowser
