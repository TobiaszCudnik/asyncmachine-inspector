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
} from '../../../network/json/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../../network/json'

export { FileFSMixing }

export default function FileFSMixing<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    saveFile(path) {
      const json = JSON.stringify(this.snapshot)
      fs.writeFileSync(path, json)
    }
  }
}
