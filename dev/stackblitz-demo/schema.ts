// import AsyncMachine, {PipeFlags} from '../../node_modules/asyncmachine/build/asyncmachine.es6.js'
// import {IState} from '../../node_modules/asyncmachine/build/types.js'
import AsyncMachine, {PipeFlags} from 'asyncmachine'
import {IState} from 'asyncmachine/src/types'

class Machine1 extends AsyncMachine<any, any, any> {
  A: IState = {}
  B: IState = {drop: ['A']}
  C: IState = {}
  D: IState = {}
  E: IState = {}

  constructor() {
    super()
    this.id('machine 1 A-E')
    this.logLevel(3)
    this.registerAll()
  }
}

class Machine2 extends AsyncMachine<any, any, any> {
  F = {}
  G = {}
  H = {}

  constructor() {
    super()
    this.id('machine 2 F-H')
    this.logLevel(3)
    this.registerAll()
  }
}

class Machine3 extends AsyncMachine<any, any, any> {
  I = {}
  J = {}

  constructor() {
    super()
    this.id('machine 3 I-J')
    this.logLevel(3)
    this.registerAll()
  }
}

const machine1 = new Machine1
const machine2 = new Machine2
const machine3 = new Machine3

machine1.pipe('A', machine2, 'F', PipeFlags.INVERT)
machine2.pipe('H', machine1, 'B')
machine2.pipe('F', machine3, 'I')

export default {machine1, machine2, machine3}
