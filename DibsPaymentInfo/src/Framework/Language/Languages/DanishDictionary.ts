import BaseDictionary from "./Base/BaseDictionary";

export default class DanishDictionary extends BaseDictionary {

	dictionary: any = {
		PaymentElement: {
			ChargedAt: "Betalt",
			PaymentOrderReference: "Betalingsreference",
			DownloadReceipt: "Download Kvittering"
		},
		ItemsElement: {
			Item: "Produkt/Ydelse",
			Qty: "Antal",
			UnitPrice: "Pris per styk",
			TaxRate: "Skatteprocent",
			Amount: "Beløb",
			Subtotal: "Subtotal",
			Tax: "Skat",
			Total: "Total"
		}
	};

}