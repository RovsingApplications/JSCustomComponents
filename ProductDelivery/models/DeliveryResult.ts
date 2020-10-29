import ProductDeliverySigner from "./ProductDeliverySigner";
import ProductDeliveryDocument from "./ProductDeliveryDocument";

export default class DeliveryResult {
	id: string;
	customerId: string;
	orderId: string;
	resultStatus: string;
	signers: ProductDeliverySigner[];
	documents: ProductDeliveryDocument[];
	completedDate: string;
	CreatedAt: string;
	LastModified: string;
	eventLog: any;

	constructor(result: Partial<DeliveryResult>) {
		Object.assign(this, result);
	}
}