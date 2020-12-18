import BaseDictionary from "./Base/BaseDictionary";

export default class DanishDictionary extends BaseDictionary {

	dictionary: any = {
		AddressElement: {
			Address: "adresse",
			City: "by",
			Zip: "postnummer"
		},
		BankElement: {
			Account: "Kontonummer",
			RegistrationNumber: "Registreringsnummer"
		}
	};

}