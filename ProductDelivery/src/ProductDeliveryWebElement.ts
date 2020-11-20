import CustomElement from "../../Framework/custom-element.decorator";
import Constants from "./Framework/Constants/Constants";
import CustomHTMLBaseElement from "./CustomHTMLBaseElement";
import CustomDeliveryEventTableElement from "./Elements/CustomDeliveryEventTableElement";
import CustomDeliveryProfileFormElement from "./Elements/CustomDeliveryProfileFormElement";
import CustomDeliveryResultElement from "./Elements/CustomDeliveryResultElement";
import Globals from './Globals/Globals'
import MakeRequest from "../../Branding/src/Framework/Utilities/MakeRequest";
import DeliveryResult from "../models/DeliveryResult";

@CustomElement({
	selector: 'product-delivery',
	template: `
<div class="wrapper">
	<h2>Product Delivery Setup</h2>
	<div style="float: right; display: flex;" >
		<label style="padding-right: 20px;">Product Delivery - Active</label>
		<label class="switch">
			<input type="checkbox" id="togBtn" />
			<div class="slider"></div>
		</label>
	</div>
	<div class="top">
		<div class="container container--left">
			<delivery-profile-form>
				<script type="application/json">
				/* DeliveryProfileJson */
				{
					
				}
				</script>
			</delivery-profile-form>
		</div>
		<div class="container container--right">
			<delivery-result> </delivery-result>
		</div>

		<div class="buttons-wrapper">
			<button id="save" class="button">Save</button>
			<button id="try" class="button button--inverted">Try</button>
		</div>
	</div>
	<div class="bottom">
		<delivery-event-table> </delivery-event-table>
		<button id="runallfail" class="button" style="float: right;">Run all failed</button>
	</div>
</div>
`,
	style: `
	/*font awsome CDN*/
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

	/* font import : Mulish */
	@font-face {
		font-family: 'Mulish';
		font-style: normal;
		font-weight: 500;
		font-display: swap;
		src: url(https://fonts.gstatic.com/s/mulish/v1/1Ptvg83HX_SGhgqk3wot.woff2) format('woff2');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}
	* {
		font-family: "Mulish", sans-serif;
		color: #000;
	}

	/* text */
	h2,
	p,
	span {
		width: 100%;
	}

	/* label text */
	label {
		font-weight: 400;
		font-size: 14px;
		line-height: 11px;
		display: block;
		padding-top: 5px;
		padding-bottom: 5px;
		margin-bottom:6px;
	}
	
	/* button */
	.button {
		background: #003E64;
		border: 2px solid #003E64;
		border-radius: 4px;
		color: #fff;
		text-align: center;
		float: right;
		display: inline-block;
		font-size: 16px;
		margin: auto;
		cursor: pointer;
		width: 153px;
		height: 40px;
		margin: 10px 0 11px 10px;
	}
	.button--inverted {
		background: #fff;
		color: #003E64;
	}
	
	/* inputs boxes */
	input {
		padding-left: 10px;
		padding-bottom:12px;
		padding-top:12px;
		line-height: 18px;
		width: 100%;
		height: 34px;
		border-radius: 4px;
		box-sizing: border-box;
		border: 1px solid #DFDFDF;
		background: #fff;
		margin-bottom: 15px;
	}
	input:read-only {
		line-height: 20px;
		height: 20px;
		margin-top: 10px;
	}
	/*wrapper*/
	.wrapper {
		width: 100%;
	}
	.top {
		position: relative;
		float: left;
		width: 100%;
	}
	.bottom {
		clear: both;
		position: relative;
		float: left;
		width: 100%;
	}
	.container {
		width: calc(50% - 51px);
		position: relative;
		float: left;
	}
	.container--left {
		padding-right: 50px;
		border-right: 1px solid #DFDFDF;
	}
	.container--right {
		padding-left: 50px;
	}
	.horizontal {
		display: inline-block;
		text-align:right;
	}

   /* switch button*/
   .switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 24px;
	}
	.switch input {display:none;}
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 34px;
		height: 24px;
		border: 2px solid #E5E5E5;
	}
	.slider:before {
	position: absolute;
	content: "";
	height: 20px;
	width: 20px;
	left:1px;
	top: 2px;
	background-color:#DFDFDF;
	-webkit-transition: .4s;
	transition: .4s;
	border-radius: 50%;
	}
	input:checked + .slider {
		border-color: #28BECE;
	}
	input:focus + .slider {
	box-shadow: 0 0 1px #DFDFDF;
	}
	input:checked + .slider:before {
	-webkit-transform: translateX(26px);
	-ms-transform: translateX(26px);
	transform: translateX(32px);
		background-color: #28BECE;
	}
	.actions i {
		margin-left: 5px;
	}
	.slider:after
	{
	color: white;
	display: block;
	position: absolute;
	transform: translate(-50%,-50%);
	top: 50%;
	left: 50%;
	font-size: 10px;
	font-family: Verdana, sans-serif;
	}
/*--------
	/*table*/
	table {
		border-collapse: collapse;
		width: 100%;
		border: 1px solid #DFDFDF;
		-moz-border-radius: 4px;
		-webkit-border-radius: 4px;
		border-radius: 4px;
	}
	table td {
		border: none;
		font-size: 12px;
		line-height: 30px;
		padding-left: 20px;
	}
	.rotate-45 {
		transform: rotate(45deg);
	}
	table tr:nth-child(even) {
		background-color: #f2f2f2;
	}
	table tr:hover {
		background-color: #ddd;
	}
	.buttons-wrapper {
		width: 100%;
		position: relative;
		float: left;
		clear: both;
	}
	.pad-10 {
		padding: 10px;
	}
`,
	useShadow: true,
})

