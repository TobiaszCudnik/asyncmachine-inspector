import {
    default as DataService,
    StepTypes
} from './joint-data-service'
import Layout from './joint-layout'
import workerio from 'workerio/src/workerio/index'
import * as _ from 'underscore'
import * as jsondiffpatch from 'jsondiffpatch'
import * as deepcopy from 'deepcopy'


export interface IDataServiceSync {
    position: number,
    positino_max: number,
    step_type: StepTypes,
    during_transition: boolean,
    is_latest: boolean,
    current_patch: Object,
    logs: any
}

export interface ISync {
    layout_data: Object,
    patch: IDelta,
    data_service: IDataServiceSync,
    changed_ids: string[]
}

let data_service = new DataService;
const layout = new Layout(null);
const differ = jsondiffpatch.create({
    objectHash: obj => obj.id
})

function sync(data, changed_ids): ISync {
    return {
        layout_data: layout.exportLayoutData(),
        patch: differ.diff(data, data_service.data),
        data_service: syncDataService(),
        changed_ids
    }
}

function syncDataService(): IDataServiceSync {
    return _.pick(data_service, 'position', 'position_max', 'step_type',
        'during_transition', 'is_latest', 'current_patch')
}


workerio.publishInterface(self, 'api', {
    reset() {
        data_service.removeAllListeners('scrolled')
        data_service = new DataService
    },
    setData(json, reset = false) {
        data_service.data = json
        layout.layout()
        return {
            layout_data: layout.exportLayoutData(),
            data_service: syncDataService(),
        }
    },
    addPatch(patch): IDataServiceSync {
        data_service.addPatch(patch)
        return syncDataService()
    },
    setStepType(type: StepTypes): ISync {
        const data = deepcopy(data_service.data)
        let ids = data_service.setStepType(type)
        return sync(data, ids)
    },
    /**
     * Used to reset the position to the last rendered one, to guarantee the
     * diff integrity.
     */
    blindSetPosition(type: StepTypes, position: number) {
        data_service.setStepType(type)
        data_service.scrollTo(position)
    },
    layout(position: number): ISync {
        const data = deepcopy(data_service.data)
        let ids = data_service.scrollTo(position)
        layout.layout()
        return sync(data, ids)
    }
})
