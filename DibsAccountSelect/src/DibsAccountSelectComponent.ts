import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import Globals from "./Framework/Globals/Globals";
import ElementsCreator from "./Framework/Utilities/ElementsCreator";
import DomUtility from "./Framework/Utilities/DomUtility";
import DibsAccountsService from "./Framework/Services/DibsAccountsService";
import AccountNameAndId from "./Framework/Models/AccountNameAndId";
import AccountNamesSelectElement from "./Elements/AccountNamesSelectElement";
import Translator from "./Framework/Language/Translator";


@CustomElement({
	selector: 'esignatur-dibs-account-select',
	template: `
		<div class="dibs-account-select-wrapper">
				
		</div>
	`,
	style: `
		.dibs-account-select-wrapper {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 35px;
		}
		.dibs-account-select-wrapper div {
			flex-grow: 1;
		}
	`,
	useShadow: true,
})
export default class DibsAccountSelectComponent extends CustomHTMLBaseElement {

	private accountSelectWrapper: HTMLElement;
	private customStyle: HTMLStyleElement;
	private accountsSelectElement: AccountNamesSelectElement;

	private _accountsSelectInvalidAttribute: string;
	private _accountsSelectErrorAttribute: string;
	private _accountsSelectLabelAttribute: string;
	private _accountsSelectRequiredAttribute: string;
	private change = new Event('change');
	private _tempValue: string;

	constructor() {
		super();
	}

	get value() {
		if (!this.accountsSelectElement) {
			return null;
		}
		return this.accountsSelectElement.value;
	}

	set value(val: string) {
		this._tempValue = val;
		if (!this.accountsSelectElement) {
			return;
		}
		this.accountsSelectElement.value = val;
	}

	get accountsSelectInvalidAttribute() {
		return this._accountsSelectInvalidAttribute;
	}
	set accountsSelectInvalidAttribute(val: string) {
		this._accountsSelectInvalidAttribute = val;
		if (!this.accountsSelectElement) {
			return;
		}
		this.accountsSelectElement.setAttribute('invalid', this.accountsSelectInvalidAttribute);
	}
	get accountsSelectErrorAttribute() {
		return this._accountsSelectErrorAttribute;
	}
	set accountsSelectErrorAttribute(val: string) {
		this._accountsSelectErrorAttribute = val;
		if (!this.accountsSelectElement) {
			return;
		}
		this.accountsSelectElement.setAttribute('error', this.accountsSelectErrorAttribute);
	}
	get accountsSelectLabelAttribute() {
		return this._accountsSelectLabelAttribute;
	}
	set accountsSelectLabelAttribute(val: string) {
		this._accountsSelectLabelAttribute = val;
		if (!this.accountsSelectElement) {
			return;
		}
		this.accountsSelectElement.setAttribute('label', this.accountsSelectLabelAttribute);
	}
	get accountsSelectRequiredAttribute() {
		return this._accountsSelectRequiredAttribute;
	}
	set accountsSelectRequiredAttribute(val: string) {
		this._accountsSelectRequiredAttribute = val;
		if (!this.accountsSelectElement) {
			return;
		}
		this.accountsSelectElement.setAttribute('required', this.accountsSelectRequiredAttribute);
	}

	componentDidMount() {
		this.accountSelectWrapper = this.getChildElement('.dibs-account-select-wrapper');
		this.customStyle = this.querySelector('style');

		this.applyCustomStyle(this.customStyle);

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.initComponent();
	}

	private initComponent() {
		if (this.hasMissingAttributes()) {
			this.displayFillAttributesError();
		}
		const loadingOverlay = ElementsCreator.generateOverlayWithSpinner(25);
		this.accountSelectWrapper.appendChild(loadingOverlay);

		new DibsAccountsService().getAccountNames().then(res => {
			loadingOverlay.remove();
			const accounts: AccountNameAndId[] = JSON.parse(res as string);
			this.accountsSelectElement = new AccountNamesSelectElement();
			this.accountsSelectElement.style.flexGrow = '1';
			this.accountsSelectElement.style.width = '100%';
			DomUtility.fillContent(this.accountSelectWrapper, this.accountsSelectElement);
			this.accountsSelectElement.addEventListener('change', () => {
				this.dispatchEvent(this.change);
			});
			this.setAccountSelectAttributes();
			this.accountsSelectElement.initComponent(accounts);
			if (this._tempValue) {
				this.accountsSelectElement.value = this._tempValue;
				this._tempValue = null;
			}
		})
			.catch(ex => {
				console.error(ex);
				loadingOverlay.remove();
				let errorMessage = `${Translator.translate('Errors.SomethingWentWrong')}!`;
				if (ex.status === 404) {
					errorMessage = `${Translator.translate('Errors.PaymentAccountNotFound')}!`;
				}
				if (ex.status === 401) {
					errorMessage = `${Translator.translate('Errors.InvalidCredentials')}!`;
				}
				if (ex.status === 403) {
					errorMessage = `${Translator.translate('Errors.Unauthorized')}!`;
				}
				const errorBlock = ElementsCreator.generateErrorBlock(errorMessage);
				DomUtility.fillContent(this.accountSelectWrapper, errorBlock);
			});
	}

	private hasMissingAttributes() {
		return !Globals.apiKey ||
			!Globals.baseUrl ||
			!Globals.netsId;
	}

	private displayFillAttributesError() {
		const errorMessage = Translator.translate('Errors.EnterAttributes');
		const errorBlock = ElementsCreator.generateErrorBlock(errorMessage);
		DomUtility.fillContent(this.accountSelectWrapper, errorBlock);
	}

	setAccountSelectAttributes() {
		if (this.accountsSelectInvalidAttribute) {
			this.accountsSelectInvalidAttribute = this.accountsSelectInvalidAttribute;
		}
		if (this.accountsSelectErrorAttribute) {
			this.accountsSelectErrorAttribute = this.accountsSelectErrorAttribute;
		}
		if (this.accountsSelectLabelAttribute) {
			this.accountsSelectLabelAttribute = this.accountsSelectLabelAttribute;
		}
		if (this.accountsSelectRequiredAttribute) {
			this.accountsSelectRequiredAttribute = this.accountsSelectRequiredAttribute;
		}
	}

	private static get observedAttributes() {
		return ['nets-id', 'api-key', 'base-url', 'language', 'invalid', 'error', 'label', 'required', 'value'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'nets-id':
				Globals.netsId = newVal;
				break;
			case 'api-key':
				Globals.apiKey = newVal;
				break;
			case 'base-url':
				Globals.baseUrl = newVal;
				if (Globals.baseUrl[Globals.baseUrl.length - 1] !== '/') {
					Globals.baseUrl = `${Globals.baseUrl}/`;
				}
				break;
			case 'language':
				Globals.language = newVal;
				break;
			case 'invalid':
				this.accountsSelectInvalidAttribute = newVal;
				break;
			case 'error':
				this.accountsSelectErrorAttribute = newVal;
				break;
			case 'label':
				this.accountsSelectLabelAttribute = newVal;
				break;
			case 'required':
				this.accountsSelectRequiredAttribute = newVal;
				break;
			case 'value':
				this.value = newVal;
				break;
		}
	}
}