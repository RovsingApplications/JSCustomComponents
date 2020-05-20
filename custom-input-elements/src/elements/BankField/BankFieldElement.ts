import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import BankAccountValidator from '../../framework/Validation/Validators/BankAccount';
import BankAccountRegistrationNumberValidator from '../../framework/Validation/Validators/BankAccountRegistrationNumber';

@CustomElement({
    selector: 'bank-element',
    template: `
			<div class="wrapper">
				<input type="text" id='account-field' placeholder='Bank Account'/>
				<input type="text" id='reg-number-field' placeholder='Bank Account Registration Number'/>
			</div>`,
    style: `
    :host{
            width:100%;
    }
    .wrapper{
            display:flex;
    }
    input{
            box-sizing: border-box;
            width: 100% !important;
            border: none;
            background-color: #f1f4ff;
            margin: 2px;
            resize: none;
    }
           `,
    useShadow: true,
})
export class BankFieldElement extends CustomInputElement {
    account: HTMLInputElement;
    regNumber: HTMLInputElement;
    bankAccountValidator: BankAccountValidator = new BankAccountValidator();
    regNumberValidator: BankAccountRegistrationNumberValidator = new BankAccountRegistrationNumberValidator();

    constructor() {
        super();
    }

    get value(): string {
        let account = this.account.value || '';
        let regNumber = this.regNumber.value ? `,${this.regNumber.value}` : '';
        return `${account}${regNumber}`;
    }

    set value(value: string) {
        const values = value.split(',');
        this.account.value = values[0];
        this.regNumber.value = values[1];
    }

    get valid(): boolean {
        return (
            this.bankAccountValidator.isSatisfiedBy(
                this.account.value,
                !this.required,
            ) &&
            this.regNumberValidator.isSatisfiedBy(
                this.regNumber.value,
                !this.required,
            )
        );
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    initChildInputs() {
        this.account = super.getChildInput('#account-field');
        this.regNumber = super.getChildInput('#reg-number-field');
        this.account.addEventListener('change', this.change.bind(this));
        this.regNumber.addEventListener('change', this.change.bind(this));
        if (this.required) {
            this.account.setAttribute('required', '');
            this.regNumber.setAttribute('required', '');
        }
    }

    // events
    public change($event): void {
        this.touched = true;
        this.onChange.emit(new CustomElementEventArgs(this.value, 'change'));
    }

    public validate(): void {
        this.valid;
        this.onValidate.emit(
            new CustomElementEventArgs(this.value, 'validate'),
        );
    }
}
