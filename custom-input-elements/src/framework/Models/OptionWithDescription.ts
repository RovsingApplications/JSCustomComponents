export default class OptionWithDescription {
	title: string;
	value: string;
	description: string;

	constructor(option: Partial<OptionWithDescription>) {
		Object.assign(this, option);
	}
}