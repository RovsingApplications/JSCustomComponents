import ChildCompanyCredentials from "../Models/ChildCompanyCredentials";
import ChildCompany from "../Models/ChildCompany";

export default class ChildCompanyTranslations {

	public static ToChildCompanyCredentials(childCompany: ChildCompany) {
		const childCompanyCredentials = new ChildCompanyCredentials({
			name: childCompany.senderName,
			apiKey: childCompany.apiKey,
			creatorId: childCompany.creatorId,
			email: childCompany.email,
			customerNumber: childCompany.customerNumber
		});

		return childCompanyCredentials;
	}
}
