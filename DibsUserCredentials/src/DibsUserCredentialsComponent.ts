import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import Globals from "./Framework/Globals/Globals";
import CustomerCredentialsService from "./Framework/Services/CustomerCredentialsService";
import CustomerPaymentAccount from "./Framework/Models/CustomerPaymentAccount";
import ElementsCreator from "./Framework/Utilities/ElementsCreator";
import CredentialsFormElement from "./Elements/Credentials/CredentialsFormElement";
import DomUtility from "./Framework/Utilities/DomUtility";


@CustomElement({
	selector: 'esignatur-dibs-user-credentials',
	template: `
		<div class="user-credentials-wrapper">
			
		</div>
	`,
	style: `
		.user-credentials-wrapper {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px;
			min-height: 200px;
		}
		.user-credentials-wrapper div,
		.user-credentials-wrapper esignatur-dibs-user-credentials-credentials-form {
			flex-grow: 1;
		}
	`,
	useShadow: true,
})
export default class DibsUserCredentialsComponent extends CustomHTMLBaseElement {

	private userCredentialsWrapper: HTMLElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.userCredentialsWrapper = this.getChildElement('.user-credentials-wrapper');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.initComponent();
	}

	private initComponent() {

		if (!Globals.apiKey || !Globals.baseUrl || !Globals.netsId) {
			const errorBlock = ElementsCreator.generateErrorBlock('Indtast nets-id, api-key- og base-url-attributter');
			DomUtility.fillContent(this.userCredentialsWrapper, errorBlock);
		}
		const loadingOverlay = ElementsCreator.generateOverlayWithSpinner(100);
		this.userCredentialsWrapper.appendChild(loadingOverlay);
		new CustomerCredentialsService().getByApiKey()
			.then(res => {
				loadingOverlay.remove();
				const credentialsFormElement = new CredentialsFormElement();
				DomUtility.fillContent(this.userCredentialsWrapper, credentialsFormElement);
				const customerPaymentAccounts: Array<CustomerPaymentAccount> = JSON.parse(res as string);
				credentialsFormElement.initComponent(customerPaymentAccounts);
			})
			.catch(ex => {
				console.error(ex);
				loadingOverlay.remove();
				let errorMessage = 'Noget gik galt!';
				if (ex.status === 401) {
					errorMessage = 'Ugyldige legitimationsoplysninger!';
				}
				if (ex.status === 403) {
					errorMessage = 'Ugyldige legitimationsoplysninger!';
				}
				const errorBlock = ElementsCreator.generateErrorBlock(errorMessage);
				DomUtility.fillContent(this.userCredentialsWrapper, errorBlock);
			});
	}

	private static get observedAttributes() {
		return ['nets-id', 'api-key', 'base-url'];
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
		}
	}




}