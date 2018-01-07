import Asyncmachine from 'asyncmachine'
import { Logger, Network } from 'asyncmachine-inspector-logger'

// an example machine and its instance
class Example extends Asyncmachine {
  Foo = {}
  Bar = {}
  Baz = { drop: ['Bar'] }
  constructor() {
    super()
    this.id('demo')
    // always required for typescript
    this.registerAll()
  }
}
const example = new Example()

// hook up the instance to a logger client
const network = new Network()
network.addMachine(example)
const logger = new Logger(network, 'http://localhost:3757')

// simulation logic
example.add(['Foo', 'Bar'])
example.add('Baz')
logger.saveFile('snapshot.json')
console.log(`Saved snapshot.json`)
