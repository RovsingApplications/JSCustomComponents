import CustomElement from "../../framework/custom-element.decorator";
import FloatingLabelBaseElement from '../FloatingLabelBaseElement';
import { CvrValidator, EmailValidator } from '../../framework/Validations/Validators/Validators';
import { infoSVG } from '../../framework/Constants/svgs';

@CustomElement({
	selector: 'floating-label-input',
	template: `
		<span id="item-group">
			<input id="inner-element" />
			<label for="inner-element" id="inner-label"></label>
			<span id="postfix-icon"></span>
			<span id="error-message"></span>
		</span>
	`,
	style: `
		#postfix-icon {
			position: absolute;
			top: 1px;
			max-width: 15px;
			max-height: 15px;
			right: 10px;
		}
	`,
	useShadow: true,
})
export default class FloatingLabelInputElement extends FloatingLabelBaseElement {
	private inputElement: HTMLInputElement;
	private validator: string;
	private isNumberInput: boolean;

	constructor() {
		super();
	}

	get value(): any {
		return this.inputElement.value;
	}
	set value(val: any) {
		this.inputElement.value = val;
		this.checkHasValue();
	}
	get valid(): boolean {
		const allowEmpty = !this.inputElement.required;
		switch (this.validator) {
			case 'cvr':
				return new CvrValidator().isSatisfiedBy(this.value, allowEmpty);
			case 'email':
				return new EmailValidator().isSatisfiedBy(this.value, allowEmpty);
			default:
				if (!allowEmpty) {
					return this.value && this.value.trim().length > 0;
				}
				break;
		}
	}

	componentDidMount() {
		this.inputElement = this.getChildElement('#inner-element');
		this.bindEvents();
		super.componentDidMount();
	}

	private bindEvents() {
		this.inputElement.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
	}

	private allowNumbersOnly(allow = true) {
		if (!allow) {
			this.inputElement.onkeydown = null;
			return;
		}
		this.inputElement.onkeydown = event => {
			const isControlKey = event.key.length > 1;
			const isNumber = event.key.match('[0-9]') !== null;
			if (!isControlKey && event.ctrlKey === false) {
				if (!isNumber) {
					event.preventDefault();
				}
			}
		};
	}

	private static get observedAttributes() {
		const arrtibutes = [
			...FloatingLabelBaseElement.baseObservedAttributes(),
			'validator', 'required', 'number-input', 'value', 'name'
		];
		return arrtibutes;
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		super.attributeChanged(name, oldVal, newVal);
		if (!this.inputElement) {
			return;
		}
		switch (name) {
			case 'validator':
				this.validator = newVal;
				break;
			case 'required':
				if (newVal === 'true') {
					this.inputElement.required = true;
					break;
				}
				this.inputElement.required = false;
				break;
			case 'number-input':
				if (newVal === 'true') {
					this.isNumberInput = true;
				} else {
					this.isNumberInput = false;
				}
				this.allowNumbersOnly(this.isNumberInput);
				break;
			case 'value':
				this.inputElement.value = newVal;
				break;
			case 'name':
				this.inputElement.name = newVal;
				break;
		}
	}
}
