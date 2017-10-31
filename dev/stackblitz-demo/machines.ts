import AsyncMachine, {factory, PipeFlags} from 'asyncmachine'
// TODO IState

export default network => {
  class Machine1 extends AsyncMachine<any, any, any> {
    A = {}
    B = {drop: ['A']}
    C = {}
    D = {}
    E = {}

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

  network.addMachine(machine1)
  network.addMachine(machine2)
  network.addMachine(machine3)

  machine1.pipe('A', machine2, 'F', PipeFlags.INVERT)
  machine2.pipe('H', machine1, 'B')
  machine2.pipe('F', machine3, 'I')

  setTimeout(()=>{
    machine1.add('A')
  }, 3000)

  return [machine1, machine2, machine3]
}
