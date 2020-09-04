import BaseDictionary from './Base/BaseDictionary';

export default class EnglishDictionary extends BaseDictionary {

	dictionary: any = {
		NoAccounts: 'No Accounts',
		SelectAccount: 'select an account',
		Errors: {
			SomethingWentWrong: 'Something went wrong',
			PaymentAccountNotFound: 'No payment account added',
			InvalidCredentials: 'Invalid credentials',
			Unauthorized: 'Unauthorized',
			EnterAttributes: 'Enter nets-id, api-key and base-url-atttibutes'
		}
	};

}
