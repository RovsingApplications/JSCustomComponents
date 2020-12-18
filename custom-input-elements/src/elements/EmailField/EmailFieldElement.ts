import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';

@CustomElement({
	selector: 'email-element',
	template: `
			<div class="wrapper">
				<input type="text" id='email-field'/>
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
export class EmailFieldElement extends CustomInputElement {
	mailRegex: RegExp = new RegExp(
		/^([a-zA-Z0-9ÆØÅæøå_.+-])+\@(([a-zA-Z0-9ÆØÅæøå-])+\.)+([a-zA-Z0-9ÆØÅæøå]{2,4})+$/,
	);

	email: HTMLInputElement;

	constructor() {
		super();
	}

	get value(): string {
		return `${this.email.value}`;
	}

	set value(value: string) {
		this.email.value = value;
	}

	get valid(): boolean {
		const patternValid = !this.value || this.mailRegex.test(this.value);
		return this.email.validity.valid && patternValid;
	}

	connectedCallback(): void {
		this.initChildInputs();
		super.connectedCallback();
	}

	initChildInputs() {
		this.email = super.getChildInput('#email-field');
		this.email.addEventListener('change', this.change.bind(this));
		if (this.required) {
			this.email.setAttribute('required', '');
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
