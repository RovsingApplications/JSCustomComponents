export default class Customer {
	id: number;
	apiKey: string;
	senderName: string;
	department: string;

	constructor(customer: Partial<Customer>) {
		Object.assign(this, customer);
	}
}