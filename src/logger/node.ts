import { LoggerBase } from './base'
import Network from '../network/network'
import * as fs from 'fs'

export { Network, LoggerLocal as Logger }

// TODO default options.autostart should be true
export default class LoggerLocal extends LoggerBase {
  saveFile(path) {
    fs.writeFileSync(path, JSON.stringify(this.snapshot))
  }
}
