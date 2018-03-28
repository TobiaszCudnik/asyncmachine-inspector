import AsyncMachine, { machine } from 'asyncmachine'
import _ from 'lodash'
import delay from 'delay'
import random from 'random-int'
import { Network } from 'asyncmachine-inspector'

const LOG_LEVEL = 0

export const chef_state = {
  Waiting: { auto: true },
  Cooking: { drop: ['Waiting'] }
}

export class Chef {
  restaurant: Restaurant
  state = machine(chef_state)

  constructor(name) {
    this.state.id(`Chef ${name}`)
    this.state.logLevel(LOG_LEVEL)
  }

  async Cooking_state(customer_id: string) {
    await delay(random(3, 5) * 1000)
    this.restaurant.state.add('MealReady', customer_id)
    this.restaurant.state.drop(this.state, 'Cooking')
  }

  Cooking_end() {
    if (this.restaurant.orders_pending.length) {
      this.state.add('Cooking', this.restaurant.orders_pending.shift())
    }
  }
}

export const waiter_state = {
  Waiting: { drop: ['Busy'], auto: true },
  Busy: { drop: ['Waiting'], auto: true },
  TakingOrder: {
    add: ['Busy'],
    drop: ['Waiting', 'RequestingMeal', 'DeliveringMeal']
  },
  RequestingMeal: { add: ['Busy'], drop: ['TakingOrder', 'DeliveringMeal'] },
  DeliveringMeal: { add: ['Busy'], drop: ['Waiting', 'TakingOrder'] }
}

export class Waiter {
  restaurant: Restaurant
  state = machine(waiter_state)

  constructor(name) {
    this.state.id(`Waiter ${name}`).setTarget(this)
    this.state.logLevel(LOG_LEVEL)
  }

  TakingOrder_enter(customer: Customer) {
    return Boolean(customer.state.is('WaitingToOrder'))
  }

  async TakingOrder_state(customer: Customer) {
    this.restaurant.state.add(customer.state, 'Ordering')
    this.restaurant.state.add(this.state, 'TakingOrder')
    await delay(1000)
    // TODO check the abort function
    this.restaurant.state.add(customer.state, 'WaitingForMeal')
    this.restaurant.state.add(this.state, 'RequestingMeal', customer.state.id())
  }

  RequestingMeal_state(customer_id: string) {
    const chef = _.find(this.restaurant.chefs, w => w.state.is('Waiting'))
    if (chef) this.restaurant.state.add(chef.state, 'Cooking', customer_id)
    else this.restaurant.orders_pending.push(customer_id)
    this.restaurant.state.drop(this.state, ['RequestingMeal', 'Busy'])
  }

  DeliveringMeal_enter() {
    return Boolean(this.restaurant.meals_pending.length)
  }

  async DeliveringMeal_state() {
    const customer_id = this.restaurant.meals_pending.shift()
    const customer = _.find(
      this.restaurant.customers,
      c => c.id() == customer_id
    )
    // check if the customer exists (didnt leave)
    if (customer && !customer.state.is('Left')) {
      await delay(random(1, 2) * 1000)
      // TODO check the abort function
      this.restaurant.state.add(customer.state, 'Eating')
    } else {
      this.restaurant.state.add('MealWasted')
    }
    this.restaurant.state.drop(this.state, ['DeliveringMeal', 'Busy'])
    if (this.restaurant.meals_pending.length) {
      this.restaurant.state.add(this.state, 'DeliveringMeal')
    }
  }
}

export const customer_state = {
  WaitingToOrder: {},
  Ordering: { drop: ['WaitingToOrder'] },
  WaitingForMeal: { drop: ['Ordering'] },
  Eating: { drop: ['WaitingForMeal'] },
  Left: { drop: ['Eating', 'WaitingForMeal', 'Ordering', 'WaitingToOrder'] }
}

export class Customer {
  state = machine(customer_state)

  constructor(name) {
    this.state.id(`Customer ${name}`).setTarget(this)
    this.state.logLevel(LOG_LEVEL)
  }

  async Eating_state() {
    await delay(2000)
    this.state.add('Left')
  }
}

export const restaurant_state = {
  WaiterAvailable: { multi: true },
  ChefAvailable: { multi: true },
  CustomerWaiting: { multi: true },
  CustomerEating: { multi: true },
  MealReady: { multi: true, drop: ['ServingCustomer'] },
  ServingCustomer: {
    require: ['WaiterAvailable', 'CustomerWaiting'],
    auto: true
  },
  MealWasted: {}
}

// TODO extract states to a separate class
export class Restaurant {
  state = machine(restaurant_state)

  chefs: Chef[] = []
  waiters: Waiter[] = []
  customers: Customer[] = []

  orders_pending: string[] = []
  meals_pending: string[] = []

  constructor(public network: Network) {
    this.state.id(`Restaurant`).setTarget(this)
    this.state.logLevel(LOG_LEVEL)
    network.addMachine(this.state)
  }

  addChef(chef: Chef) {
    chef.restaurant = this
    this.chefs.push(chef)
    this.network.addMachine(chef.state)
    chef.state.pipe('Waiting', this.state, 'ChefAvailable')
    this.state.add(chef.state, 'Waiting')
  }

  addWaiter(waiter: Waiter) {
    waiter.restaurant = this
    this.waiters.push(waiter)
    this.network.addMachine(waiter.state)
    waiter.state.pipe('Waiting', this.state, 'WaiterAvailable')
    this.state.add(waiter.state, 'Waiting')
  }

  addCustomer(customer: Customer) {
    this.customers.push(customer)
    this.network.addMachine(customer.state)
    customer.state.pipe('WaitingToOrder', this.state, 'CustomerWaiting')
    customer.state.pipe('Eating', this.state, 'CustomerEating')
    this.state.add(customer.state, 'WaitingToOrder')
  }

  CustomerEating_exit() {
    return !this.customers.some(c => c.state.is('Eating'))
  }

  MealWasted_state() {
    this.state.drop('MealWasted')
  }

  MealReady_state(customer_id: string) {
    this.meals_pending.push(customer_id)
    const waiter = _.find(this.waiters, w => w.state.is('Waiting'))
    if (waiter) this.state.add(waiter.state, 'DeliveringMeal')
    this.state.drop('MealReady')
  }

  WaiterAvailable_enter() {
    const waiter = _.find(this.waiters, w => w.state.is('Waiting'))
    if (this.meals_pending.length) {
      this.state.add(waiter.state, 'DeliveringMeal')
      return false
    }
  }

  ChefAvailable_exit() {
    return !this.chefs.some(w => w.state.is('Waiting'))
  }

  WaiterAvailable_exit() {
    return !this.waiters.some(w => w.state.is('Waiting'))
  }

  ServingCustomer_enter() {
    const waiter = _.find(this.waiters, w => w.state.is('Waiting'))
    const customer = _.find(this.customers, c => c.state.is('WaitingToOrder'))
    if (!customer || !waiter) return false
  }

  ServingCustomer_state() {
    const waiter = _.find(this.waiters, w => w.state.is('Waiting'))
    const customer = _.find(this.customers, c => c.state.is('WaitingToOrder'))
    this.state.add(waiter.state, 'TakingOrder', customer)
    this.state.drop('ServingCustomer')
  }
}
