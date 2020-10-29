import { DocumentType } from "./DocumentType";

export default class ProductDeliveryDocument {
	documentType: DocumentType;
	fileName: string;

	constructor(document: Partial<ProductDeliveryDocument>) {
		Object.assign(this, document);
	}
}