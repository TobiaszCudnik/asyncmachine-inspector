type MachineId = string;

export interface INetwork {
	"machines": Array<{
			id: string,
			name: string,
			"nodes": Array<{
				id: string;
				name: string;
				machine: MachineId;
				auto: boolean
				negotiating: boolean,
				set: boolean;
			} | {
				id: string,
				source: MachineId,
				target: MachineId
			}>,
			links: Array<{
				source: StateId,
				target: StateId,
				type: RELATION_TYPE | RELATION_UI
			}>
		}>,
	"links": Array<{
		source: string,
		target: string,
		two_way: boolean
	}>
}


enum RELATION_TYPE {
	REQUIRES,
	BLOCKS,
	ORDER,
	IMPLIES
}

enum RELATION_UI {
	EXTERNAL
}
