import Branding from "./Branding";
import Capability from "./Capability";

export default class ParentCompany {
	id: string;
	name: string;
	parentCustomerId: number;
	description: string;
	apiKey: string;
	email: string;
	brandings: Branding[];
	capabilities: Capability[];
	created: Date;

	constructor(initialValue: Partial<ParentCompany>) {
		Object.assign(this, initialValue);
	}
}
