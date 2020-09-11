import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import CustomerPaymentAccount from "../../Framework/Models/CustomerPaymentAccount";
import SVGs from "../../Framework/Constants/SVGs";
import Colors from "../../Framework/Constants/Colors";
import FloatingLabelInputElement from "../FloatingLabel/FloatingLabelInputElement";
import Globals from "../../Framework/Globals/Globals";


@CustomElement({
	selector: 'esignatur-dibs-user-credentials-single-credentials',
	template: `
		<div class="single-credentials-wrapper">
			<div class="single-credentials-items-wrapper">
				<div class="single-credentials-item-wrapper">
					<esignatur-dibs-user-credentials-floating-label-input
						id="name-field"
						required="true"
						label="kontonavn*" 
						error="Du skal indtaste et gyldigt kontonavn"
					>
					</esignatur-dibs-user-credentials-floating-label-input>
				</div>
				<div class="single-credentials-item-wrapper">
					<esignatur-dibs-user-credentials-floating-label-input
						id="merchant-id-field"
						required="true"
						label="Merchant ID*" 
						error="Du skal indtaste et gyldigt Merchant ID"
					>
					</esignatur-dibs-user-credentials-floating-label-input>
				</div>

				<div class="single-credentials-item-wrapper">
					<esignatur-dibs-user-credentials-floating-label-input
						id="secret-key-field"
						required="true"
						label="Hemmelig nøgle*" 
						error="Du skal indtaste et gyldigt Hemmelig nøgle"
					>
					</esignatur-dibs-user-credentials-floating-label-input>
				</div>

				<div class="single-credentials-item-wrapper">
					<esignatur-dibs-user-credentials-floating-label-input
						id="checkout-key-field"
						required="true"
						label="Checkout nøgle*" 
						error="Du skal indtaste et gyldigt Checkout nøgle"
					>
					</esignatur-dibs-user-credentials-floating-label-input>
				</div>
			</div>
			<div class="single-credentials-actions-wrapper">
				<button class="edit-button">${SVGs.editPenCrossedSVG}</button>
				<button class="delete-button">${SVGs.trashSVG}</button>
			</div>
		</div>
	`,
	style: `
		.single-credentials-wrapper {
			display: flex;
			transition: max-height .3s ease-in;
			-moz-transition: max-height .3s ease-in;
			overflow: hidden;
		}
		.single-credentials-items-wrapper {
			flex-grow: 1;
		}
		.single-credentials-item-wrapper {
			margin: 10px 0;
		}
		.single-credentials-actions-wrapper {
			display: flex;
			flex-direction: column;
			flex-grow: 0 !important;
			justify-content: center;
			padding: 15px 0 15px 15px;
		}
		.single-credentials-actions-wrapper button {
			margin: 10px 0;
			padding: 8px;
			cursor: pointer;
			border-radius: 5px;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			outline: none;
		}
		.single-credentials-actions-wrapper button svg {
			width: 15px;
			height: 15px;
		}
		.single-credentials-actions-wrapper button svg path {
			fill: ${Colors.secondary};
		}
		.single-credentials-actions-wrapper button:hover svg path {
			fill: ${Colors.primary};
		}
	`,
	useShadow: true,
})
export default class SingleCredentialsElement extends CustomHTMLBaseElement {

	private paymentAccountId: string;
	private singleCredentialsWrapper: HTMLElement;
	private singleCredentialsActionsWrapper: HTMLElement;
	private nameElement: FloatingLabelInputElement;
	private merchantIdElement: FloatingLabelInputElement;
	private secretKeyElement: FloatingLabelInputElement;
	private checkoutKeyElement: FloatingLabelInputElement;
	private editButton: HTMLElement;
	private deleteButton: HTMLElement;
	private _disabled: boolean;
	private delete = new Event('delete');

	get disabled() {
		return this._disabled;
	}

	set disabled(val: boolean) {
		if (val) {
			this.disableInputFields();
		} else {
			this.enableInputFields();
		}
		this._disabled = val;
	}

