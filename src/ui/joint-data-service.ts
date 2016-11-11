import { IDelta } from 'jsondiffpatch'
import * as jsondiffpatch from 'jsondiffpatch'
import {
    INetworkJson,
    TCell
} from './joint-network'
import { EventEmitter } from 'events'
import {
    IPatch,
    PatchType,
    ILogEntry
} from '../network'

export enum Direction {
    FWD,
    BACK
}

class JointDataService extends EventEmitter {
    patches: IPatch[] = [];
    data: INetworkJson | null;
    // 0 mean initial, non-patched data
    step = 0;
    during_transition = false;
    transitions_count = 0;
    /** Did the last scroll add or remove any cells? */
    // TODO binary flags for all of the last scrolls props
    last_scroll_add_remove = false;
    last_scroll_direction: Direction | null = null
    get current_patch(): IPatch | null {
        if (!this.step)
            return null
        return this.patches[this.step-1]
    }
    get is_latest() {
        return this.step == this.patches.length
    }
    constructor(data?: INetworkJson) {
        super()
        this.data = data || null
    }
    addPatch(patch: IPatch) {
        this.patches.push(patch)
    }
    // TODO the reverse param
    scrollOne() {
        this.scrollTo(Math.min(this.step + 1, this.patches.length))
    }
    /**
     * Returns all the logs till the current position.
     */
    getLogs(): ILogEntry[][] {
        return this.patches.slice(0, Math.max(0, this.step - 1))
            .map( patch => patch.logs || [] )
    }
    /**
     * Slides data to specific point (0 == no patches applied).
     * 
     * Returns a list of affected nodes (in their latest form (
     * in the scroll direction)).
     */
    scrollTo(position: number): Set<string> {
        this.last_scroll_add_remove = false
        let changed = new Set<string>()
		if (position < this.step) {
            this.last_scroll_direction = Direction.BACK
			// go back in time
			for (let i = this.step; i > position; i--) {
                let diff = this.patches[i-1].diff
				if (diff)
                    this.unapplyDiff(diff, changed)
                this.step = i
				this.handleDuringTransition(this.patches[i-1], true)
			}
		} else if (position > this.step) {
            this.last_scroll_direction = Direction.FWD
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
		if (packet.type == PatchType.TRANSITION_START)
			this.transitions_count += reversed ? -1 : 1
		else if (packet.type == PatchType.TRANSITION_END)
			this.transitions_count += reversed ? 1 : -1
	}
}

export default JointDataService
