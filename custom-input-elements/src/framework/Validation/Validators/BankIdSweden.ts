import IValidation from '../IValidator.interface';

export default class BankIdSwedenValidator implements IValidation {
    isSatisfiedBy(input: string, allowEmpty: boolean = true): boolean {
        return this.checkSePersonnummer(input, allowEmpty);
    }

    private checkSePersonnummer(
        input: string,
        allowEmpty: boolean = true,
    ): boolean {
        if (!input) {
            return allowEmpty;
        }
        const personnummer: string = input.replace(' ', '').replace('-', '');
        const regex: RegExp = new RegExp(
            /^(19\d{2}|20\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(\d{4})$/,
        );
        return regex.test(personnummer);
    }
}
