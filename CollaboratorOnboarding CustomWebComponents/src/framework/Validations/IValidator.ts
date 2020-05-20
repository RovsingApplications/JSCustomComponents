export default interface IValidator {
	isSatisfiedBy(input: string, allowEmpty: boolean): boolean;
}
