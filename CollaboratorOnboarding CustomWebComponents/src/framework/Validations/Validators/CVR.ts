import IValidation from '../IValidator';

export default class CvrValidator implements IValidation {
	isSatisfiedBy(input: string, allowEmpty: boolean = true): boolean {
		return this.checkCvr(input, allowEmpty);
	}

	private checkCvr(input: string, allowEmpty: boolean = true): boolean {
		if (!allowEmpty && !input) {
			return false;
		}
		const cvrnr: string = input.replace(' ', '').replace('-', '');
		if (!cvrnr) {
			return allowEmpty;
		}
		if (!/^\d{8}$/.test(cvrnr)) {
			return false;
		}

		// cvr numre kan åbenbart også modulus11 testes.
		let total: number = 0;

		[2, 7, 6, 5, 4, 3, 2, 1].forEach((elm, index) => {
			total += parseInt(cvrnr[index], 10) * elm;
		});

		return total % 11 === 0;
	}
}
