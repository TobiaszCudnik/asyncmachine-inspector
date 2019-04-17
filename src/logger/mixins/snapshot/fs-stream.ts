import { IPatch, LoggerConstructor } from '../../logger'
import { IGraphJSON } from '../../../network/graph-network-differ'
import * as assert from 'assert/'
import { promisify } from 'util'
// import { JSONSnapshot } from '../../../network/json'
import WritableStream = NodeJS.WritableStream

export { FileFSStreamMixin }

export default function FileFSStreamMixin<TBase extends LoggerConstructor>(
  Base: TBase
) {
  return class extends Base {
    stream: WritableStream

    constructor(...args: any[]) {
      super(...args)
      assert(this.options.stream)

      this.stream = this.options.stream

      this.on('full-sync', (full_sync: IGraphJSON) => {
        // push a partial JSON to the stream
        const json = JSON.stringify(full_sync)
        this.stream.write(`{"full_sync": ${json}, "patches": [`)
      })
      let first_patch_sent = false
      this.on('diff-sync', (patch: IPatch) => {
        // push a single patch and a separator to the stream
        let prefix = ''
        if (first_patch_sent) {
          prefix = ','
        }
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

    async endStream() {
      try {
        await promisify(this.stream.end).call(this.stream, ']}')
      } catch {}
    }

    async dispose() {
      await this.endStream()
    }
  }
}
