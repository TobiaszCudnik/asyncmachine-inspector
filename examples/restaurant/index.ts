import { Restaurant, Chef, Customer, Waiter, Dev } from './schema'
import transitions from './transitions'
import render from 'asyncmachine-inspector'
import { Network, Logger } from 'ami-logger'

const network = new Network()

function createRestaurant(network) {
  const restaurant = new Restaurant(network)
  network.addMachine(new Dev(restaurant).state)

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

const logger = new Logger(network, { summary_fn })
render('#app').setLogger(logger)

function summary_fn(network: Network) {
  return `Active customers: ${restaurant.customers.length}
Meals eaten: ${restaurant.meals_eaten}
Meals wasted: ${restaurant.meals_wasted}`
}
