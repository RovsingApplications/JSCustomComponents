import MakeRequest from "../Utilities/MakeRequest";
import Globals from "../Globals/Globals";
import Constants from "../Constants/Constants";

export default class PaymentService {

	private authHeaders = { [Constants.apiKeyHeaderName]: Globals.apiKey, [Constants.netsIdHeaderName]: Globals.netsId };

	getByPaymentId(paymentId: string) {
		return new MakeRequest(
			`${Globals.baseUrl}api/Payment/get/${paymentId}`,
			'get', this.authHeaders
		).send();
	}
	getByPaymentSignOrder(signingOrderId: string, signerReference: string) {
		return new MakeRequest(
			`${Globals.baseUrl}api/Payment/GetByOrderAndSigner?signingOrderId=${signingOrderId}&signerReference=${signerReference}`,
			'get', this.authHeaders
		).send();
	}

	downloadReceipt(paymentId: string) {
		return new MakeRequest(
			`${Globals.baseUrl}api/Payment/receipt/${paymentId}`,
			'get', this.authHeaders
		).send();
	}

}