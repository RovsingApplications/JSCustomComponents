import CustomElement from "./Framework/custom-element.decorator";
import Constants from "./Framework/Constants/Constants";
import CustomHTMLBaseElement from "./CustomHTMLBaseElement";
import CustomDeliveryEventTableElement from "./Elements/CustomDeliveryEventTableElement";
import CustomDeliveryProfileFormElement from "./Elements/CustomDeliveryProfileFormElement";
import CustomDeliveryResultElement from "./Elements/CustomDeliveryResultElement";
import Globals from './Globals/Globals'
import MakeRequest from "./Framework/Utilities/MakeRequest";
import DeliveryResult from "./models/DeliveryResult";
import IDeliveryProfile from "./models/IDeliveryProfile";
import Colors from "./Framework/Constants/Colors"

@CustomElement({
	selector: 'product-delivery',
	template: `
<div class="wrapper">
	<div class="topconner">
		<label>Automatisk arkivering - aktiv</label>
		<label class="switch">
			<input id="status" type="checkbox"/>
			<div class="slider"></div>
		</label>
	</div>
	<div class="top">
		<div class="container container--left">
			<delivery-profile-form>
			</delivery-profile-form>
		</div>
		<div class="container container--right">
			<delivery-result> </delivery-result>
		</div>

		<div class="buttons-wrapper">
			<button id="save" class="button">Gem</button>
			<button id="try" class="button button--inverted">Test forbindelsen</button>
		</div>
	</div>
	<div class="bottom">
		<delivery-event-table> </delivery-event-table>
		<button id="runallfail" class="button">Genkør alle fejlede</button>
	</div>
</div>
`,
	style: `
	/*font awsome CDN*/
	@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
	
	* {
		font-family: "Mulish", sans-serif;
		color: ${Colors.font};
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
		margin-right: 10px;
	}
	
	/* button */
	.button {
		background: ${Colors.primary};
		border: 2px solid ${Colors.primary};
		border-radius: 4px;
		color: ${Colors.senary};
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
		background: ${Colors.senary};
		color: ${Colors.primary};
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
		border: 1px solid ${Colors.tertiary};
		background: ${Colors.senary};
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
		margin-top: 30px;
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
	.bottom > button {
		float: right;
	}
	.container {
		width: calc(50% - 51px);
		position: relative;
		float: left;
	}
	.container--left {
		padding-right: 50px;
		border-right: 1px solid ${Colors.tertiary};
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
		border: 2px solid ${Colors.quaternary};
	}
	.slider:before {
		position: absolute;
		content: "";
		height: 20px;
		width: 20px;
		left:1px;
		top: 2px;
		background-color:${Colors.tertiary};
		-webkit-transition: .4s;
		transition: .4s;
		border-radius: 50%;
	}
	input:checked + .slider {
		border-color: ${Colors.success};
	}
	input:focus + .slider {
		box-shadow: 0 0 1px ${Colors.tertiary};
	}
	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
	transform: translateX(32px);
		background-color: ${Colors.success};
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
	.topconner
	{
		float: right; 
		display: flex;	
	}
/*--------
	/*table*/
	table {
		border-collapse: collapse;
		width: 100%;
		border: 1px solid ${Colors.tertiary};
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
		background-color: ${Colors.quinary};
	}
	table tr:hover {
		background-color: ${Colors.secondary};
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
	private statusElement: HTMLInputElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.addFontToDocumentHead();
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
		this.statusElement = this.getChildElement('#status');
		this.customDeliveryEventTableElement.GetAllDeliveryResults();
		this.addListeners();
		this.updateProductDeliveryServiceStatus();
	}

	private updateProductDeliveryServiceStatus() {
		const headerName = Constants.apiKeyHeaderName;
		const request = new MakeRequest(
			`${Globals.apiUrl}Profile/profilestatus`,
			'get',
			{
				[headerName]: Globals.apiKey,
				'Content-Type': 'application/json'
			})
			.send()
			.then(response => {
				var statusResult = (JSON.parse(response as string)) as boolean;
				this.statusElement.checked = statusResult;
			})
			.catch(exception => {
				console.log(exception);
			});
	}

	private addFontToDocumentHead() {

		const fontLink = document.createElement('link');
		fontLink.rel = 'stylesheet';
		fontLink.href = 'https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700&display=swap';

		const fontAwsomeLink = document.createElement('link');
		fontAwsomeLink.rel = 'stylesheet';
		fontAwsomeLink.href = 'https://use.fontawesome.com/releases/v5.7.1/css/all.css';
		fontAwsomeLink.integrity = 'sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr';
		fontAwsomeLink.crossOrigin = 'anonymous';

		document.head.appendChild(fontLink);
		document.head.appendChild(fontAwsomeLink);
	}

	private addListeners() {
		this.saveButton.addEventListener("click", this.submitDeliveryForm.bind(this));
		this.tryButton.addEventListener("click", this.tryDelivery.bind(this));
		this.runAllFailButton.addEventListener("click", this.runAllFail.bind(this));
		this.statusElement.addEventListener("click", this.statusChanged.bind(this));
		this.customDeliveryEventTableElement.addEventListener('show-result', (evt) => this.showResult(evt as CustomEvent));
		this.customDeliveryEventTableElement.addEventListener('update-single-row', (evt) => this.updateDeliveryResultRow(evt as CustomEvent));
		this.customDeliveryEventTableElement.addEventListener('show-spinner', (evt) => this.showResultSpinner(evt as CustomEvent));
	}

	private statusChanged() {
		const headerName = Constants.apiKeyHeaderName;
		let status = this.statusElement.checked;
		const req = new MakeRequest(
			`${Globals.apiUrl}Profile/setprofilestatus?status=${status}`,
			'post', {
			[headerName]: Globals.apiKey,
			'Content-Type': 'application/json'
		}
		).send(JSON.stringify(status)).then(response => {
			var statusResult = (JSON.parse(response as string)) as boolean;
			this.statusElement.checked = statusResult;
		}).catch(exception => {
			console.log(exception);
		});
	}

	updateDeliveryResultRow(evt: CustomEvent): void {
		var deliveryResult = evt.detail as DeliveryResult;
		this.customDeliveryEventTableElement.updateDeliveryResultRowStatus(deliveryResult);
	}

	showResultSpinner(evt: CustomEvent) {
		this.customDeliveryResultElement.addWaitingSpinner();
	}

	showResult(evt: CustomEvent): void {
		this.customDeliveryResultElement.clearContent();
		this.customDeliveryResultElement.AddDeliveryResult(evt.detail);
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
				var deliveryProfile = (JSON.parse(response as string)) as IDeliveryProfile;
				this.customDeliveryResultElement.createDeliveryProfile(this.deliveryResult);
			}).catch(exception => {
				// to do: Add better exception handling
				console.log(exception);
			});
		}
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
				this.deliveryResult = new DeliveryResult(JSON.parse(response as string));
				this.customDeliveryResultElement.AddDeliveryResult(this.deliveryResult);
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
			/*var deliveryResults = new Array();
			results.forEach(ele => {
				deliveryResults.push(ele.result);
			});*/
			this.customDeliveryEventTableElement.updateDeliveryResultRowsStatus(results);
			this.customDeliveryResultElement.AddDeliveryResults(results);
		}).catch(exception => {
			console.log(exception)
		});
	}

	static get observedAttributes() {
		return ['api-key', 'api-url', 'customer-id'];
	}

	attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'api-key':
				Globals.apiKey = newVal;
				break;
			case 'api-url':
				Globals.apiUrl = newVal;
				if (Globals.apiUrl[Globals.apiUrl.length - 1] !== '/') {
					Globals.apiUrl = `${Globals.apiUrl}/`;
				}
				break;
			case 'customer-id':
				Globals.customerId = newVal;
				break;
		}
	}


}