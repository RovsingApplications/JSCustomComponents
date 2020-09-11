import MakeRequest from "../Utilities/MakeRequest";
import Globals from "../Globals/Globals";
import Constants from "../Constants/Constants";
import CustomerPaymentAccount from "../Models/CustomerPaymentAccount";

export default class CustomerCredentialsService {

	private authHeaders = { [Constants.apiKeyHeaderName]: Globals.apiKey, [Constants.netsIdHeaderName]: Globals.netsId };

	request: MakeRequest;

	getByApiKey() {
		this.request = new MakeRequest(
			`${Globals.baseUrl}api/credentials/get`,
			'get', this.authHeaders
		);
		return this.request.send();
	}

	upsert(customerPaymentAccounts: Array<CustomerPaymentAccount>) {
		this.request = new MakeRequest(
			`${Globals.baseUrl}api/credentials/upsert`,
			'post', { ...this.authHeaders, 'Content-Type': 'application/json' }
		);
		return this.request.send(JSON.stringify(customerPaymentAccounts));
	}

}