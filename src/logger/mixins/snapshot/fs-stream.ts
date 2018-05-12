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
import WritableStream = NodeJS.WritableStream
import * as assert from 'assert/'

export { FileFSMixing }

export default function FileFSMixing<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    stream: WritableStream

    constructor(...args: any[]) {
      super(...args)
      assert(this.options.stream)

      this.stream = this.options.stream

      this.on('full-sync', (full_sync: INetworkJson) => {
        // push a partial JSON to the stream
        const json = JSON.stringify(full_sync)
        this.stream.write(`{"full_sync": ${json}, "patches": [`)
      })
      let first_patch_sent = false
      this.on('diff-sync', (patch: IPatch, index: number) => {
        // push a single patch and a separator to the stream
        let prefix = ''
        if (first_patch_sent) {
          prefix = ','
        }
        // GC old patches after they got flushed to the stream
        delete this.patches[index]
        let json
        try {
          json = JSON.stringify(patch)
        } catch {
          console.log('diff sync')
          console.log(patch)
        }
        this.stream.write(prefix + json)
        first_patch_sent = true
      })
    }

    endStream() {
      // close the JSON
      this.stream.end(']}')
    }
  }
}
