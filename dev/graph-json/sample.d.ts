type MachineId = string;
type StateName = string;

export interface INetworkJson {
	"machines": Array<{
		object_type: OBJECT_TYPE.MACHINE,
		id: MachineId,
		name: string,
		"nodes": Array<{
			object_type: OBJECT_TYPE.NODE,
			name: StateName;
			machineId: MachineId;
			auto: boolean
			negotiating: boolean,
			is_set: boolean;
		} | {
			object_type: OBJECT_TYPE.NODE_EXTERNAL,
			source: {
				machineId: MachineId,
				stateName: StateName
			},
			target: {
				machineId: MachineId,
				stateName: StateName
			}
		}>,
		links: Array<{
			object_type: OBJECT_TYPE.NODE_LINK,
			source: StateId,
			target: StateId,
			active: boolean,
			type: RELATION_TYPE | RELATION_UI
		}>
	}>,
	"links": Array<{
		object_type: OBJECT_TYPE.MACHINE_LINK,
		source: MachineId,
		target: MachineId,
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

enum OBJECT_TYPE {
	MACHINE,
	MACHINE_LINK,
	NODE,
	NODE_EXTERNAL,
	NODE_LINK
}
