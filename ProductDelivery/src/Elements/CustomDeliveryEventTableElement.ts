import Colors from "../../../Framework/Constants/Colors";
import CustomElement from "../../../Framework/custom-element.decorator";
import DeliveryResult from "../../models/DeliveryResult";
import IDeliveryProfile from "../../models/IDeliveryProfile";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Constants from "../Framework/Constants/Constants";
import MakeRequest from "../../../Branding/src/Framework/Utilities/MakeRequest";
import Globals from '../Globals/Globals';
import CustomDeliveryResultElement from '../Elements/CustomDeliveryResultElement';

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
		color: #000;
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
	.color-fail
	{
		color: #CE2828;
	}
	.color-success
	{
		color: #28BECE;
	}
	.fa-play{
		color: #003E64;
	}
	`,
	useShadow: false,
})


export default class CustomDeliveryEventTableElement extends CustomHTMLBaseElement {
	private deliveryTable: HTMLTableElement;
	private nativeInput: HTMLInputElement;
	public customDeliveryResult: CustomDeliveryResultElement;
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
		this.GetAllDeliveryResults();
	}


	private GetAllDeliveryResults() {
		const headerName = Constants.apiKeyHeaderName;
		const request = new MakeRequest(
			`https://localhost:5001/Results/get?customerId=6657`,
			'get',
			{
				[headerName]: `ceeab147-adea-4352-9282-0f75b4254942`,
				'Content-Type': 'application/json'
			})
			.send()
			.then(response => {
				var deliveryResults = (JSON.parse(response as string)) as DeliveryResult[];
				deliveryResults.forEach(delveryResult => this.deliveryTable.appendChild(this.addDeliveryResultRow(delveryResult)));
			})
			.catch(exception => {
				console.log(exception);
			});
	}

	private addDeliveryResultRow(deliveryResult: DeliveryResult) {

		var tableRow = this.deliveryTable.insertRow(0);
		tableRow.addEventListener('click', this.showResult.bind(deliveryResult));
		// icon cell
		var iconCell = tableRow.insertCell(0);
		var faIcon = deliveryResult.resultStatus == "Success" ? 'link' : "unlink";
		var faColor = deliveryResult.resultStatus == "Success" ? 'success' : 'fail';
		// <i class="fas fa-unlink rotate-45 color-error"></i>
		// <i class="fas fa-link rotate-45 color-secondary"></i>
		//iconCell.appendChild(document.createElement(`<i class="fa fa-${faIcon} rotate-45 ${deliveryResult.resultStatus}" aria-hidden="true"></i>`));
		iconCell.innerHTML = `<i class="fas fa-${faIcon} rotate-45 color-${faColor}"></i>`;
		iconCell.classList.add("result-cell");
		iconCell.classList.add("result-cell--status-icon");
		tableRow.appendChild(iconCell);

		var orderIdCell = tableRow.insertCell(1);
		orderIdCell.innerText = deliveryResult.id;
		orderIdCell.classList.add("result-cell");
		if (faColor != 'success') {
			orderIdCell.classList.add(`color-${faColor}`);
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
			`https://localhost:5001/Delivery/run?resultId=${this.id}`,
			'post',
			{
				[headerName]: Globals.apiKey,
				'Content-Type': 'application/json'
			}
		)
			.send()
			.then(response => {
				var deliveryResult = new DeliveryResult(JSON.parse(response as string));
				let showDataEvent = new CustomEvent('show-result', {
					bubbles: true,
					composed: true,
					detail: deliveryResult
				});
				let updateSingleRowEvent = new CustomEvent('update-single-row', {
					bubbles: true,
					composed: true,
					detail: deliveryResult
				});
				document.dispatchEvent(showDataEvent);
				document.dispatchEvent(updateSingleRowEvent);
			})
			.catch(exception => {
				console.log(exception)
			});
	}

	updateDeliveryResultRowStatus(deliveryResult: DeliveryResult) {
		// if we want load all records from DB following code can use
		//this.deliveryTable.innerHTML = "";
		//this.GetAllDeliveryResults();
		// otherwise update only spceific row as follows.
		let statuscolumn = 2;
		let resultCell = null;
		var faIcon = deliveryResult.resultStatus == "Success" ? 'link' : "unlink";
		var faColor = deliveryResult.resultStatus == "Success" ? 'success' : 'fail';
		for (var i = 0, row; row = this.deliveryTable.rows[i]; i++) {
			// retrive result id row cell
			resultCell = (row as HTMLTableRowElement).cells[1] as HTMLTableDataCellElement;
			if (resultCell.innerText === deliveryResult.id) {

				(row as HTMLTableRowElement).cells[0].innerHTML = `<i class="fas fa-${faIcon} rotate-45 color-${faColor}"></i>`;

				(row as HTMLTableRowElement).cells[statuscolumn].innerText = deliveryResult.resultStatus;

				var cssClasses = resultCell.classList as string[];
				for (var j = cssClasses.length - 1; j >= 0; j--) {
					var className = resultCell.classList[j];
					resultCell.classList.remove(className);
				}
				if (faColor != 'success') {
					resultCell.classList.add(`color-${faColor}`);
				}
				resultCell.classList.add(`result-cell`);
			}
		}
	}


	updateDeliveryResultRowsStatus(deliveryResults: DeliveryResult[]) {
		deliveryResults.forEach((item) => {
			this.updateDeliveryResultRowStatus(item);
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