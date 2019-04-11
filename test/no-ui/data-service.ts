// import 'source-map-support/register'
// import * as jsondiffpatch from 'jsondiffpatch'
// import * as deepcopy from 'deepcopy'
// import { expect } from 'chai'
// import JointDataService, {
//     StepTypes
// } from '../../src/ui/joint-data-service'
// import { TCell } from '../../src/ui/joint-network'
// import { PatchType } from '../../src/network'
// import * as sinon from 'sinon'
//
//
// describe('scrolling data', function(){
//     let steps = [
//         // 0
//         {cells: [
//             {id: '1', val: "foo"},
//             {id: '2', val: "foo"},
//             {id: '3', val: "foo"},
//             {id: '4', val: "foo"},
//             {id: '5', val: "foo"},
//         ]},
//         // 1
//         {cells: [
//             {id: '1', val: "foo"},
//             {id: '2', val: "foo"},
//             // 3 is missing
//             {id: '4', val: "foo"},
//             {id: '5', val: "foo"},
//         ]},
//         // 2
//         {cells: [
//             {id: '1', val: "foo"},
//             {id: '2', val: "foo"},
//             // 4 is missing
//             // 5 changed to bar
//             {id: '5', val: "bar"},
//         ]},
//         // 3
//         {cells: [
//             {id: '1', val: "foo"},
//             // 2 changed to baz
//             {id: '2', val: "baz"},
//             // 4 is back
//             {id: '4', val: "foo"},
//             {id: '5', val: "bar"},
//         ]},
//         // 4
//         {cells: [
//             // 1 changed to baz
//             {id: '1', val: "baz"},
//             {id: '2', val: "baz"},
//             {id: '4', val: "foo"},
//             {id: '5', val: "bar"},
//         ]}
//     ]
//     let service: JointDataService
//     let data
//     let differ = jsondiffpatch.create({
//         objectHash: (cell: TCell) => cell.id
//     })
//     beforeEach(function(){
//         data = deepcopy(steps[0])
//         service = new JointDataService(data)
//         service.setStepType(StepTypes.STEPS)
//         service.addPatch({type: PatchType.TRANSITION_START,
//             diff: differ.diff(steps[0], steps[1])})
//         service.addPatch({type: PatchType.TRANSITION_STEP,
//             diff: differ.diff(steps[1], steps[2])})
//         service.addPatch({type: PatchType.TRANSITION_STEP,
//             diff: differ.diff(steps[2], steps[3])})
//         service.addPatch({type: PatchType.TRANSITION_END,
//             diff: differ.diff(steps[3], steps[4])})
//     })
//     describe('patching', function(){
//         beforeEach(function(){
//             service.data = deepcopy(steps[0])
//         })
//         it('0 -> 1', function(){
//             let cells = service.scrollTo(1)
//             expect(cells.size).to.eql(1)
//             expect([...cells]).to.eql(['3'])
//             expect(service.data).to.eql(steps[1])
//             expect(service.position).to.eql(1)
//             expect(service.active_transitions).to.eql(1)
//             expect(service.last_scroll_add_remove).to.eql(true)
//         })
//         it('0 -> 3', function(){
//             let cells = service.scrollTo(3)
//             expect(cells.size).to.eql(4)
//             expect([...cells]).to.eql(['3', '4', '5', '2'])
//             expect(service.data).to.eql(steps[3])
//             expect(service.position).to.eql(3)
//             expect(service.active_transitions).to.eql(1)
//             expect(service.last_scroll_add_remove).to.eql(true)
//         })
//         it('0 -> 3 -> 4', function(){
//             service.scrollTo(3)
//             service.scrollTo(4)
//             expect(service.last_scroll_add_remove).to.eql(false)
//             expect(service.active_transitions).to.eql(0)
//             expect(service.position).to.eql(4)
//         })
//     })
//     describe('unpatching', function(){
//         beforeEach(function(){
//             service.data = deepcopy(steps[0])
//         })
//         it('0 -> 1 -> 0', function(){
//             service.scrollTo(1)
//             let cells = service.scrollTo(0)
//             expect(cells.size).to.eql(1)
//             expect([...cells]).to.eql(['3'])
//             expect(service.data).to.eql(steps[0])
//             expect(service.position).to.eql(0)
//             expect(service.last_scroll_add_remove).to.eql(true)
//             expect(service.active_transitions).to.eql(0)
//         })
//         it('0 -> 3 -> 0', function(){
//             service.scrollTo(3)
//             let cells = service.scrollTo(0)
//             expect(cells.size).to.eql(4)
//             expect([...cells]).to.eql(['2', '4', '5', '3'])
//             expect(service.data).to.eql(steps[0])
//             expect(service.position).to.eql(0)
//             expect(service.last_scroll_add_remove).to.eql(true)
//             expect(service.active_transitions).to.eql(0)
//         })
//         it('0 -> 3 -> 0', function(){
//             service.scrollTo(3)
//             let cells = service.scrollTo(0)
//             expect(service.position).to.eql(0)
//             expect(service.active_transitions).to.eql(0)
//         })
//     })
//     // describe('unpatching', function(){
//
//     // })
// })
//
// describe('grouped step types', function() {
//     let service: JointDataService
//
//     beforeEach(function() {
//         service = new JointDataService({ cells: [0] })
//         sinon.mock(service, 'applyDiff')
//         sinon.mock(service, 'unapplyDiff')
//         let diff = (num) => (
//             { cells: { '0': [ num ], _t: 'a', _0: [ num-1, 0, 0 ] } }
//         )
//         // 1
//         service.addPatch({type: PatchType.NEW_MACHINE, diff: diff(1)})
//         service.addPatch({type: PatchType.STATE, diff: diff(2)})
//         service.addPatch({type: PatchType.TRANSITION_START, diff: diff(3)})
//         service.addPatch({type: PatchType.TRANSITION_STEP, diff: diff(4)})
//         // 5
//         service.addPatch({type: PatchType.TRANSITION_STEP, diff: diff(5)})
//         service.addPatch({type: PatchType.TRANSITION_END, diff: diff(6)})
//         service.addPatch({type: PatchType.STATE, diff: diff(7)})
//         service.addPatch({type: PatchType.TRANSITION_START, diff: diff(8)})
//         service.addPatch({type: PatchType.TRANSITION_STEP, diff: diff(9)})
//         // 10
//         service.addPatch({type: PatchType.TRANSITION_STEP, diff: diff(10)})
//         service.addPatch({type: PatchType.TRANSITION_END, diff: diff(11)})
//         service.addPatch({type: PatchType.STATE, diff: diff(12)})
//     })
//
//     it('states index', function() {
//         expect(service.index.states).to.eql([0, 1, 6, 11])
//     })
//
//     it('transitions index', function() {
//         expect(service.index.transitions).to.eql([0, 1, 5, 6, 10, 11])
//     })
//
//     it('STEPS -> TRANSITIONS', function() {
//         service.setStepType(StepTypes.STEPS)
//         service.scrollTo(5)
//         expect(service.data).to.eql({cells: [5]})
//
//         service.setStepType(StepTypes.TRANSITIONS)
//         expect(service.position).to.eql(2)
//         expect(service.patch_position).to.eql(2)
//         expect(service.data).to.eql({cells: [2]})
//
//         service.scrollOne()
//         expect(service.position).to.eql(3)
//         expect(service.patch_position).to.eql(6)
//         expect(service.data).to.eql({cells: [6]})
//     })
//
//     it('STEPS -> STATES', function() {
//         service.setStepType(StepTypes.STEPS)
//         service.scrollTo(5)
//         expect(service.data).to.eql({cells: [5]})
//
//         service.setStepType(StepTypes.STATES)
//         expect(service.position).to.eql(2)
//         expect(service.patch_position).to.eql(2)
//         expect(service.data).to.eql({cells: [2]})
//
//         service.scrollOne()
//         expect(service.position).to.eql(3)
//         expect(service.patch_position).to.eql(7)
//         expect(service.data).to.eql({cells: [7]})
//     })
//
//     it('STATES -> STEPS', function() {
//         service.scrollTo(3)
//         expect(service.position).to.eql(3)
//         expect(service.patch_position).to.eql(7)
//         expect(service.data).to.eql({cells: [7]})
//
//         service.setStepType(StepTypes.STEPS)
//         expect(service.position).to.eql(7)
//         expect(service.patch_position).to.eql(7)
//         expect(service.data).to.eql({cells: [7]})
//     })
//
//     it('STATES -> TRANSITIONS', function() {
//         service.scrollTo(3)
//         expect(service.position).to.eql(3)
//         expect(service.patch_position).to.eql(7)
//         expect(service.data).to.eql({cells: [7]})
//
//         service.setStepType(StepTypes.TRANSITIONS)
//         expect(service.position).to.eql(4)
//         expect(service.patch_position).to.eql(7)
//         expect(service.data).to.eql({cells: [7]})
//     })
// })
