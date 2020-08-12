import CustomElement from "../../framework/custom-element.decorator";
import FloatingLabelBaseElement from './FloatingLabelBaseElement';

@CustomElement({
	selector: 'esignatur-branding-admin-floating-label-input',
	template: `
		<span id="item-group">
			<input id="inner-element" />
			<label for="inner-element" id="inner-label"></label>
			<span id="postfix-icon"></span>
			<span id="error-message"></span>
		</span>
	`,
	style: `
	`,
	useShadow: true,
})
export default class FloatingLabelInputElement extends FloatingLabelBaseElement {
	private inputElement: HTMLInputElement;
	private isNumberInput: boolean;
	private postfixclicked = new Event('postfixclicked');
	private inputenter = new Event('inputenter');
	private input = new Event('input');

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
		if (!allowEmpty) {
			return this.value && this.value.trim().length > 0;
		}
	}

	componentDidMount() {
		this.inputElement = this.getChildElement('#inner-element');
		super.componentDidMount();
		this.bindEvents();
	}

	private bindEvents() {
		this.inputElement.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
		if (this.postfixElement) {
			this.postfixElement.addEventListener('click', () => {
				this.dispatchEvent(this.postfixclicked);
			});
		}
		this.inputElement.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				this.dispatchEvent(this.inputenter);
			}
		});
		this.inputElement.addEventListener('input', (event) => {
			this.dispatchEvent(this.input);
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
			'required', 'number-input', 'value', 'name'
		];
		return arrtibutes;
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		super.attributeChanged(name, oldVal, newVal);
		if (!this.inputElement) {
			return;
		}
		switch (name) {
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
