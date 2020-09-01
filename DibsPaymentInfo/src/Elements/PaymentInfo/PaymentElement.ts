import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import PaymentInfo from "../../Framework/Models/PaymentInfo";
import Colors from "../../Framework/Constants/Colors";
import ItemsElement from "./ItemsElement";
import DateTimeUtility from "../../Framework/Utilities/DateTimeUtility";


@CustomElement({
	selector: 'esignatur-dibs-payment-info-payment',
	template: `
		<div class="dibs-payment-info-payment-wrapper">
			<div class="dibs-payment-info-payment-line">
				Charged At:
				<span id="charged-at">-</span>
			</div>
			<div class="dibs-payment-info-payment-line">
				Payment Order Reference:
				<span id="payment-order-reference"></span>
			</div>
			<div class="payment-info-items-element-wrapper">
				<esignatur-dibs-payment-info-items></esignatur-dibs-payment-info-items>
			</div>
		</div>
	`,
	style: `
		.dibs-payment-info-payment-wrapper {
			font-family: sans-serif;
			font-size: 12px;
			color: ${Colors.senary};
		}
		.dibs-payment-info-payment-line {
			margin-bottom: 5px;
		}
		.dibs-payment-info-payment-line #payment-order-reference {
			font-weight: 700;
		}
		.payment-info-items-element-wrapper {
			margin: 10px 0;
		}
	`,
	useShadow: true,
})
export default class PaymentElement extends CustomHTMLBaseElement {

	private paymentInfo: PaymentInfo;
	private chargedAtElement: HTMLElement;
	private paymentOrderReferenceElement: HTMLElement;
	private itemsElement: ItemsElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.chargedAtElement = this.getChildElement('#charged-at');
		this.paymentOrderReferenceElement = this.getChildElement('#payment-order-reference');
		this.itemsElement = this.getChildElement('esignatur-dibs-payment-info-items');
	}

	initComponent(paymentInfo: PaymentInfo) {
		this.paymentInfo = paymentInfo;
		const isCharged = paymentInfo.payment.summary.chargedAmount > 0;
		if (isCharged) {
			this.chargedAtElement.innerHTML = DateTimeUtility.format(paymentInfo.payment.created);
		}
		this.paymentOrderReferenceElement.innerHTML = paymentInfo.payment.orderDetails.reference;
		this.itemsElement.initComponent(paymentInfo.items, paymentInfo.payment.orderDetails.currency);
	}

}