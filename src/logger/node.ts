import { LoggerBase } from './base'
import Network from '../network/network'
import * as fs from 'fs'

export * from './base'
export { Logger }

// TODO default options.autostart should be true
export default class Logger extends LoggerBase {
  saveFile(path) {
    fs.writeFileSync(path, JSON.stringify(this.snapshot))
  }
}
