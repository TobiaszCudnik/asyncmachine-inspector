import Asyncmachine from 'asyncmachine'
import { Logger, Network } from 'ami-logger/browser-remote'

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
const network = new Network([example])
const logger = new Logger(network, 'http://localhost:3757')

// simulation logic
example.add(['Foo', 'Bar'])
setTimeout(() => {
  example.add('Baz')
}, 3000)

// output a helpful msg to the user
setTimeout(() => {
  const msg = `Start debugging by executing the following command:
  <pre>${logger.getDebugCommand()}</pre>`
  document.body.innerHTML = msg
  console.log(msg)
})
