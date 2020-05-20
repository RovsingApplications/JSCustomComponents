import IValidation from '../IValidator.interface';

export default class BankIdNorwayValidator implements IValidation {
    isSatisfiedBy(input: string, allowEmpty: boolean = true): boolean {
        return this.checkNoPersonnummer(input, allowEmpty);
    }

    private checkNoPersonnummer(
        input: string,
        allowEmpty: boolean = true,
    ): boolean {
        if (!input) {
            return allowEmpty;
        }
        const personnummer: string = input.replace(' ', '').replace('-', '');
        const regex: RegExp = new RegExp(
            /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])(0[1-9]|1[0-2])(\d{2})(\d{5})$/,
        );
        return regex.test(personnummer);
    }
}
