export default class AccountNameAndId {
	id: string;
	name: string;


	constructor(accountNameAndId: Partial<AccountNameAndId>) {
		Object.assign(this, accountNameAndId);
	}
}