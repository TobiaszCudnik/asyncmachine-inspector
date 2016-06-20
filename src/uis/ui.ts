
export default class Ui<T> {

	constructor(
			public data: T) {
	}
	
	render() {
	}

	
	patch(diff: ID3NetworkJson) {
		jsondiffpatch.patch(this.data, diff)
		this.render()
	}
}