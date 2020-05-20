import Capability from './Capability';
import Branding from './Branding';

export default class ChildCompany {
	id: string = null;
	customerId: number;
	senderName: string;
	department: string;
	customerNumber: string;
	apiKey: string;
	fromMailAddress: string;
	replyToAddress: string;
	cvr: string;
	branding: Branding;
	capabilities: Capability[];
	creatorId: string;
	email: string = '';
	createdAt: Date;

	constructor(initialValue: Partial<ChildCompany>) {
		Object.assign(this, initialValue);
	}
}
