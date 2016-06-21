import NetworkJson from '../network'
import * as jsondiffpatch from 'jsondiffpatch'

abstract class Ui<T> {

	constructor(
		public data: T) {
	}
	
	abstract render(el: Element | string);
	
	patch(diff: Object) {
		jsondiffpatch.patch(this.data, diff)
	}
}

export default Ui