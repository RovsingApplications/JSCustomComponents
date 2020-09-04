import MakeRequest from "../Utilities/MakeRequest";
import Globals from "../Globals/Globals";
import Constants from "../Constants/Constants";

export default class DibsAccountsService {

	private authHeaders = { [Constants.apiKeyHeaderName]: Globals.apiKey, [Constants.netsIdHeaderName]: Globals.netsId };

	getAccountNames() {
		return new MakeRequest(
			`${Globals.baseUrl}api/Credentials/GetAccountNames`,
			'get', this.authHeaders
		).send();
	}
}