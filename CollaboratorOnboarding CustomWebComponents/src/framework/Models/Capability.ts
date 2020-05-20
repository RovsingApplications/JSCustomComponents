export default class Capability {
	priority: string;
	name: string;
	arguments: string;

	constructor(initialValue: Partial<Capability>) {
		Object.assign(this, initialValue);
	}
}
