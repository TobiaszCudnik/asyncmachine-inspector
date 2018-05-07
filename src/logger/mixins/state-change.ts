/**
 * Mixin allows to set the states directly from the debugger.
 *
 * This brings potential security issues and shouldn't be used in production.
 */
import Network from '../../network/network'

export type Constructor<T = {}> = new (...args: any[]) => T

export { WorkerPoolMixin }

export default function WorkerPoolMixin<TBase extends Constructor>(
  Base: TBase
) {
  return class extends Base {
    network: Network

    constructor(...args: any[]) {
      super(...args)

      // @ts-ignore
      this.on('state-add', states => {
        // TODO group by machines and add in bulks
        for (const id of states) {
          const [machine_id, name] = id.split(':')
          const node = this.network.getNodeByName(name, machine_id)
          node.machine.add(name)
        }
      })
      // @ts-ignore
      this.on('state-drop', states => {
        // TODO group by machines and add in bulks
        for (const id of states) {
          const [machine_id, name] = id.split(':')
          const node = this.network.getNodeByName(name, machine_id)
          node.machine.drop(name)
        }
      })
    }
  }
}
