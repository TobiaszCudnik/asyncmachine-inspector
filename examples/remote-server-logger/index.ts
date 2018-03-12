import { machine } from 'asyncmachine'
import { Logger, Network } from 'ami-logger/remote'

// an example machine and its instance
const example_states = {
  Foo: {},
  Bar: {},
  Baz: { drop: ['Bar'] }
}
const example = machine(example_states).id('example')

// hook up the instance to a logger client
const network = new Network()
network.addMachine(example)
const logger = new Logger(network, 'http://localhost:3757')

// simulation logic
example.add(['Foo', 'Bar'])
setTimeout(() => {
  example.add('Baz')
}, 3000)

// output a helpful msg to the user
setTimeout(() => {
  const msg = `Start debugging by executing the following command:
${logger.getDebugCommand()}`
  console.log(msg)
})