	private get name() {
		if (!this.nameElement) {
			return;
		}
		return this.nameElement.value.trim();
	}
	private set name(val: string) {
		if (!this.nameElement) {
			return;
		}
		this.nameElement.value = val;
	}
	private get merchantId() {
		if (!this.merchantIdElement) {
			return
		}
		return this.merchantIdElement.value.trim();
	}
	private set merchantId(val: string) {
		if (!this.merchantIdElement) {
			return
		}
		this.merchantIdElement.value = val;
	}
	private get checkoutKey() {
		if (!this.checkoutKeyElement) {
			return
		}
		return this.checkoutKeyElement.value.trim();
	}
	private set checkoutKey(val: string) {
		if (!this.checkoutKeyElement) {
			return
		}
		this.checkoutKeyElement.value = val;
	}
	private get secretKey() {
		if (!this.secretKeyElement) {
			return
		}
		return this.secretKeyElement.value.trim();
	}
	private set secretKey(val: string) {
		if (!this.secretKeyElement) {
			return
		}
		this.secretKeyElement.value = val;
	}
	get customerPaymentAccount() {
		return new CustomerPaymentAccount({
			id: this.paymentAccountId,
			name: this.name,
			merchantId: this.merchantId,
			checkoutKey: this.checkoutKey,
			secretKey: this.secretKey
		});
	}
	set customerPaymentAccount(val: CustomerPaymentAccount) {
		this.paymentAccountId = val.id;
		this.name = val.name;
		this.merchantId = val.merchantId;
		this.checkoutKey = val.checkoutKey;
		this.secretKey = val.secretKey;
	}

	get valid() {
		return this.nameElement.valid &&
			this.merchantIdElement.valid &&
			this.secretKeyElement.valid &&
			this.checkoutKeyElement.valid;
	}

	constructor() {
		super();
	}

	componentDidMount() {
		this.singleCredentialsWrapper = this.getChildElement('.single-credentials-wrapper');
		this.nameElement = this.getChildElement('#name-field');
		this.merchantIdElement = this.getChildElement('#merchant-id-field');
		this.secretKeyElement = this.getChildElement('#secret-key-field');
		this.checkoutKeyElement = this.getChildElement('#checkout-key-field');
		this.editButton = this.getChildElement('.edit-button');
		this.deleteButton = this.getChildElement('.delete-button');
		this.singleCredentialsActionsWrapper = this.getChildElement('.single-credentials-actions-wrapper');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		if (!Globals.isAdmin) {
			this.singleCredentialsActionsWrapper.style.display = 'none';
		}

		this.bindEvents();
	}

	private bindEvents() {
		this.editButton.onclick = (event: Event) => {
			event.preventDefault();
			this.disabled = !this.disabled;
		};
		this.deleteButton.onclick = (event: Event) => {
			event.preventDefault();
			this.singleCredentialsWrapper.style.maxHeight = `${this.singleCredentialsWrapper.scrollHeight}px`;
			setTimeout(() => {
				this.singleCredentialsWrapper.style.maxHeight = '0';
			}, 10);
			setTimeout(() => {
				this.dispatchEvent(this.delete);
			}, 310);
		};
		this.nameElement.onblur = () => {
			this.nameElement.validate();
		};
		this.merchantIdElement.onblur = () => {
			this.merchantIdElement.validate();
		};
		this.secretKeyElement.onblur = () => {
			this.secretKeyElement.validate();
		};
		this.checkoutKeyElement.onblur = () => {
			this.checkoutKeyElement.validate();
		};
	}


	validate() {
		this.nameElement.validate();
		this.merchantIdElement.validate();
		this.secretKeyElement.validate();
		this.checkoutKeyElement.validate();
	}

	private disableInputFields() {
		this.nameElement.disabled = true;
		this.merchantIdElement.disabled = true;
		this.secretKeyElement.disabled = true;
		this.checkoutKeyElement.disabled = true;
		this.editButton.innerHTML = SVGs.editPenSVG;
	}
	private enableInputFields() {
		this.nameElement.disabled = false;
		this.merchantIdElement.disabled = false;
		this.secretKeyElement.disabled = false;
		this.checkoutKeyElement.disabled = false;
		this.editButton.innerHTML = SVGs.editPenCrossedSVG;
	}

	private static get observedAttributes() {
		return ['payment-account-name', 'merchant-id', 'checkout-key', 'secret-key', 'disabled'];
	}

	private attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'name':
				this.name = newVal;
				break;
			case 'merchant-id':
				this.merchantId = newVal;
				break;
			case 'checkout-key':
				this.checkoutKey = newVal;
				break;
			case 'secret-key':
				this.secretKey = newVal;
				break;
			case 'disabled':
				if (!this.merchantIdElement || !this.secretKeyElement || !this.checkoutKeyElement) {
					return;
				}
				if (newVal === 'true') {
					this.disabled = true;
					break;
				}
				this.disabled = false;
				break;
		}
	}




}