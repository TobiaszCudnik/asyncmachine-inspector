import { Restaurant, Chef, Customer, Waiter } from './schema'
import transitions from './transitions'
import render, {Network, Logger} from 'asyncmachine-inspector'
const network = new Network()

function createRestaurant(network) {
  const restaurant = new Restaurant(network)

  for (let name of ['A', 'B']) {
    restaurant.addChef(new Chef(name))
  }
  for (let name of ['P', 'R']) {
    restaurant.addWaiter(new Waiter(name))
  }

  return restaurant
}

const restaurant = createRestaurant(network)
transitions(restaurant)

render('#app').setLogger(new Logger(network))
