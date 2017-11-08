// import AsyncMachine, {PipeFlags} from '../../node_modules/asyncmachine/build/asyncmachine.es6.js'
// import {IState} from '../../node_modules/asyncmachine/build/types.js'
import AsyncMachine, {PipeFlags} from 'asyncmachine'
import {IState} from 'asyncmachine/src/types'
import _ from 'lodash'
import delay from 'delay'

export class Chef extends AsyncMachine<any, any, any> {
  Waiting = {auto: true}
  Cooking = {}

  restaurant: Restaurant;

  constructor(name) {
    super()
    this.id(`Chef ${name}`)
    this.logLevel(3)
    this.registerAll()
    this.add('Waiting')
  }
}

export class Waiter extends AsyncMachine<any, any, any> {
  Waiting = { drop: ['Busy'], auto: true }
  Busy = { drop: ['Waiting'] }
  TakingOrder = { add: ['Busy'], drop: ['Waiting'] }
  RequestingMeal = { add: ['Busy'], drop: ['TakingOrder'] }
  DeliveringMeal = { add: ['Busy'], drop: ['DeliveringMeal', 'Waiting'] }
  MealDelivered = { drop: ['Busy', 'DeliveringMeal'] }

  restaurant: Restaurant;

  constructor(name) {
    super()
    this.id(`Waiter ${name}`)
    this.logLevel(3)
    this.registerAll()
    this.add('Waiting')
  }

  async TakingOrder_state(customer: Customer) {
    customer.add('Ordering')
    this.add('TakingOrder')
    await delay(1000)
    this.add('RequestingMeal', customer.id())
  }

  RequestingMeal_state(customer_id) {

  }
}

export class Customer extends AsyncMachine<any, any, any> {
  WaitingToOrder = {auto: true}
  Ordering = {}
  WaitingForMeal = {}
  Eating = { drop: ['WaitingForMeal'] }
  Left = { drop: ['Eating', 'WaitingForMeal', 'Ordering', 'WaitingToOrder'] }

  constructor(name) {
    super()
    this.id(`Customer ${name}`)
    this.logLevel(3)
    this.registerAll()
  }
}

// TODO extract states to a separate class
export class Restaurant extends AsyncMachine<any, any, any> {
  WaiterAvailable = {multi: true}
  ChefAvailable = {multi: true}
  CustomerWaiting = {multi: true}
  CustomerEating = {multi: true}

  chefs: Chef[] = []
  waiters: Waiter[] = []
  customers: Customer[] = []

  orders: string[]

  constructor(public network) {
    super()
    this.id(`Restaurant`)
    this.logLevel(3)
    this.register('WaiterAvailable', 'ChefAvailable', 'CustomerWaiting', 'CustomerEating')
    network.addMachine(this)
  }

  addChef(chef: Chef) {
    chef.pipe('Waiting', this, 'ChefAvailable')
    chef.pipe('Cooking', this, 'ChefAvailable', PipeFlags.INVERT)
    chef.restaurant = this
    this.network.addMachine(chef)
    this.chefs.push(chef)
  }

  addWaiter(waiter: Waiter) {
    waiter.pipe('Waiting', this, 'WaiterAvailable')
    waiter.pipe('Busy', this, 'WaiterAvailable', PipeFlags.INVERT)
    waiter.restaurant = this
    this.network.addMachine(waiter)
    this.waiters.push(waiter)
  }

  addCustomer(customer: Customer) {
    customer.pipe('WaitingToOrder', this, 'CustomerWaiting')
    customer.pipe('WaitingForMeal', this, 'CustomerWaiting')
    customer.pipe('Eating', this, 'CustomerWaiting', PipeFlags.INVERT)
    customer.pipe('Left', this, 'CustomerWaiting', PipeFlags.INVERT)
    customer.add('WaitingToOrder')
    this.network.addMachine(customer)
    this.customers.push(customer)
  }

  WaiterAvailable_state() {
    this.serverCustomer()
  }

  CustomerWaiting_state() {
    this.serverCustomer()
  }

  serverCustomer() {
    const waiter = _.find(this.waiters, w => w.is('Waiting'))
    if (!waiter) return
    const customer = _.find(this.customers, c => c.is('WaitingToOrder'))
    if (!customer) return
    waiter.add('TakingOrder', customer)
  }
}
