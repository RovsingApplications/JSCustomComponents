import MakeRequest from "../Utilities/MakeRequest";
import Globals from "../Globals/Globals";
import Constants from "../Constants/Constants";
import CustomerPaymentAccount from "../Models/CustomerPaymentAccount";

export default class CustomerCredentialsService {

	private authHeaders = { [Constants.apiKeyHeaderName]: Globals.apiKey, [Constants.netsIdHeaderName]: Globals.netsId };

	getByApiKey() {
		return new MakeRequest(
			`${Globals.baseUrl}api/credentials/get`,
			'get', this.authHeaders
		).send();
	}

	upsert(customerPaymentAccounts: Array<CustomerPaymentAccount>) {
		return new MakeRequest(
			`${Globals.baseUrl}api/credentials/upsert`,
			'post', { ...this.authHeaders, 'Content-Type': 'application/json' }
		).send(JSON.stringify(customerPaymentAccounts));
	}

}