import IValidation from '../IValidator.interface';

export default class BankAccountRegistrationNumberValidator
    implements IValidation {
    isSatisfiedBy(input: string, allowEmpty: boolean = true): boolean {
        return true;
    }
}
