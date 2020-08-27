import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import SingleCredentialsElement from "./SingleCredentialsElement";
import Colors from "../../Framework/Constants/Colors";
import CustomerCredentialsService from "../../Framework/Services/CustomerCredentialsService";
import CustomerPaymentAccount from "../../Framework/Models/CustomerPaymentAccount";
import ElementsCreator from "../../Framework/Utilities/ElementsCreator";
import SVGs from "../../Framework/Constants/SVGs";

@CustomElement({
	selector: 'esignatur-dibs-user-credentials-credentials-form',
	template: `
		<form>
			<div class="add-credentials-wrapper">
				<button>${SVGs.plusSVG}</button>
			</div>
			<div class="all-credentials-wrapper"></div>
			<div class="credentials-form-action-wrapper">
				<button>Gemme</button>
			</div>
		</form>
	`,
	style: `
		.add-credentials-wrapper {
			display: flex;
			justify-content: flex-end;
		}
		.add-credentials-wrapper button {
			padding: 0;
			border: none;
			border-radius: 50%;
			outline: none;
			background-color: ${Colors.octonary};
			font-weight: 700;
			cursor :pointer;
			width: 40px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.add-credentials-wrapper button:hover {
			opacity: 0.9;
		}
		.add-credentials-wrapper button svg {
			width: 20px;
			height: 20px;
		}
		.add-credentials-wrapper button svg path {
			fill: #FFFFFF;
		}
		.single-credentials-wrapper {
			padding: 15px 0;
		}
		.single-credentials-wrapper:nth-child(n+2) {
			border-top: 1px solid ${Colors.quinary};
		}
		esignatur-dibs-user-credentials-single-credentials {
			width: 100%;
		}
		.credentials-form-action-wrapper {
			margin-top: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.credentials-form-action-wrapper button {
			outline: none;
			border: none;
			border-radius: 3px;
			width: 120px;
			height: 40px;
			font-size: 16px;
			font-weight: 700;
			letter-spacing: 1px;
			color: #FFFFFF;
			background-color: ${Colors.primary};
			cursor: pointer;
		}
		.credentials-form-action-wrapper button:hover {
			opacity: 0.8;
		}
	`,
	useShadow: true,
})
export default class CredentialsFormElement extends CustomHTMLBaseElement {

	private snackBar: HTMLElement;
	private allCredentialsWrapper: HTMLElement;
	private addCredentialsButton: HTMLElement;
	private submitButton: HTMLElement;
	private singleCredentialsElements: SingleCredentialsElement[];

	constructor() {
		super();
	}

	componentDidMount() {
		this.allCredentialsWrapper = this.getChildElement('.all-credentials-wrapper');
		this.addCredentialsButton = this.getChildElement('.add-credentials-wrapper button');
		this.submitButton = this.getChildElement('.credentials-form-action-wrapper button');
		this.bindEvents();
	}

	initComponent(customerPaymentAccounts: CustomerPaymentAccount[]) {
		this.singleCredentialsElements = new Array<SingleCredentialsElement>();
		if (!customerPaymentAccounts || customerPaymentAccounts.length === 0) {
			return;
		}
		customerPaymentAccounts.forEach(customerPaymentAccount => {
			this.addSingleCredentialsElement(customerPaymentAccount, true);
		});
	}

	private bindEvents() {
		this.addCredentialsButton.onclick = (event: Event) => {
			event.preventDefault();
			this.addSingleCredentialsElement(new CustomerPaymentAccount({}), false);
		};

		this.submitButton.onclick = (event: Event) => {
			event.preventDefault();
			let isFormValid = true;
			this.singleCredentialsElements.forEach(singleCredentialsElement => {
				singleCredentialsElement.validate();
				isFormValid = isFormValid && singleCredentialsElement.valid;
			});
			if (!isFormValid) {
				return;
			}
			const customerPaymentAccounts = this.singleCredentialsElements.map(singleCredentialsElement => singleCredentialsElement.customerPaymentAccount);
			const loadingOverlay = ElementsCreator.generateOverlayWithSpinner(100);
			this.appendChildElement(loadingOverlay);
			new CustomerCredentialsService().upsert(customerPaymentAccounts)
				.then(res => {
					loadingOverlay.remove();
					if (this.snackBar) {
						this.snackBar.remove();
					}
					this.snackBar = ElementsCreator.generateSnackbar('Gemt med succes', Colors.primary);
					this.appendChildElement(this.snackBar);
				})
				.catch(ex => {
					console.error(ex);
					loadingOverlay.remove();
					if (this.snackBar) {
						this.snackBar.remove();
					}
					this.snackBar = ElementsCreator.generateSnackbar('Noget gik galt!', Colors.nonary);
					this.appendChildElement(this.snackBar);
				});
		};
	}

	private addSingleCredentialsElement(customerPaymentAccount: CustomerPaymentAccount, isDisabled: boolean) {
		const singleCredentialsElement = new SingleCredentialsElement();
		this.singleCredentialsElements.push(singleCredentialsElement);
		const singleCredentialsElementWrapper = document.createElement('div');
		singleCredentialsElementWrapper.classList.add('single-credentials-wrapper');
		this.allCredentialsWrapper.appendChild(singleCredentialsElementWrapper);
		singleCredentialsElementWrapper.appendChild(singleCredentialsElement);
		singleCredentialsElement.disabled = isDisabled;
		singleCredentialsElement.customerPaymentAccount = customerPaymentAccount;
		singleCredentialsElement.addEventListener('delete', () => {
			var paymentsingleCredentialsElementIndex = this.singleCredentialsElements.indexOf(singleCredentialsElement);
			if (paymentsingleCredentialsElementIndex !== -1) {
				this.singleCredentialsElements.splice(paymentsingleCredentialsElementIndex, 1);
				singleCredentialsElementWrapper.remove();
			}
		});
	}

}