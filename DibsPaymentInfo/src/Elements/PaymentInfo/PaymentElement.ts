import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import PaymentInfo from "../../Framework/Models/PaymentInfo";
import Colors from "../../Framework/Constants/Colors";
import ItemsElement from "./ItemsElement";
import DateTimeUtility from "../../Framework/Utilities/DateTimeUtility";
import SVGs from "../../Framework/Constants/SVGs";
import PaymentService from "../../Framework/Services/PaymentService";
import ConversionUtility from "../../Framework/Utilities/ConversionUtility";
import DownloadUtility from "../../Framework/Utilities/DownloadUtility";

@CustomElement({
	selector: 'esignatur-dibs-payment-info-payment',
	template: `
		<div class="dibs-payment-info-payment-wrapper">
			<div class="dibs-payment-info-payment-header">
				<div>
					<div class="dibs-payment-info-payment-line">
						<span data-translate="PaymentElement.ChargedAt"></span>:
						<span id="charged-at">-</span>
					</div>
					<div class="dibs-payment-info-payment-line">
						<span data-translate="PaymentElement.PaymentOrderReference"></span>:
						<span id="payment-order-reference"></span>
					</div>
				</div>
				<div class="download-icon-wrapper">
					${SVGs.downloadSVG}
					<span class="tooltip">
						<span data-translate="PaymentElement.DownloadReceipt"></span>
					</span>
				</div>
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
		.dibs-payment-info-payment-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.dibs-payment-info-payment-line {
			margin-bottom: 5px;
		}
		.dibs-payment-info-payment-line #payment-order-reference {
			font-weight: 700;
		}
		.dibs-payment-info-payment-header .download-icon-wrapper {
			position: relative;
		}
		.dibs-payment-info-payment-header .download-icon-wrapper svg {
			width: 25px;
			height: 25px;
			cursor: pointer;
		}
		.dibs-payment-info-payment-header .download-icon-wrapper .tooltip {
			display: none;
		}
		.dibs-payment-info-payment-header .download-icon-wrapper:hover .tooltip {
			display: block;
			position: absolute;
			background-color: ${Colors.tertiary};
			color: #FFFFFF;
			border-radius: 3px;
			padding: 5px;
			left: -30px;
			text-align: center;
			font-weight: 700;
			font-size: 10px;
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
	private downloadIcon: HTMLElement;
	private isDownloadingReceipt = false;

	constructor() {
		super();
	}

	componentDidMount() {
		super.componentDidMount();

		this.chargedAtElement = this.getChildElement('#charged-at');
		this.paymentOrderReferenceElement = this.getChildElement('#payment-order-reference');
		this.itemsElement = this.getChildElement('esignatur-dibs-payment-info-items');
		this.downloadIcon = this.getChildElement('.download-icon-wrapper svg');
	}

	initComponent(paymentInfo: PaymentInfo) {
		this.paymentInfo = paymentInfo;
		const isCharged = paymentInfo.payment.summary.chargedAmount > 0;
		if (isCharged) {
			this.chargedAtElement.innerHTML = DateTimeUtility.format(paymentInfo.payment.created);
		}
		this.paymentOrderReferenceElement.innerHTML = paymentInfo.payment.orderDetails.reference;
		this.itemsElement.initComponent(paymentInfo.items, paymentInfo.payment.orderDetails.currency);
		this.bindEvents();
	}

	bindEvents() {
		this.downloadIcon.onclick = () => {
			if (this.isDownloadingReceipt) {
				return;
			}
			this.isDownloadingReceipt = true;

			const paymentId = this.paymentInfo.payment.paymentId;
			new PaymentService().downloadReceipt(paymentId)
				.then(res => {
					this.isDownloadingReceipt = false;
					var base64 = JSON.parse(res as string);
					const arrayBuffer = ConversionUtility.base64ToArrayBuffer(base64);
					DownloadUtility.saveByteArray('Receipt.pdf', arrayBuffer);
				})
				.catch(ex => {
					console.error(ex);
					this.isDownloadingReceipt = false;
				})

		};
	}

}