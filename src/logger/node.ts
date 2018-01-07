import { LoggerBase } from './base'
import Network from '../network/network'
import * as fs from 'fs'

export { Network, LoggerLocal as Logger }

// TODO extract the base class
export default class LoggerLocal extends LoggerBase {
  saveFile(path) {
    fs.writeFileSync(path, JSON.stringify(this.snapshot))
  }
}
