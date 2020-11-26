import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';

@CustomElement({
	selector: 'text-element',
	template: `
			<div class="wrapper">
				<input type="text" id='text-field'/>
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
export class TextFieldElement extends CustomInputElement {
	text: HTMLInputElement;

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
		return this.text.validity.valid;
	}

	connectedCallback(): void {
		super.connectedCallback();
	}

	initChildInputs() {
		this.text = super.getChildInput('#text-field');
		this.text.addEventListener('change', this.change.bind(this));
		if (this.required) {
			this.text.setAttribute('required', '');
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
