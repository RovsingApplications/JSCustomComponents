export default class ProductDeliverySigner {
	name: string;
	identification: string;
	email: string;

	constructor(signer: Partial<ProductDeliverySigner>) {
		Object.assign(this, signer);
	}
}