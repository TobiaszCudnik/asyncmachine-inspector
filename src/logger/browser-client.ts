/**
 * TODO network-to-ui-json should be handled by the server
 */
import Network, { IPatch, ITransitionData, PatchType } from '../network'
import LoggerLocal from './browser-local'
// TODO import socket.io

type MachineId = string

/**
 * fix d.ts files generation
 * TODO introduce revision hashes
 */
export default class LoggerFile extends LoggerLocal {
  constructor(public network: Network) {
    super(network)
    // TODO construct a socket io
  }
}