export default class ProductDeliveryWebElement extends CustomHTMLBaseElement {
	private saveButton: HTMLButtonElement;
	private tryButton: HTMLButtonElement;
	private runAllFailButton: HTMLButtonElement;
	private customDeliveryEventTableElement: CustomDeliveryEventTableElement;
	private customDeliveryProfileFormElement: CustomDeliveryProfileFormElement;
	private customDeliveryResultElement: CustomDeliveryResultElement;
	private deliveryResult: DeliveryResult;

	constructor() {
		super();
	}

	componentDidMount() {
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.saveButton = this.getChildElement('#save');
		this.tryButton = this.getChildElement('#try');
		this.runAllFailButton = this.getChildElement('#runallfail');
		this.customDeliveryEventTableElement = this.getChildElement('delivery-event-table');
		this.customDeliveryProfileFormElement = this.getChildElement('delivery-profile-form');
		this.customDeliveryResultElement = this.getChildElement('delivery-result');
		this.customDeliveryEventTableElement.GetAllDeliveryResults();
		this.addListeners();
	}

	private addListeners() {
		this.saveButton.addEventListener("click", this.submitDeliveryForm.bind(this));
		this.tryButton.addEventListener("click", this.tryDelivery.bind(this));
		this.runAllFailButton.addEventListener("click", this.runAllFail.bind(this));
		document.addEventListener('show-result', (evt) => this.showResult(evt as CustomEvent));
		document.addEventListener('update-single-row', (evt) => this.updateDeliveryResultRow(evt as CustomEvent));
		document.addEventListener('show-spinner', (evt) => this.showResultSpinner(evt as CustomEvent));
	}

	updateDeliveryResultRow(evt: CustomEvent): void {
		evt.preventDefault();
		var deliveryResult = evt.detail as DeliveryResult;
		this.customDeliveryEventTableElement.updateDeliveryResultRowStatus(deliveryResult);
	}

	showResultSpinner(evt: CustomEvent) {
		evt.preventDefault();
		this.customDeliveryResultElement.addWaitingSpinner();
	}

	showResult(evt: CustomEvent): void {
		evt.preventDefault();
		this.customDeliveryResultElement.clearContent();
		this.customDeliveryResultElement.AddEvents(evt.detail);
	}

	private submitDeliveryForm() {
		if (this.customDeliveryProfileFormElement.checkInputs()) {
			this.customDeliveryResultElement.addWaitingSpinner();
			var deliveryProfile = this.customDeliveryProfileFormElement.getProfile();
			const headerName = Constants.apiKeyHeaderName;
			const req = new MakeRequest(
				`${Globals.apiUrl}Profile/upsert`,
				'post', {
				[headerName]: Globals.apiKey,
				'Content-Type': 'application/json'
			}
			).send(JSON.stringify(deliveryProfile)).then(response => {
				this.addDeliveryResult(response);
			}).catch(exception => {
				console.log(exception);
			});
		}
	}

	private addDeliveryResult(response: any): void {
		this.deliveryResult = new DeliveryResult(JSON.parse(response as string));
		this.customDeliveryResultElement.AddEvents(this.deliveryResult);
	}

	private tryDelivery() {
		if (this.customDeliveryProfileFormElement.checkInputs()) {
			this.customDeliveryResultElement.addWaitingSpinner();
			var deliveryProfile = this.customDeliveryProfileFormElement.getProfile();
			const headerName = Constants.apiKeyHeaderName;
			const req = new MakeRequest(
				`${Globals.apiUrl}delivery/test`,
				'post', {
				[headerName]: Globals.apiKey,
				'Content-Type': 'application/json'
			}
			).send(JSON.stringify(deliveryProfile)).then(response => {
				this.addDeliveryResult(response);
			}).catch(exception => {
				console.log(exception)
			});
		}
	}

	private runAllFail() {
		const headerName = Constants.apiKeyHeaderName;
		this.customDeliveryResultElement.addWaitingSpinner();
		const req = new MakeRequest(
			`${Globals.apiUrl}delivery/runfailed`,
			'post', {
			[headerName]: Globals.apiKey,
			'Content-Type': 'application/json'
		}
		).send().then(response => {
			var results = (JSON.parse(response as string));
			var deliveryResults = new Array();
			results.forEach(ele => {
				deliveryResults.push(ele.result);
			});
			this.customDeliveryEventTableElement.updateDeliveryResultRowsStatus(deliveryResults);
			this.customDeliveryResultElement.AddEventsForDeliveryResults(deliveryResults);
		}).catch(exception => {
			console.log(exception)
		});
	}

	private changeLanguage(language: string) {
		// implement language change
	}

	attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'language':
				this.changeLanguage(newVal)
				break;
			case 'api-key':
				Globals.apiKey = newVal;
				break;
			case 'api-url':
				Globals.apiUrl = newVal;
				if (Globals.apiUrl[Globals.apiUrl.length - 1] !== '/') {
					Globals.apiUrl = `${Globals.apiUrl}/`;
				}
				break;
			case 'creator-id':
				Globals.creatorId = newVal
				break;
		}
	}


}