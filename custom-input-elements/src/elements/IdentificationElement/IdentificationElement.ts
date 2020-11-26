import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import CprValidator from '../../framework/Validation/Validators/CPR';
import IValidator from '../../framework/Validation/IValidator.interface';
import CvrValidator from '../../framework/Validation/Validators/CVR';
import BankIdSwedenValidator from '../../framework/Validation/Validators/BankIdSweden';
import BankIdNorwayValidator from '../../framework/Validation/Validators/BankIdNorway';

@CustomElement({
	selector: 'id-element',
	template: `
			<div class="wrapper">
                <select id='id-type'>
                    <option value='cvr'>Danish CVR</option>
                    <option value='cpr'>Danish CPR</option>
                    <option value='swe'>Sweden Bank Id</option>
                    <option value='nor'>Norway Bank Id</option>
                </select>
				<input type="text" id='id-field' placeholder=''/>
			</div>`,
	style: `
    :host{
            width:100%;
    }
    .wrapper{
            display:flex;
    }
    input, select{
            box-sizing: border-box;
            border: none;
            background-color: #f1f4ff;
            margin: 2px;
            resize: none;
    }
    input{
            width: 75% !important;
    }
    select{
            width: 25% !important;
    }
           `,
	useShadow: true,
})
export class IdentificationElement extends CustomInputElement {
	typeSelector: HTMLInputElement;
	text: HTMLInputElement;

	type: string;
	validators: { [index: string]: IValidator } = {
		cpr: new CprValidator(),
		cvr: new CvrValidator(),
		swe: new BankIdSwedenValidator(),
		nor: new BankIdNorwayValidator(),
	};

	constructor() {
		super();
	}

	get value(): string {
		return `${this.text.value}`;
	}

	set value(value: string) {
		this.text.value = value;
	}

	get valid(): boolean {
		return this.validators[this.type].isSatisfiedBy(
			this.value,
			!this.required,
		);
	}

	connectedCallback(): void {
		super.connectedCallback();
	}

	initChildInputs() {
		this.text = super.getChildInput('#id-field');
		this.typeSelector = super.getChildInput('#id-type');
		this.text.addEventListener('change', this.change.bind(this));
		this.typeSelector.addEventListener('change', this.change.bind(this));
		if (this.required) {
			this.text.setAttribute('required', '');
		}
		this.type = this.typeSelector.value;
	}

	// events
	public change($event): void {
		this.touched = true;
		this.type = this.typeSelector.value;
		this.onChange.emit(new CustomElementEventArgs(this.value, 'change'));
	}

	public validate(): void {
		this.valid;
		this.onValidate.emit(
			new CustomElementEventArgs(this.value, 'validate'),
		);
	}
}
