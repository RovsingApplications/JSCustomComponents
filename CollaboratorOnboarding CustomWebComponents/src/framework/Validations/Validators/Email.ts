import IValidation from '../IValidator';

export default class EmailValidator implements IValidation {

	mailRegex: RegExp = new RegExp(
		/^([a-zA-Z0-9ÆØÅæøå_.+-])+\@(([a-zA-Z0-9ÆØÅæøå-])+\.)+([a-zA-Z0-9ÆØÅæøå]{2,4})+$/,
	);

	isSatisfiedBy(input: string, allowEmpty: boolean = true): boolean {
		if (!input || input.trim() === '') {
			return allowEmpty;
		}
		const patternValid = this.mailRegex.test(input);
		return patternValid;
	}
}
