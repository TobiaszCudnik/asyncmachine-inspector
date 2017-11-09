import {Restaurant, Customer} from './schema'
import random from 'random-int'
import delay from 'delay'

export default function(restaurant: Restaurant) {
  // keep new customers coming in a random interval, 5 max
  produceCustomers(restaurant, 5)
}

async function produceCustomers(restaurant, max) {
  while (restaurant.customers.length < max) {
    const number = restaurant.customers.length + 1
    const customer = new Customer(number)
    restaurant.addCustomer(customer)
    // onNewCustomer(customer, number)
    await delay(random(3, 10)*1000)
  }
}

async function onNewCustomer(customer: Customer, number: number) {
  if (number == 2) {
    // the second customer will leave before getting his meal
    await customer.when('WaitingForMeal')
    await delay(1000)
    customer.add('Left')
  }
}
