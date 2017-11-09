// import AsyncMachine, {PipeFlags} from '../../node_modules/asyncmachine/build/asyncmachine.es6.js'
// import {IState} from '../../node_modules/asyncmachine/build/types.js'
import AsyncMachine, {PipeFlags} from 'asyncmachine'
import {IState} from 'asyncmachine/src/types'
import _ from 'lodash'
import delay from 'delay'
import random from 'random-int'

const LOG_LEVEL = 2

export class Chef extends AsyncMachine<any, any, any> {
  Waiting = {auto: true}
  Cooking = {drop: ['Waiting']}

  restaurant: Restaurant

  constructor(name) {
    super()
    this.id(`Chef ${name}`)
    this.logLevel(LOG_LEVEL)
    this.registerAll()
    this.add('Waiting')
  }

  async Cooking_state(customer_id: string) {
    await delay(random(3, 5)*1000)
    this.restaurant.add('MealReady', customer_id)
    this.drop('Cooking')
  }

  Cooking_end() {
    if (this.restaurant.orders_pending.length)
      this.add('Cooking', this.restaurant.orders_pending.unshift())
  }
}

export class Waiter extends AsyncMachine<any, any, any> {
  Waiting = { drop: ['Busy'], auto: true }
  Busy = { drop: ['Waiting'] }
  TakingOrder = { add: ['Busy'], drop: ['Waiting'] }
  RequestingMeal = { add: ['Busy'], drop: ['TakingOrder'] }
  DeliveringMeal = { add: ['Busy'], drop: ['Waiting'] }

  restaurant: Restaurant;

  constructor(name) {
    super()
    this.id(`Waiter ${name}`)
    this.logLevel(LOG_LEVEL)
    this.registerAll()
    this.add('Waiting')
  }

  async TakingOrder_state(customer: Customer) {
    customer.add('Ordering')
    this.add('TakingOrder')
    await delay(1000)
    // TODO check the abort function
    customer.add('WaitingForMeal')
    this.add('RequestingMeal', customer.id())
  }

  RequestingMeal_state(customer_id: string) {
    const chef = _.find(this.restaurant.chefs, w => w.is('Waiting'))
    if (chef)
      chef.add('Cooking', customer_id)
    else
      this.restaurant.orders_pending.push(customer_id)
    this.drop(['RequestingMeal', 'Busy'])
  }

  async DeliveringMeal_state(customer_id: string) {
    debugger
    // TODO check if customer exists (didnt leave)
    await delay(random(1, 2)*1000)
    // TODO check the abort function
    const customer = _.find(this.restaurant.customers, c => c.id() == customer_id)
    debugger
    customer.add('Eating')
    this.drop(['DeliveringMeal', 'Busy'])
  }
}

export class Customer extends AsyncMachine<any, any, any> {
  WaitingToOrder = {}
  Ordering = { drop: ['WaitingToOrder'] }
  WaitingForMeal = { drop: ['Ordering'] }
  Eating = { drop: ['WaitingForMeal'] }
  Left = { drop: ['Eating', 'WaitingForMeal', 'Ordering', 'WaitingToOrder'] }

  constructor(name) {
    super()
    this.id(`Customer ${name}`)
    this.logLevel(3)
    this.registerAll()
  }

  async Eating_state() {
    await delay(2000)
    this.add('Left')
  }
}

// TODO extract states to a separate class
export class Restaurant extends AsyncMachine<any, any, any> {
  WaiterAvailable = {multi: true}
  ChefAvailable = {multi: true}
  CustomerWaiting = {multi: true}
  CustomerEating = {multi: true}
  MealReady = {multi: true}
  ServingCustomer = { require: ['WaiterAvailable', 'CustomerWaiting'], auto: true }

  chefs: Chef[] = []
  waiters: Waiter[] = []
  customers: Customer[] = []

  orders_pending: string[] = []

  constructor(public network) {
    super()
    this.id(`Restaurant`)
    this.logLevel(LOG_LEVEL)
    this.register('WaiterAvailable', 'ChefAvailable', 'CustomerWaiting', 'CustomerEating', 'ServingCustomer', 'MealReady')
    network.addMachine(this)
  }

  addChef(chef: Chef) {
    chef.restaurant = this
    this.chefs.push(chef)
    this.network.addMachine(chef)
    chef.pipe('Waiting', this, 'ChefAvailable')
  }

  addWaiter(waiter: Waiter) {
    waiter.restaurant = this
    this.waiters.push(waiter)
    this.network.addMachine(waiter)
    waiter.pipe('Waiting', this, 'WaiterAvailable')
  }

  addCustomer(customer: Customer) {
    this.customers.push(customer)
    this.network.addMachine(customer)
    customer.pipe('WaitingToOrder', this, 'CustomerWaiting')
    customer.add('WaitingToOrder')
  }

  async MealReady_state(customer_id: string) {
    await this.when('WaiterAvailable')
    const waiter = _.find(this.waiters, w => w.is('Waiting'))
    waiter.add('DeliveringMeal', customer_id)
    this.drop('MealReady')
  }

  ServingCustomer_enter() {
    // states below are guaranteed to be set
    const waiter = _.find(this.waiters, w => w.is('Waiting'))
    // if (!waiter) return
    const customer = _.find(this.customers, c => c.is('WaitingToOrder'))
    // if (!customer) return
    waiter.add('TakingOrder', customer)
    this.drop('ServingCustomer')
  }
}
