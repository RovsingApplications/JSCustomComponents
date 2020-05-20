import Branding from './Branding';

export default class ChildOnboardingRequest {
	id: string = null;
	name: string = '';
	customerNumber: string = '';
	cvr: string = '';
	email: string = '';
	department: string = '';
	branding: Branding;
	created: Date;

	constructor(initialValue: Partial<ChildOnboardingRequest>) {
		Object.assign(this, initialValue);
	}
}