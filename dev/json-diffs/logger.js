var am = require('asyncmachine')
var Logger = require('../../build/logger').default
var Network = require('../../build/network').default
const repl = require('repl')

global.am = am

global.machine1 = am.factory(['A', 'B', 'C', 'D'])
machine1.id('1').logLevel(2)
machine1.C = {drops: ['B']}
machine1.A = {requires: ['B']}
machine1.D = {requires: ['C']}

global.machine2 = am.factory(['E', 'F', 'G'])
machine2.id('2')
machine2.E = {drops: ['F']}

global.machine3 = am.factory(['E', 'F'])
machine3.id('3')
machine3.E = {drops: ['F']}

global.machine4 = am.factory(['E', 'F'])
machine4.id('4')
machine4.E = {drops: ['F']}

global.machine5 = am.factory(['E', 'F'])
machine5.id('5')
machine5.E = {drops: ['F']}

// TODO check this piping
machine1.pipe('A', machine2, 'E')
machine2.pipe('E', machine1, 'B')
machine2.pipe('F', machine1, 'B')
machine2.pipe('E', machine3, 'F')
machine2.pipe('G', machine4, 'F')

// machine5.pipe('F', machine3, 'E')

// init env
machine1.add('A')

global.network = new Network

function test() {
  var test = am.factory(['X', 'Y'])
  network.addMachine(test)
}

function test2() {
  machine1.pipe('A', machine4, 'F')
}

function test3() {
  machine3.pipe('F', machine4, 'F')
}

global.test = test
global.test2 = test2
global.test3 = test3

global.network = new Network
network.addMachine(machine1)
network.addMachine(machine2)
network.addMachine(machine3)
network.addMachine(machine4)
network.addMachine(machine5)

global.logger = new Logger(network, 'http://localhost:3030/logger')

repl.start({
  prompt: 'logger> ',
  input: process.stdin,
  output: process.stdout
});