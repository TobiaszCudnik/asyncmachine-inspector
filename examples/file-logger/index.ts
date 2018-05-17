import { machine } from 'asyncmachine'
import { Logger, Network } from 'ami-logger'
import FileFSMixing from 'ami-logger/mixins/snapshot/fs'

// an example machine and its instance
const state = {
  Wet: { require: ['Water'] },
  Dry: { drop: ['Wet'] },
  Water: { add: ['Wet'], drop: ['Dry'] }
}
const example = machine(state)

// build the Logger class
const LoggerClass = FileFSMixing(Logger)

// hook up the instance to the logger client and start it
const network = new Network([example])
const logger = new LoggerClass(network)
logger.start()
// make some changes
example.add('Dry')
example.add('Water')
console.log(example.is())
logger.saveFile('snapshot.json')
console.log(`Saved snapshot.json`)
