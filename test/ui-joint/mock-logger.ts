require('source-map-support').install()
var am = require('asyncmachine')
var Logger = require('../../src/logger-client').default
var Network = require('../../src/network').default
const repl = require('nesh')

global.am = am

global.network = new Network

global.machine1 = am.factory(['A', 'B', 'C', 'D', 'E'])
global.machine2 = am.factory(['F', 'G', 'H'])
global.machine3 = am.factory(['I', 'J'])

machine1.id('machine 1 A-E').logLevel(2)
machine1.C = {drop: ['B']}
machine1.A = {require: ['B'], add: ['E']}
machine1.D = {require: ['C']}

machine2.id('machine 2 F-H')
machine2.F = {drop: ['G']}

machine3.id('machine 3 I-J')
machine3.I = {drop: ['J']}

network.addMachine(machine1)
network.addMachine(machine2)
network.addMachine(machine3)

// TODO check this piping
machine1.pipe('A', machine2, 'F', am.PipeFlags.INVERT)
machine2.pipe('H', machine1, 'B')
machine2.pipe('F', machine3, 'I')

// machine5.pipe('F', machine3, 'E')

// init env
machine1.add('A')

function test1() {
  var test = am.factory(['X', 'Y'])
  network.addMachine(test)
}

function test2() {
  machine1.pipe('A', machine2, 'F')
}

function test4() {
  machine1.add(['A', 'B'])
}

function test5() {
  machine1.drop(['A', 'B'])
}

function test6() {
  machine1.pipe('A', machine2, 'G')
}

global.test1 = test1
global.test2 = test2
global.test4 = test4
global.test5 = test5
global.test6 = test6

global.logger = new Logger(network, 'http://localhost:3030/logger')

// repl.loadLanguage('es6')
repl.start({
  prompt: 'logger> ',
  input: process.stdin,
  output: process.stdout
});