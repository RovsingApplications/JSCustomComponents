import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import { StringUtil } from '@luftborn/utilities';

@CustomElement({
	selector: 'checkbox-element',
	template: `
			<div class="wrapper">
               
			</div>`,
	style: `
            :host{
                width:100%;
            }
            .wrapper{
                display:flex;
                justify-content: center;
                flex-wrap:wrap;
            }
            .checkbox {
                width: auto;
                margin: auto 3px;
                display: flex;
                flex-grow: 0.1;
                justify-content: space-around;
            }
            input[type='checkbox']{
                box-sizing: border-box;
                width: auto !important;
                border: none;
                background-color: #f1f4ff;
                margin: 2px;
                resize: none;
            }
           `,
	useShadow: true,
})
export class CheckBoxElement extends CustomInputElement {
	checkbox: HTMLInputElement[];
	checkboxTemplate = `
    <div class='checkbox'>
        <label for="{2}">{1}</label>
        <input type='checkbox' name='{0}' value="{1}" id="{2}"/>
    </div>`;

	constructor() {
		super();
	}

	get value(): string[] {
		return this.checkbox.filter(c => c.checked).map(c => c.value);
	}

	set value(values: string[]) {
		// this.checkbox.value = value;
	}

	get valid(): boolean {
		if (this.required) {
			return this.value.length > 0;
		} else {
			return true;
		}
	}

	connectedCallback(): void {
		super.connectedCallback();
	}

	initChildInputs() {
		this.addCheckBoxes();
		this.checkbox = super.getChildInputs(`[name=${this.name}]`);
		this.checkbox.forEach(c =>
			c.addEventListener('change', this.change.bind(this)),
		);
	}

	private addCheckBoxes() {
		const wrapper = super.getChildElement('.wrapper');
		this.options.forEach((element, index) => {
			wrapper.insertAdjacentHTML(
				'beforeend',
				StringUtil.StringFormat(
					this.checkboxTemplate,
					this.name,
					element,
					`${this.name}-${index}`,
				),
			);
		});
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
