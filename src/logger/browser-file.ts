/**
 * TODO network-to-ui-json should be handled by the server
 */
import LoggerLocal from './browser-local'
import Network from "../network";
// TODO import keystrokes
// TODO import file download

type MachineId = string

/**
 * fix d.ts files generation
 * TODO introduce revision hashes
 */
export default class LoggerFile extends LoggerLocal {

  constructor(public network: Network) {
    super(network)
    // TODO bind a keystroke to download a snapshot
  }
}
