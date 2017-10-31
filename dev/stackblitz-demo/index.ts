import create_machines from './machines'
import render, {Network, Logger} from './inspector-es6'

const inspector = render('#app');

const network = new Network;
for (let machine of create_machines(network))
  network.addMachine(machine)

const logger = new Logger(network);
inspector.states.add('FullSync', logger.base_version)
logger.on('diff-sync', (packet)=>{
  inspector.states.add('DiffSync', packet)
});
