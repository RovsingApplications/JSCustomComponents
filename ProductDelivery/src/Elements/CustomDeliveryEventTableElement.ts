import CustomElement from "../Framework/custom-element.decorator";
import DeliveryResult from "../models/DeliveryResult";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Constants from "../Framework/Constants/Constants";
import MakeRequest from "../Framework/Utilities/MakeRequest";
import Globals from '../Globals/Globals';
import CustomDeliveryResultElement from '../Elements/CustomDeliveryResultElement';
import SVGs from '../Framework/Constants/SVGs';

@CustomElement({
	selector: 'delivery-event-table',
	template: `
		<label>Leveringer</label>
		<table>
		</table>`,
	style: `
	.pad-10 {
		padding: 10px;
	}
	.result-cell
	{
		padding-left: 23px;
		color: #000;
	}
	.action-run-button
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
	}

	//load all deliveryResults into table.
	GetAllDeliveryResults() {
		const headerName = Constants.apiKeyHeaderName;
		//`https://localhost:5001/Results/get?customerId=6657`
		//`ceeab147-adea-4352-9282-0f75b4254942`
		const request = new MakeRequest(
			`${Globals.apiUrl}Results/get?customerId=${Globals.customerId}`,
			'get',
			{
				[headerName]: Globals.apiKey,
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

	// create dynamic deliveryResult row 
	private addDeliveryResultRow(deliveryResult: DeliveryResult) {

		var tableRow = this.deliveryTable.insertRow(0);
		// icon cell
		var iconCell = tableRow.insertCell(0);
		var faIcon = deliveryResult.resultStatus == "Success" ? SVGs.link : SVGs.linkOff;
		var faColor = deliveryResult.resultStatus == "Success" ? 'success' : 'fail';
		iconCell.innerHTML = faIcon;
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
		actionButton.innerHTML = SVGs.playArrow;
		actionButton.addEventListener('click', () => {
			this.runAction(deliveryResult.id);
		});
		actionButton.classList.add("result-cell");
		actionButton.classList.add("action-run-button");
		actionCell.appendChild(actionButton);
		tableRow.appendChild(actionCell);

		return tableRow;
	}

	// bind runAction on play button
	private runAction(deliveryResultId: string): void {
		let showSpinner = new CustomEvent('show-spinner', {
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(showSpinner);
		const headerName = Constants.apiKeyHeaderName;
		const request = new MakeRequest(
			`${Globals.apiUrl}Delivery/run?resultId=${deliveryResultId}`,
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
				this.dispatchEvent(showDataEvent);
				this.dispatchEvent(updateSingleRowEvent);
			})
			.catch(exception => {
				console.log(exception);
			});
	}

	updateDeliveryResultRowStatus(deliveryResult: DeliveryResult) {
		// if we want load all records from DB following code can use
		//this.deliveryTable.innerHTML = "";
		//this.GetAllDeliveryResults();
		// otherwise update only spceific row as follows.
		let statuscolumn = 2;
		let resultCell = null;
		var faIcon = deliveryResult.resultStatus == "Success" ? SVGs.link : SVGs.linkOff;
		var faColor = deliveryResult.resultStatus == "Success" ? 'success' : 'fail';
		for (var i = 0, row; row = this.deliveryTable.rows[i]; i++) {
			// retrive result id row cell
			resultCell = (row as HTMLTableRowElement).cells[1] as HTMLTableDataCellElement;
			if (resultCell.innerText === deliveryResult.id) {

				(row as HTMLTableRowElement).cells[0].innerHTML = faIcon;

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
}