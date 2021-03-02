import BaseDictionary from "./Base/BaseDictionary";

export default class DanishDictionary extends BaseDictionary {

	dictionary: any = {
		PaymentElement: {
			ChargedAt: "Opladet kl",
			PaymentOrderReference: "Reference til betalingsordre",
			DownloadReceipt: "Download Receipt"
		},
		ItemsElement: {
			Item: "Vare",
			Qty: "Antal",
			UnitPrice: "Pris per stk",
			TaxRate: "Skatteprocent",
			Amount: "Beløb",
			Subtotal: "Subtotal",
			Tax: "Skat",
			Total: "Total"
		}
	};

}