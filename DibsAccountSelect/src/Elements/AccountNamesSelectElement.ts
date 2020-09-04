import CustomElement from "../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./CustomHTMLBaseElement";
import DomUtility from "../Framework/Utilities/DomUtility";
import AccountNameAndId from "../Framework/Models/AccountNameAndId";
import Translator from "../Framework/Language/Translator";


@CustomElement({
	selector: 'dibs-account-select-names-select',
	template: `
		<div class="account-select-wrapper">
			<select class="account-select-native-input"></select>
			<label class="account-select-label"></label>
			<span class="account-select-error-message"></span>
		</div>
	`,
	style: `
		.account-select-wrapper {
			position: relative;
		}
		.account-select-native-input {
			width: 100%;
			height: 35px;
			font-size: 13px;
			font-family: Roboto,Helvetica Neue,sans-serif;
			border: 1px solid #d8d8d8;
			border-radius: 3px;
			background-color: transparent;
			color: #222222;
			box-sizing: border-box;
			padding: 5px 10px;
			transition: all .1s ease-out;
		}

		.account-select-label {
			z-index: 3;
			position: absolute;
			color: #777777;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: fit-content;
			top: -6px;
			left: 5px;
			padding: 0 8px;
			font-size: 11px;
			height: 12px;
			background-color: white;
			font-family: Hind,sans-serif;
		}

		.account-select-native-input:focus {
			border: 1px solid #315c78;
			outline: none;
		}

		.account-select-error-message {
			display: none;
			transition: all .1s ease-out;
		}
		.account-select-native-input.invalid ~ .account-select-error-message {
			display: block;
			font-family: Hind,sans-serif;
			font-weight: 700;
			position: absolute;
			top: 29px;
			left: 0;
			font-size: 9px;
			margin-left: 5px;
			z-index: 3;
			background: #fff;
			padding: 0 8px;
			letter-spacing: .05em;
			color: #b00020;
		}
	`,
	useShadow: false,
})
export default class AccountNamesSelectElement extends CustomHTMLBaseElement {

	private nativeSelectInput: HTMLSelectElement;
	private labelElement: HTMLElement;
	private errorElement: HTMLElement;
	private customStyle: HTMLStyleElement;
	private change = new Event('change');

	constructor() {
		super();
	}

	get value() {
		if (!this.nativeSelectInput) {
			return null;
		}
		return this.nativeSelectInput.value;
	}

	set value(val: string) {
		if (!this.nativeSelectInput) {
			return;
		}
		this.nativeSelectInput.value = val;
	}

	componentDidMount() {
		this.nativeSelectInput = this.getChildElement('.account-select-native-input');
		this.labelElement = this.getChildElement('.account-select-label');
		this.errorElement = this.getChildElement('.account-select-error-message');

		this.customStyle = this.querySelector('style');
		this.applyCustomStyle(this.customStyle);

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.nativeSelectInput.onchange = () => {
			this.dispatchEvent(this.change);
		};
	}

	initComponent(accounts: AccountNameAndId[]) {
		DomUtility.removeAllChildren(this.nativeSelectInput);
		if (accounts.length === 0) {
			const option = document.createElement('option');
			option.disabled = true;
			option.innerHTML = `${Translator.translate('NoAccounts')!}`;
			this.nativeSelectInput.appendChild(option);
			return;
		}
		if (accounts.length > 1) {
			const option = document.createElement('option');
			option.disabled = true;
			option.selected = true;
			option.value = null;
			option.innerHTML = Translator.translate('SelectAccount');
			this.nativeSelectInput.appendChild(option);
		}
		accounts.forEach(account => {
			const option = document.createElement('option');
			option.value = account.id;
			option.innerHTML = account.name;
			this.nativeSelectInput.appendChild(option);
		});
	}




	private static get observedAttributes() {
		return ['invalid', 'error', 'label', 'required'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'required':
				if (!this.nativeSelectInput) {
					break;
				}
				if (newVal === 'true') {
					this.nativeSelectInput.required = true;
					break;
				}
				this.nativeSelectInput.required = false;
				break;
			case 'invalid':
				if (!this.nativeSelectInput) {
					break;
				}
				if (newVal === 'true') {
					this.nativeSelectInput.classList.add('invalid');
				} else {
					this.nativeSelectInput.classList.remove('invalid');
				}
				break;
			case 'label':
				if (!this.labelElement) {
					break;
				}
				this.labelElement.innerHTML = newVal;
				break;
			case 'error':
				if (!this.errorElement) {
					break;
				}
				this.errorElement.innerHTML = newVal;
				break;
		}
	}
}