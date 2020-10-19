import CustomElement from "../../Framework/custom-element.decorator";
import Colors from "../../Framework/Constants/Colors";
import Constants from "./Framework/Constants/Constants";
import CustomHTMLBaseElement from "./CustomHTMLBaseElement";
import CustomDeliveryEventTableElement from "./Elements/CustomDeliveryEventTableElement";
import CustomDeliveryProfileFormElement from "./Elements/CustomDeliveryProfileFormElement";
import CustomDeliveryResultElement from "./Elements/CustomDeliveryResultElement";
import Translator from "./Language/Translator";
import Globals from './Globals/Globals'
import MakeRequest from "../../Branding/src/Framework/Utilities/MakeRequest";

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
		<button class="button" style="float: right;">Run all failed</button>
	</div>
</div>
`,
	style: `
	/* latin */
	@font-face {
		font-family: 'Mulish';
		font-style: normal;
		font-weight: 500;
		font-display: swap;
		src: url(https://fonts.gstatic.com/s/mulish/v1/1Ptvg83HX_SGhgqk3wot.woff2) format('woff2');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}
	
	.pad-10 {
		padding: 10px;
	}
	
	.color-primary
	{
		color: #003E64;
	}
	
	.color-secondary
	{
		color: #28BECE;
	}

	.color-error
	{
		color: #CE2828;
	}

	.color-success
	{
		color: #28BECE;
	}

	* {
		font-family: "Mulish", sans-serif;
		color: #000;
	}

	/* text */
	h1,
	h2,
	h3,
	h4,
	h5,
	p,
	span {
		width: 100%;
	}
	h3, label {
		font-weight: 400;
		font-size: 14px;
		line-height: 17px;
	}
	h1 {
		font-weight: 800;
		font-size: 24px;
		line-height: 30px;
	}

	/* label text */
	label {
		display: block;
		padding-top: 5px;
		padding-bottom: 5px;
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
		margin: 10px 0 10px 10px;
	}
	.button--inverted {
		background: #fff;
		color: #003E64;
	}

	/* inputs boxes */
	input,
	select,
	textarea {
		width: 100%;
		height: 40px;
		border-radius: 4px;
		box-sizing: border-box;
		border: 1px solid #DFDFDF;
		background: #fff;
		padding-left: 10px;
	}
	input:read-only {
		line-height: 20px;
		height: 20px;
		margin-top: 10px;
	}

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
	.result-box {
		position: relative;
		width: 100%;
		height: 344.1px;
		background: #FFFFFF;
		border: 1px solid #DFDFDF;
		box-sizing: border-box;
		border-radius: 4px;
	}
`,
	useShadow: true,
})
export default class ProductDeliveryWebElement extends CustomHTMLBaseElement {
	private saveButton: HTMLButtonElement;
	private tryButton: HTMLButtonElement;
	private customDeliveryEventTableElement: CustomDeliveryEventTableElement;
	private customDeliveryProfileFormElement: CustomDeliveryProfileFormElement;
	private customDeliveryResultElement: CustomDeliveryResultElement;


	constructor() {
		super();
	}

	componentDidMount() {
		this.saveButton =  this.getChildElement('#save'); 
		this.tryButton = this.getChildElement('#try');  
		this.customDeliveryEventTableElement = this.getChildElement('delivery-event-table'); 
		this.customDeliveryProfileFormElement = this.getChildElement('delivery-profile-form'); 
		this.customDeliveryResultElement = this.getChildElement('delivery-result'); 
		
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.addListeners();
	}

	addListeners() {
		this.saveButton.addEventListener("click", this.submitDeliveryForm.bind(this));
		this.tryButton.addEventListener("click", this.tryDelivery.bind(this));
	}

	submitDeliveryForm()
	{
		// add functionality for submitting the form
		var deliveryProfile = this.customDeliveryProfileFormElement.getProfile();
		deliveryProfile.customerApiKey = Globals.apiKey;
		const headerName = Constants.apiKeyHeaderName;
		const creatorId= Constants.apiKeyCreatorId;
		const req = new MakeRequest(
				`${Globals.apiUrl}api/ProfileController/Upsert`,
				'post', {
				[headerName]: Globals.apiKey,
				[creatorId]:Globals.creatorId,
				'Content-Type': 'application/json'
			}
			).send(JSON.stringify(deliveryProfile)).then(res => {
			}).catch(exception => {
				console.log(exception);
			});
	}

	tryDelivery()
	{
		// add functionality for for trying your profile

	}

	getEventHistory()
	{
		// add functionality for for trying your profile
	}

	private changeLanguage(language: string) {
		// implement language change
	}

	private static get observedAttributes() {
		return ['language'];
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
			case 'api-key':
				Globals.apiKey = newVal;
				break;	
			case 'creator-id':
				Globals.creatorId = newVal
				break;	
		}
	}


}