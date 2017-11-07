// Interactive demo on Stackblitz
// https://stackblitz.com/edit/asyncmachine-inspector

import machines from './machines'
import transformations from './transformations'

// NPM module doesnt work on stackblitz, use the UMD version directly
// import render, {Network, Logger} from 'asyncmachine-inspector'
const render = am_inspector.default
const Network = am_inspector.Network
const Logger = am_inspector.Logger

const inspector = render('#app')

const network = new Network;
for (let machine of Object.values(machines))
  network.addMachine(machine)

transformations(machines)

const logger = new Logger(network);
inspector.states.add('FullSync', logger.base_version)
logger.on('diff-sync', (packet)=>{
  inspector
.states.add('DiffSync', packet)
});
