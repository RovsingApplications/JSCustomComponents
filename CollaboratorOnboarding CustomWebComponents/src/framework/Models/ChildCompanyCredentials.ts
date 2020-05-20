export default class ChildCompanyCredentials {
	name: string;
	customerNumber: string;
	apiKey: string;
	creatorId: string;
	email: string;

	constructor(initialValue: Partial<ChildCompanyCredentials>) {
		Object.assign(this, initialValue);
	}
}
