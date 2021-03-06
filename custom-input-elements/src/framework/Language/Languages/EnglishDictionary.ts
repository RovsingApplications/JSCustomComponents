import BaseDictionary from "./Base/BaseDictionary";

export default class EnglishDictionary extends BaseDictionary {

	dictionary: any = {
		AddressElement: {
			Address: "address",
			City: "city",
			Country: "country",
			Zip: "zip"
		},
		BankElement: {
			Account: "Bank Account",
			RegistrationNumber: "Bank Account Registration Number"
		}
	};

}
