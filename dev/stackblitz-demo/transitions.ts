import {Restaurant, Customer} from './schema'

export default function(restaurant: Restaurant) {
  // keep new customers coming in a random interval, 5 max
  newCustomer(restaurant)
}

function newCustomer(restaurant) {
  const delay = Math.random()*10000;
  if (restaurant.customers.length<5) {
    const name = String(delay).substr(0, 3)
    restaurant.addCustomer(new Customer(name))
  }
  setTimeout(newCustomer.bind(null, restaurant), delay)
}