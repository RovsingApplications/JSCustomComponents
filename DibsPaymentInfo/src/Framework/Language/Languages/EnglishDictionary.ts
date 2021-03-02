import BaseDictionary from "./Base/BaseDictionary";

export default class EnglishDictionary extends BaseDictionary {

	dictionary: any = {
		PaymentElement: {
			ChargedAt: "Charged At",
			PaymentOrderReference: "Payment Order Reference",
			DownloadReceipt: "Download Receipt"
		},
		ItemsElement: {
			Item: "Item",
			Qty: "Qty",
			UnitPrice: "Unit price",
			TaxRate: "Tax rate",
			Amount: "Amount",
			Subtotal: "Subtotal",
			Tax: "Tax",
			Total: "Total"
		}
	};

}
