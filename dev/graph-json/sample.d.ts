type MachineId: string;

export interface INetwork {
	"machines": Array<{
			id: "2",
			name: "bar",
			"nodes": Array<{
				externals: ExternalNode[];
				machines: MachinesMap;
				id: string;
				machine: MachineId;
				name: string;
			}>
		}>
	
}