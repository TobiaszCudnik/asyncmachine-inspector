import { IDelta } from 'jsondiffpatch'
import * as jsondiffpatch from 'jsondiffpatch'
import {
    INetworkJson,
    TCell
} from './joint-network'
import { EventEmitter } from 'events'
import { ChangeType } from '../network'

export interface IPatch {
    type: number,
    diff: IDelta
}

class JointDataService extends EventEmitter {
    patches: IPatch[] = [];
    data: INetworkJson | null;
    // 0 mean initial, non-patched data
    step = 0;
    during_transition = false;
    transitions_count = 0;
    /** Did the last scroll add or remove any cells? */
    last_scroll_add_remove = false;
    get current_patch(): IPatch {
        return this.patches[this.step+1]
    }
    constructor(data?: INetworkJson) {
        super()
        this.data = data || null
    }
    addDiff(patch: IPatch) {
        this.patches.push(patch)
    }
    /**
     * Slides data to specific point (0 == no patches applied).
     * 
     * Returns a list of affected nodes (in their latest form (
     * in the scroll direction)).
     */
    scrollData(position: number): Set<string> {
        this.last_scroll_add_remove = false
        let changed = new Set<string>()
		if (position < this.step) {
			// go back in time
			for (let i = this.step; i > position; i--) {
                let diff = this.patches[i-1].diff
				if (diff)
                    this.unapplyDiff(diff, changed)
                this.step = i
				this.handleDuringTransition(this.patches[i-1], true)
			}
		} else if (position > this.step) {
			// go fwd in time
			for (let i = this.step; i < position; i++) {
                let diff = this.patches[i].diff
				if (diff)
                    this.applyDiff(diff, changed)
                this.step = i + 1
				this.handleDuringTransition(this.patches[i])
			}
		}
        return changed
    }
    protected applyDiff(diff, changed: Set<string>): void {
		if (!diff.cells)
			return

		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] != '_')
				continue
            if (Array.isArray(diff.cells[key]) && diff.cells[key].length !== 2)
                this.last_scroll_add_remove = true
            changed.add(this.data.cells[key.slice(1)].id)
		}
        jsondiffpatch.patch(this.data, diff)
		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] == '_')
				continue
            if (Array.isArray(diff.cells[key]) && diff.cells[key].length !== 2)
                this.last_scroll_add_remove = true
            changed.add(this.data.cells[key].id)
		}
    }
    protected unapplyDiff(diff, changed: Set<string>): void {
		if (!diff.cells)
			return

		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] == '_')
				continue
            if (Array.isArray(diff.cells[key]) && diff.cells[key].length !== 2)
                this.last_scroll_add_remove = true
            changed.add(this.data.cells[key].id)
		}
        jsondiffpatch.unpatch(this.data, diff)
		for (let key of Object.keys(diff.cells)) {
			if (key == '_t' || key[0] != '_')
				continue
            if (Array.isArray(diff.cells[key]) && diff.cells[key].length !== 2)
                this.last_scroll_add_remove = true
            changed.add(this.data.cells[key.slice(1)].id)
		}
    }
	// TODO breaks when reversing inside nested active_transitions
	handleDuringTransition(packet, reversed = false) {
        // TODO expose data for messages
		if (packet.type == ChangeType.TRANSITION_START)
			this.transitions_count += reversed ? -1 : 1
		else if (packet.type == ChangeType.TRANSITION_END)
			this.transitions_count += reversed ? 1 : -1
	}
}

export default JointDataService
