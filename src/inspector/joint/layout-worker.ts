import DataService, { StepTypes } from './data-service'
import Layout from './layout'
import workerio from 'workerio/src/workerio/index'
import * as _ from 'underscore'
import * as jsondiffpatch from 'jsondiffpatch'
import { IDelta } from 'jsondiffpatch'
import { IPatch, ITransitionData } from '../../network/network'
import * as db from 'idb-keyval'
import { INetworkJson } from './network'
import * as assert from 'assert/'
import { isProd } from '../utils'
import { isString } from 'underscore'

export interface IDataServiceSync {
  position: number
  position_max: number
  patch_position: number
  step_type: StepTypes
  active_transitions: ITransitionData[]
  prev_transitions: ITransitionData[]
  next_transitions: ITransitionData[]
  is_latest: boolean
  current_patch: Object
  logs: string[]
  last_scroll_add_remove: boolean
}

export interface ISync {
  layout_data: Object
  diff?: IDelta
  rev_diff?: IDelta
  db_key?: string
  data_service: IDataServiceSync
  changed_ids: string[]
}

let data_service = new DataService()
const layout = new Layout()
const differ = jsondiffpatch.create({
  objectHash: obj => obj.id
})

// TODO group
// - layout_data as graph_layout
// - patch
// - changed_ids
// into DataServiceScrollUpdate
async function prepareDiffUpdate(
  changed_ids: string[],
  prev_position: number
): Promise<ISync> {
  const update: ISync = {
    rev_diff: null,
    diff: null,
    db_key: null,
    layout_data: layout.exportLayoutData(),
    data_service: syncDataService(),
    changed_ids
  }
  if (Math.abs(data_service.patch_position - prev_position) == 1) {
    if (prev_position > data_service.patch_position) {
      update.rev_diff = data_service.patches[prev_position].diff
    } else if (prev_position < data_service.patch_position) {
      update.diff = data_service.patches[data_service.patch_position].diff
    }
  } else if (prev_position != data_service.position) {
    if (!isProd()) console.time("db.set('scroll_result')")
    await db.set('scroll_result', data_service.data)
    if (!isProd()) console.timeEnd("db.set('scroll_result')")
    update.db_key = 'scroll_result'
  }
  return update
}

function syncDataService(): IDataServiceSync {
  return _.pick(
    data_service,
    'position',
    'position_max',
    'step_type',
    'active_transitions',
    'prev_transitions',
    'next_transitions',
    'is_latest',
    'current_patch',
    'patch_position',
    'last_scroll_add_remove'
  ) as IDataServiceSync // TODO loose casting
}

workerio.publishInterface(self || window, 'api', {
  reset() {
    // TODO needed?
    data_service.removeAllListeners('scrolled')
    data_service = new DataService()
  },
  async fullSync() {
    const data = (await db.get('full_sync')) as INetworkJson
    data_service.data = data
    layout.setData(data)
    layout.layout()
    return {
      layout_data: layout.exportLayoutData(),
      data_service: syncDataService()
    }
  },
  addPatch(patch): IDataServiceSync {
    data_service.addPatch(patch)
    return syncDataService()
  },
  async addPatches(input: IPatch[] | string) {
    // @ts-ignore
    const patches: IPatch[] = isString(input) ? await db.get(input) : input
    for (let patch of patches) {
      data_service.addPatch(patch)
    }
  },
  async setStepType(type: StepTypes): Promise<ISync> {
    const prev_position = data_service.positionToPatchPosition(
      data_service.position
    )
    let ids = data_service.setStepType(type)
    return await prepareDiffUpdate(ids, prev_position)
  },
  /**
   * Used to reset the position to the last rendered one, to guarantee the
   * diff integrity.
   */
  blindSetPosition(type: StepTypes, position: number) {
    const t = StepTypes
    switch (type) {
      case t.STATES:
        position = data_service.index.states.indexOf(position)
        break
      case t.TRANSITIONS:
        position = data_service.index.transitions.indexOf(position)
        break
    }
    assert(position != -1)
    data_service.setStepType(type)
    data_service.scrollTo(position)
  },
  // rename to syncWorker or something
  async diffSync(position: number): Promise<ISync> {
    const prev_position = data_service.positionToPatchPosition(
      data_service.position
    )
    let changed_ids = data_service.scrollTo(position)
    if (data_service.last_scroll_add_remove) {
      layout.setData(data_service.data, changed_ids)
      layout.layout()
    }
    return await prepareDiffUpdate(changed_ids, prev_position)
  },
  // TODO export via indexedDB
  export() {
    return {
      // skip the fake full sync patch
      patches: data_service.patches.slice(1)
    }
  }
})
