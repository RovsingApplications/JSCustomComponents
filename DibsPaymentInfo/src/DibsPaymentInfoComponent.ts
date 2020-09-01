import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import Globals from "./Framework/Globals/Globals";
import ElementsCreator from "./Framework/Utilities/ElementsCreator";
import DomUtility from "./Framework/Utilities/DomUtility";
import PaymentService from "./Framework/Services/PaymentService";
import PaymentInfo from "./Framework/Models/PaymentInfo";
import PaymentElement from "./Elements/PaymentInfo/PaymentElement";


@CustomElement({
	selector: 'esignatur-dibs-payment-info',
	template: `
		<div class="payment-info-wrapper">
				
		</div>
	`,
	style: `
		.payment-info-wrapper {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px;
			min-height: 200px;
		}
		.payment-info-wrapper div {
			flex-grow: 1;
		}
	`,
	useShadow: true,
})
export default class DibsPaymentInfoComponent extends CustomHTMLBaseElement {

	private paymentInfoWrapper: HTMLElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.paymentInfoWrapper = this.getChildElement('.payment-info-wrapper');

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
		const loadingOverlay = ElementsCreator.generateOverlayWithSpinner(100);
		this.paymentInfoWrapper.appendChild(loadingOverlay);
		var getPaymentPromise;
		if (Globals.paymentId) {
			getPaymentPromise = new PaymentService().getByPaymentId(Globals.paymentId);
		} else {
			getPaymentPromise = new PaymentService().getByPaymentSignOrder(Globals.signingOrderId, Globals.signerReference);
		}
		getPaymentPromise.then(res => {
			loadingOverlay.remove();
			const paymentInfo: PaymentInfo = JSON.parse(res as string);
			const paymentElement = new PaymentElement();
			paymentElement.style.flexGrow = '1';
			paymentElement.style.width = '100%';
			DomUtility.fillContent(this.paymentInfoWrapper, paymentElement);
			paymentElement.initComponent(paymentInfo);
		})
			.catch(ex => {
				console.error(ex);
				loadingOverlay.remove();
				let errorMessage = 'Noget gik galt!';
				if (ex.status === 401) {
					errorMessage = 'Ugyldige legitimationsoplysninger!';
				}
				if (ex.status === 403) {
					errorMessage = 'Uberettiget!';
				}
				const errorBlock = ElementsCreator.generateErrorBlock(errorMessage);
				DomUtility.fillContent(this.paymentInfoWrapper, errorBlock);
			});
	}

	private hasMissingAttributes() {
		return !Globals.apiKey ||
			!Globals.baseUrl ||
			!Globals.netsId ||
			!(Globals.paymentId || (Globals.signerReference && Globals.signingOrderId));
	}

	private displayFillAttributesError() {
		const errorBlock = ElementsCreator.generateErrorBlock(`
			<span>Indtast api-key- og base-url-attributter:</span>
			<br>
			<span>nets-id, api-key, base-url</span>
			<br>
			<span>(payment-id) eller (signing-order-id og signer-reference)</span>
		`);
		DomUtility.fillContent(this.paymentInfoWrapper, errorBlock);
	}

	private static get observedAttributes() {
		return ['nets-id', 'api-key', 'base-url', 'payment-id', 'signing-order-id', 'signer-reference'];
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
			case 'payment-id':
				Globals.paymentId = newVal;
				break;
			case 'signing-order-id':
				Globals.signingOrderId = newVal;
				break;
			case 'signer-reference':
				Globals.signerReference = newVal;
				break;
		}
	}
}