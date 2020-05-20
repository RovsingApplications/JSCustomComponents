import ChildCompany from './ChildCompany';

export default class ChildCompaniesAndCount {
	childCompanies: ChildCompany[];
	allChildCompaniesCount: number;

	constructor(initialValue: Partial<ChildCompany>) {
		Object.assign(this, initialValue);
	}
}
