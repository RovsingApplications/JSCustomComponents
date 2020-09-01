import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Item from "../../Framework/Models/Item";
import Colors from "../../Framework/Constants/Colors";
import ArithmeticUtility from "../../Framework/Utilities/ArithmeticUtility";
import DomUtility from "../../Framework/Utilities/DomUtility";


@CustomElement({
	selector: 'esignatur-dibs-payment-info-items',
	template: `
		<div>
			<div class="dibs-payment-info-items-table-wrapper">
				<table>
					<thead>
						<tr>
							<td>Item</td>
							<td>Qty</td>
							<td>Unit price</td>
							<td>Tax rate</td>
							<td>Amount</td>
						</tr>
					</thead>
					<tbody id="items-body">
					</tbody>
				<table>
				<table class="total">
					<tr>
						<td>Subtotal</td>
						<td id="subtotal-value"></td>
					</tr>
					<tr>
						<td>Tax</td>
						<td id="tax-amount-value"></td>
					</tr>
					<tr class="total-row">
						<td>Total</td>
						<td id="total-value"></td>
				</table>
			</div>
		</div>
	`,
	style: `
		.dibs-payment-info-items-table-wrapper {
			font-family: sans-serif;
			font-size: 12px;
		}
		.dibs-payment-info-items-table-wrapper table {
			width: 100%;
		}
		.dibs-payment-info-items-table-wrapper table.total {
			width: 40%;
			margin-left: auto;
		}
		.dibs-payment-info-items-table-wrapper table thead td {
			padding-bottom: 15px;
			border-bottom: 1px solid ${Colors.quinary};
			color: ${Colors.primary};
			text-align: center;
		}
		.dibs-payment-info-items-table-wrapper table tbody td {
			padding: 10px 0;
			color: ${Colors.senary};
			border-bottom: 1px solid ${Colors.quinary};
			text-align: center;
		}
		.dibs-payment-info-items-table-wrapper table.total td {
			padding: 5px 0;
		}

		.dibs-payment-info-items-table-wrapper table td:first-child {
			text-align: left;
		}

		.dibs-payment-info-items-table-wrapper table td:last-child {
			text-align: right;
		}
		.dibs-payment-info-items-table-wrapper table tr.total-row {
			font-size: 14px;
			color: ${Colors.primary};
		}
	`,
	useShadow: true,
})
export default class ItemsElement extends CustomHTMLBaseElement {
	private items: Item[];

	private itemsBodyElement: HTMLElement;
	private subtotalValueElement: HTMLElement
	private taxAmountValueElement: HTMLElement
	private totalValueElement: HTMLElement

	constructor() {
		super();
	}

	componentDidMount() {
		this.itemsBodyElement = this.getChildElement('#items-body');
		this.subtotalValueElement = this.getChildElement('#subtotal-value');
		this.taxAmountValueElement = this.getChildElement('#tax-amount-value');
		this.totalValueElement = this.getChildElement('#total-value');
	}

	initComponent(items: Item[], currency: string) {
		this.items = items;
		var subTotal = 0
		var taxAmmount = 0;
		var totalAmmount = 0;

		DomUtility.removeAllChildren(this.itemsBodyElement);
		items.forEach(item => {
			subTotal += item.netTotalAmount;
			taxAmmount += item.taxAmount;
			totalAmmount += item.grossTotalAmount;

			const row = document.createElement('tr');
			const itemNameCol = document.createElement('td');
			const quantityCol = document.createElement('td');
			const unitPriceCol = document.createElement('td');
			const taxRateCol = document.createElement('td');
			const amountCol = document.createElement('td');
			itemNameCol.innerHTML = item.name;
			quantityCol.innerHTML = item.quantity.toString();;
			unitPriceCol.innerHTML = `${ArithmeticUtility.formatDecimal(item.unitPrice)} ${currency}`;
			taxRateCol.innerHTML = `${ArithmeticUtility.formatDecimal(item.taxRate)} %`;
			amountCol.innerHTML = `${ArithmeticUtility.formatDecimal(item.grossTotalAmount)} ${currency}`;
			row.appendChild(itemNameCol);
			row.appendChild(quantityCol);
			row.appendChild(unitPriceCol);
			row.appendChild(taxRateCol);
			row.appendChild(amountCol);
			this.itemsBodyElement.appendChild(row);
		});

		this.subtotalValueElement.innerHTML = `${ArithmeticUtility.formatDecimal(subTotal)} ${currency}`;
		this.taxAmountValueElement.innerHTML = `${ArithmeticUtility.formatDecimal(taxAmmount)} ${currency}`;
		this.totalValueElement.innerHTML = `${ArithmeticUtility.formatDecimal(totalAmmount)} ${currency}`;
	}

}