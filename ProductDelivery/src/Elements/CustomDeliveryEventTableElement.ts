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
<h3>Deliveries</h3>
<table class="rounded">
	<tbody>
		<tr class="active-row">
			<!--
			<td>
				<i class="fas fa-unlink rotate-45 color-error"></i>
			</td>
			-->
			<td>https://localhost:5001/productDelivery</td>
			<td>TestFolderTemplate</td>
			<td>5f90478fe228c0e5f0f3838a</td>
			<td>6657</td>
			<td>Failed</td>
			<td class="actions">
			<!--  
				<i class="fas fa-play color-primary"></i>
				<i class="fas fa-info-circle color-primary"></i> 
				-->
			<button id="play" type="button">play</button>
			<button id="delete" type="button">Delete</button>
			</td>
		</tr>
		<tr class="active-row">
			<td>
				<i class="fas fa-link rotate-45 color-secondary"></i>
			</td>
			<td>ftps://localhost:8080</td>
			<td>System/Library/Path</td>
			<td>Sucess</td>
			<td class="actions">
			<!-- 
				<i class="fas fa-play color-primary"></i>
				<i class="fas fa-info-circle color-primary"></i>
				-->
				<button id="play" type="button">play</button>
				<button id="delete" type="button">Delete</button>
			</td>
		</tr>
	</tbody>
</table>`,
	style: `
	* {
		font-family: "Mulish", sans-serif;
		color: #000;
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

	function ClickPlay(td) {
		console.log("play button test");
	}

	`,
	useShadow: false,
})


export default class CustomDeliveryEventTableElement extends CustomHTMLBaseElement {

	private deliveryTable: HTMLTableElement;
	private nativeInput: HTMLInputElement;
	private playButton: HTMLButtonElement;
	private deleteButton: HTMLButtonElement;
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
		this.deliveryTable = this.getChildElement('.rounded');

		this.playButton = this.getChildElement('#play');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.playButton = this.getChildElement('#play');
		this.playButton.addEventListener("click", this.ClickPlay.bind(this));
	}


	private ClickPlay(td: HTMLTableCellElement): void {
		var selectedRow = td.parentElement.parentElement as HTMLTableRowElement;
		var url = selectedRow.cells[0].innerText;
		console.log(url);
	}


	AddDeliveryResult(deliveryResult: DeliveryResult, deliveryProfile: IDeliveryProfile) {

		var rowData = {
			'url': deliveryProfile.url,
			'path': deliveryProfile.folderTemplate,
			'resultId': deliveryResult.id,
			'customerId': deliveryResult.customerId,
			'Status': deliveryResult.resultStatus
		}

		var tableBody = this.deliveryTable.getElementsByTagName('tbody')[0];
		var newRow = tableBody.insertRow(tableBody.rows.length);
		var cell1 = newRow.insertCell(0)
		cell1.innerHTML = rowData.resultId;
		var cell2 = newRow.insertCell(1)
		cell2.innerHTML = rowData.customerId;
		var cell3 = newRow.insertCell(2)
		cell3.innerHTML = rowData.url;
		var cell4 = newRow.insertCell(3)
		cell4.innerHTML = rowData.path;
		var cell5 = newRow.insertCell(4)
		cell5.innerHTML = rowData.Status;
		var cell6 = newRow.insertCell(5)
		cell6.innerHTML = `<button id="play" type="button">play</button>`;

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