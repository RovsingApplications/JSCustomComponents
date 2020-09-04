import BaseDictionary from './Base/BaseDictionary';

export default class DanishDictionary extends BaseDictionary {

	dictionary: any = {
		NoAccounts: 'Ingen konti',
		SelectAccount: 'vælg en konto',
		Errors: {
			SomethingWentWrong: 'Noget gik galt',
			PaymentAccountNotFound: 'Ingen betalingskonto tilføjet',
			InvalidCredentials: 'Ugyldige legitimationsoplysninger',
			Unauthorized: 'Uberettiget',
			EnterAttributes: 'Indtast nets-id, api-key- og base-url-attributter'
		}
	};

}