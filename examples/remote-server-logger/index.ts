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
const logger = new Logger(network, 'http://localhost:3757', { summary_fn })

// simulation logic
example.add(['Foo', 'Bar'])
setInterval(() => {
  example.add('Baz')
}, 3000)

// output a helpful msg to the user
setTimeout(() => {
  const msg = `Start debugging by executing the following command:\n${logger.getDebugCommand()}`
  console.log(msg)
})

function summary_fn(network: Network) {
  return `Summary:

Machines: ${network.machines.size}
States: ${network.states.length}
Ticks: ${network.states.reduce((ret, i) => ret + i.clock, 0)}`
}
