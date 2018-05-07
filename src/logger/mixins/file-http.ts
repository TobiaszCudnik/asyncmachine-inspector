import * as downloadAsFile from 'download-as-file'
import * as bindKey from 'keymaster'
import { Constructor, Granularity, IOptions } from '../logger'
import Network, {
  IPatch,
  ITransitionData,
  PatchType
} from '../../network/network'
import NetworkJson, {
  JsonDiffFactory,
  INetworkJson
} from '../../network/joint'
import * as EventEmitter from 'eventemitter3'
import { JSONSnapshot } from '../../network/network-json'

export { FileHTTPMixin }

export default function FileHTTPMixin<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    bindKeyToSnapshotDownload(key: string) {
      bindKey(key, () => {
        this.downloadSnapshot()
      })
    }

    downloadSnapshot() {
      // TODO browser check?
      downloadAsFile(
        JSON.stringify({
          data: this.snapshot,
          // TODO format the date
          filename: `inspector-snapshot-${Date.now()}.json`
        })
      )
    }
  }
}
