export default class Branding {
	id: string;
	key: string;
	description: string;
	brandingId: number;
	created: Date;

	constructor(initialValue: Partial<Branding>) {
		Object.assign(this, initialValue);
	}
}
