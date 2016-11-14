import * as jsondiffpatch from 'jsondiffpatch'
import * as deepcopy from 'deepcopy'
import { expect } from 'chai'
import JointDataService from '../../src/ui/joint-data-service'
import { TCell } from '../../src/ui/joint-network'

describe('JointDataService', function(){
    let steps = [
        // 0
        {cells: [
            {id: '1', val: "foo"},
            {id: '2', val: "foo"},
            {id: '3', val: "foo"},
            {id: '4', val: "foo"},
            {id: '5', val: "foo"},
        ]},
        // 1
        {cells: [
            {id: '1', val: "foo"},
            {id: '2', val: "foo"},
            // 3 is missing
            {id: '4', val: "foo"},
            {id: '5', val: "foo"},
        ]},
        // 2
        {cells: [
            {id: '1', val: "foo"},
            {id: '2', val: "foo"},
            // 4 is missing
            // 5 changed to bar
            {id: '5', val: "bar"},
        ]},
        // 3
        {cells: [
            {id: '1', val: "foo"},
            // 2 changed to baz
            {id: '2', val: "baz"},
            // 4 is back
            {id: '4', val: "foo"},
            {id: '5', val: "bar"},
        ]},
        // 4
        {cells: [
            // 1 changed to baz
            {id: '1', val: "baz"},
            {id: '2', val: "baz"},
            {id: '4', val: "foo"},
            {id: '5', val: "bar"},
        ]}
    ]
    let service: JointDataService
    let data
    let differ = jsondiffpatch.create({
        objectHash: (cell: TCell) => cell.id
    })
    beforeEach(function(){
        data = deepcopy(steps[0])
        service = new JointDataService(data)
        service.addPatch({diff: differ.diff(steps[0], steps[1])})
        service.addPatch({diff: differ.diff(steps[1], steps[2])})
        service.addPatch({diff: differ.diff(steps[2], steps[3])})
        service.addPatch({diff: differ.diff(steps[3], steps[4])})
    })
    describe('patching', function(){
        beforeEach(function(){
            service.data = deepcopy(steps[0])
        })
        it('0 -> 1', function(){
            let cells = service.scrollTo(1)
            expect(cells.size).to.eql(1)
            expect([...cells]).to.eql(['3'])
            expect(service.data).to.eql(steps[1])
            expect(service.last_scroll_add_remove).to.eql(true)
        })
        it('0 -> 3', function(){
            let cells = service.scrollTo(3)
            expect(cells.size).to.eql(4)
            expect([...cells]).to.eql(['3', '4', '5', '2'])
            expect(service.data).to.eql(steps[3])
            expect(service.last_scroll_add_remove).to.eql(true)
        })
        it('0 -> 3 -> 4', function(){
            service.scrollTo(3)
            service.scrollTo(4)
            expect(service.last_scroll_add_remove).to.eql(false)
        })
    })
    describe('unpatching', function(){
        beforeEach(function(){
            service.data = deepcopy(steps[0])
        })
        it('0 -> 1 -> 0', function(){
            service.scrollTo(1)
            let cells = service.scrollTo(0)
            expect(cells.size).to.eql(1)
            expect([...cells]).to.eql(['3'])
            expect(service.data).to.eql(steps[0])
            expect(service.last_scroll_add_remove).to.eql(true)
        })
        it('0 -> 3 -> 0', function(){
            service.scrollTo(3)
            let cells = service.scrollTo(0)
            expect(cells.size).to.eql(4)
            expect([...cells]).to.eql(['2', '4', '5', '3'])
            expect(service.data).to.eql(steps[0])
            expect(service.last_scroll_add_remove).to.eql(true)
        })
    })
    // describe('unpatching', function(){

    // })
})