import CustomElement from '../Framework/custom-element.decorator';
import CustomHTMLBaseElement from './CustomHTMLBaseElement';

@CustomElement({
	selector: 'esignatur-dibs-checkout-wrapper',
	template: `
		<div id="dibs-checkout-content"></div>
	`,
	style: ``,
	useShadow: false,
})
export default class DibsCheckoutWrapper extends CustomHTMLBaseElement {

	paymentId: string;
	checkoutKey: string;
	language: string = 'da-DK';
	test: boolean = false;
	private checkoutComplete = new Event('checkoutcomplete');


	constructor() {
		super();
	}

	componentDidMount() {
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.loadDibsScript();
	}

	private loadDibsScript() {
		const dibsCheckoutScript = document.createElement('script');
		this.appendChildElement(dibsCheckoutScript);

		dibsCheckoutScript.addEventListener('load', () => {
			this.initCheckout();
		});
		if (this.test) {
			dibsCheckoutScript.src = 'https://test.checkout.dibspayment.eu/v1/checkout.js?v=1';
			return;
		}
		dibsCheckoutScript.src = 'https://checkout.dibspayment.eu/v1/checkout.js?v=1';
	}

	private initCheckout() {
		var checkoutOptions = {
			checkoutKey: this.checkoutKey,
			paymentId: this.paymentId,
			containerId: 'dibs-checkout-content',
			language: this.language
		};
		var checkout = new Dibs.Checkout(checkoutOptions);

		checkout.on('payment-completed', (response) => {
			this.dispatchEvent(this.checkoutComplete);
		});
	}

	private static get observedAttributes() {
		return ['payment-id', 'checkout-key', 'language', 'test'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'payment-id':
				this.paymentId = newVal;
				break;
			case 'checkout-key':
				this.checkoutKey = newVal;
				break;
			case 'language':
				this.language = newVal;
				break;
			case 'test':
				this.test = true;
				break;
		}
	}
}
