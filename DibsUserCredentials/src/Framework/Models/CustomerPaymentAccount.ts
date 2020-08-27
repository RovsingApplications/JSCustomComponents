export default class CustomerPaymentAccount {
	id: string;
	customerApiKey: string;
	name: string = '';
	merchantId: string = '';
	secretKey: string = '';
	checkoutKey: string = '';

	constructor(customerPaymentAccounts: Partial<CustomerPaymentAccount>) {
		Object.assign(this, customerPaymentAccounts);
	}
}