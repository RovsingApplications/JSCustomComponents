import DibsPayment from "./DibsPayment";
import Item from "./Item";

export default class PaymentInfo {
	payment: DibsPayment;
	items: Item[];
	createdAt: Date;
	signingOrderId: string;
	signerReference: string

	constructor(paymentInfo: Partial<PaymentInfo>) {
		Object.assign(this, paymentInfo);
	}
}

