import FloatingLabelBaseStyle from "../framework/Constants/FloatingLabelBaseStyle";
import '../framework/Utilities/DomManipulationExtensionMethods';
import CustomHTMLBaseElement from "./CustomHTMLBaseElement";

export default abstract class FloatingLabelElement extends CustomHTMLBaseElement {
	private baseStyle: HTMLStyleElement;
	protected innerElement: HTMLElement;
	protected errorElement: HTMLSpanElement;
	protected labelElement: HTMLLabelElement;
	protected postfixElement: HTMLElement;
	protected customStyle: HTMLStyleElement;
	protected required: boolean;

	protected change = new Event('change');

	constructor() {
		super();
		this.baseStyle = document.createElement('style');
		this.baseStyle.innerHTML = FloatingLabelBaseStyle.style;
	}

	abstract get value(): any;
	abstract set value(val);
	abstract get valid(): boolean;

	componentDidMount() {
		this.errorElement = this.getChildElement('#error-message');
		this.innerElement = this.getChildElement('#inner-element');
		this.labelElement = this.getChildElement('#inner-label');
		this.postfixElement = this.getChildElement('#postfix-icon');
		this.customStyle = this.querySelector('style');

		this.applyCustomStyle(this.baseStyle);
		this.applyCustomStyle(this.customStyle);

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.checkHasValue();
		this.innerElement.addEventListener('focusout', (event: FocusEvent) => {
			this.checkHasValue();
		});

		this.renderPostfixIcon();
	}

	protected checkHasValue() {
		if (this.value && this.value.length > 0) {
			this.innerElement.classList.add('has-value');
		} else {
			this.innerElement.classList.remove('has-value');
		}
	}

	public validate(): void {
		if (!this.valid) {
			this.setAttribute('invalid', 'true');
		} else {
			this.removeAttribute('invalid');
		}
	}

	renderPostfixIcon() {
		const postfix = this.querySelector('[slot="postfix"]') as HTMLElement;
		if (postfix) {
			this.postfixElement.fillContent(postfix);
		}
	}

	protected static baseObservedAttributes(): string[] {
		return ['invalid', 'error', 'label'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}


	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'invalid':
				if (!this.innerElement) {
					break;
				}
				if (newVal === 'true') {
					this.innerElement.classList.add('invalid');
					this.innerElement.classList.add('nudge');
					setTimeout(() => {
						this.innerElement.classList.remove('nudge');
					}, 2000);
				} else {
					this.innerElement.classList.remove('invalid');
					this.innerElement.classList.remove('nudge');
				}
				break;
			case 'error':
				if (!this.errorElement) {
					break;
				}
				this.errorElement.innerHTML = newVal;
				break;
			case 'label':
				if (!this.labelElement) {
					break;
				}
				this.labelElement.innerHTML = newVal;
				break;
		}
	}

}
