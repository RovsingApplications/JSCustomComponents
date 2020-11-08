import Colors from "../../../Framework/Constants/Colors";
import CustomElement from "../../../Framework/custom-element.decorator";
import DeliveryResult from "../../models/DeliveryResult";
import IDeliveryProfile from "../../models/IDeliveryProfile";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Constants from "../Framework/Constants/Constants";
import MakeRequest from "../../../Branding/src/Framework/Utilities/MakeRequest";
import Globals from '../Globals/Globals';

@CustomElement({
	selector: 'delivery-event-table',
	template: `
<head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
</head>
<label>Deliveries</label>
<table>
</table>`,
	style: `
	* {
		font-family: "Mulish", sans-serif;
		color: #000;
	}
	.pad-10 {
		padding: 10px;
	}
	.result-cell
	{
		padding-left: 23px;
	}
	.action
	{
		 background-color: Transparent;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow: hidden;
    outline:none;
	}
	.color-Failed
	{
		color: #CE2828;
	}
	.color-Success
	{
		color: #28BECE;
	}
	`,
	useShadow: false,
})


export default class CustomDeliveryEventTableElement extends CustomHTMLBaseElement {

	private deliveryTable: HTMLTableElement;
	private nativeInput: HTMLInputElement;
	private change = new Event('change');

	constructor() {
		super();
	}

	get value() {
		if (!this.nativeInput) {
			return null;
		}
		return this.nativeInput.value;
	}

	set value(val: string) {
		if (!this.nativeInput) {
			return;
		}
		this.nativeInput.value = val;
	}

	componentDidMount() {

		this.nativeInput = this.getChildElement('.custom-input');
		this.deliveryTable = this.getChildElement('table') as HTMLTableElement;

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		var deliveryResultMockList = JSON.parse(this.GetTestDeliveryResult()) as DeliveryResult[]; // we need the results
		var deliveryResultRows = deliveryResultMockList.forEach(delveryResult => this.deliveryTable.appendChild(this.addDeliveryResultRow(delveryResult)));
	}


	private GetDeliveryResults(): DeliveryResult[] {
		let deliveryResults = [];
		const headerName = Constants.apiKeyHeaderName;
		const request = new MakeRequest(
			`${Globals.apiUrl}/Results/get?customerId=6657`,
			'get',
			{
				[headerName]: Globals.apiKey,
				'Content-Type': 'application/json'
			})
			.send()
			.then(response => {
				deliveryResults = (JSON.parse(response as string)) as DeliveryResult[];
			})
			.catch(exception => {
				console.log(exception)
			});
		return deliveryResults;
	}

	private GetTestDeliveryResult(): string {
		return `[{
							"id": "5f8f22b9d2010aaed36cb635",
							"customerId": "741852A",
							"orderId": "asdsib235435435435",
							"resultStatus": "Success",
							"signers": [{
								"name": "Dilshan Makavitage",
								"identification": "dmp",
								"email": "dmp@esignature.dk"
							}],
							"documents": [{
								"documentType": "Document",
								"fileName": "TestFile_1"
							}, {
								"documentType": "PaymentReceipt",
								"fileName": "TestFile_2"
							}],
							"completedDate": "2020-11-03T08:49:23.3162541+01:00",
							"createdAt": "2020-11-03T08:49:23.3163175+01:00",
							"lastModified": "2020-11-03T08:49:23.3165274+01:00",
							"eventLog": ["filepath : /productDelivery", "connection url : https://localhost/productDelivery", "userName : dilshan", "Upload : Sucess"]
							},
							{
							"id": "5f90478fe228c0e5f0f3838a",
							"customerId": "852164A",
							"orderId": "713601",
							"resultStatus": "Failed",
							"signers": [{
								"name": "Dilshan Makavitage",
								"identification": "dmp",
								"email": "dmp@esignature.dk"
							}],
							"documents": [{
								"documentType": "Document",
								"fileName": "TestFile_21"
							}, {
								"documentType": "PaymentReceipt",
								"fileName": "TestFile_22"
							}],
							"completedDate": "2020-11-03T08:49:23.3162541+01:00",
							"createdAt": "2020-11-03T08:49:23.3163175+01:00",
							"lastModified": "2020-11-03T08:49:23.3165274+01:00",
							"eventLog": ["filepath : /productDelivery", "connection url : https://localhost/productDelivery", "userName : Bondo", "Upload : Failed"]
						}]`;
	}

	private addDeliveryResultRow(deliveryResult: DeliveryResult) {

		var tableRow = this.deliveryTable.insertRow(0);
		tableRow.addEventListener('click', this.showResult.bind(deliveryResult));
		// icon cell
		var iconCell = tableRow.insertCell(0);
		var faIcon = deliveryResult.resultStatus == "Success" ? 'link' : "unlink";
		// <i class="fas fa-unlink rotate-45 color-error"></i>
		// <i class="fas fa-link rotate-45 color-secondary"></i>
		//iconCell.appendChild(document.createElement(`<i class="fa fa-${faIcon} rotate-45 ${deliveryResult.resultStatus}" aria-hidden="true"></i>`));
		iconCell.innerHTML = `<i class="fas fa-${faIcon} rotate-45 color-${deliveryResult.resultStatus}"></i>`;
		iconCell.classList.add("result-cell");
		iconCell.classList.add("result-cell--status-icon");
		tableRow.appendChild(iconCell);

		var orderIdCell = tableRow.insertCell(1);
		orderIdCell.innerText = deliveryResult.orderId;
		orderIdCell.classList.add("result-cell");
		var colorClass = deliveryResult.resultStatus == "Success" ? null : "color-Failed";
		if (colorClass != null) {
			orderIdCell.classList.add(colorClass);
		}
		tableRow.appendChild(orderIdCell);

		var resultCell = tableRow.insertCell(2);
		resultCell.innerText = deliveryResult.resultStatus;
		resultCell.classList.add("result-cell");
		tableRow.appendChild(resultCell);

		var actionCell = tableRow.insertCell(3);
		var actionButton = document.createElement('button');
		actionButton.innerHTML = `<i class="fas fa-play"></i>`;
		actionButton.addEventListener('click', this.runAction.bind(deliveryResult));
		actionButton.classList.add("result-cell");
		actionButton.classList.add("action");
		actionCell.appendChild(actionButton);
		tableRow.appendChild(actionCell);

		return tableRow;
	}

	private runAction(event: Event): void {
		event.preventDefault();

		const headerName = Constants.apiKeyHeaderName;
		const request = new MakeRequest(
			`${Globals.apiUrl}Delivery/run?resultId=${this.id}`,
			'post',
			{
				[headerName]: Globals.apiKey,
				'Content-Type': 'application/json'
			}
		)
			.send()
			.then(response => {
				var myRunEvent = new CustomEvent('show-result', {
					bubbles: true,
					composed: true,
					detail: response // ensure response it the correct deliveryResult json
				});
				document.dispatchEvent(myRunEvent);
			})
			.catch(exception => {
				console.log(exception)
			});
	}

	showResult(event: Event): void {
		event.preventDefault();
		var response = this;
		var myshowResultEvent = new CustomEvent('show-result', {
			bubbles: true,
			composed: true,
			detail: this
		});
		document.dispatchEvent(myshowResultEvent);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'required':
				if (!this.nativeInput) {
					break;
				}
				if (newVal === 'true') {
					this.nativeInput.required = true;
					break;
				}
				this.nativeInput.required = false;
				break;
			case 'name':
				if (!this.nativeInput) {
					break;
				}
				this.nativeInput.name = newVal;
				break;
		}
	}
}