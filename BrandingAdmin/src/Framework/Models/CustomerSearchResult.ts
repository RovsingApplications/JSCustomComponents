import Customer from "./Customer";

export default class CustomerSearchResult {
	customers: Customer[];
	totalResults: number;

	constructor(customer: Partial<CustomerSearchResult>) {
		Object.assign(this, customer);
	}
}