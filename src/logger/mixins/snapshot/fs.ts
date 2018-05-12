import * as fs from 'fs'
import { Constructor, Granularity, IOptions } from '../../logger'
import Network, {
  IPatch,
  ITransitionData,
  PatchType
} from '../../../network/network'
import NetworkJson, {
  JsonDiffFactory,
  INetworkJson
} from '../../../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../../network/network-json'

export { FileFSMixing }

export default function FileFSMixing<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    saveFile(path) {
      let json
      try {
        json = JSON.stringify(this.snapshot)
      } catch {
        debugger
      }
      fs.writeFileSync(path, json)
    }
  }
}
