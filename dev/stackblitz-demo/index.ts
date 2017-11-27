import { Restaurant, Chef, Customer, Waiter } from './schema'
import transitions from './transitions'
// NPM module doesnt work on stackblitz, use the UMD version directly
// import render, {Network, Logger} from 'asyncmachine-inspector'
const render = am_inspector.default
const Network = am_inspector.Network
const Logger = am_inspector.Logger

const network = new Network()

function createRestaurant(network) {
  const restaurant = new Restaurant(network)

  for (let name of ['A', 'B']) restaurant.addChef(new Chef(name))
  for (let name of ['P']) restaurant.addWaiter(new Waiter(name))

  return restaurant
}

const restaurant = createRestaurant(network)
transitions(restaurant)

const inspector = render('#app')
const logger = new Logger(network)
inspector.states.add('FullSync', logger.base_version)
logger.on('diff-sync', inspector.states.addByListener('DiffSync'))
