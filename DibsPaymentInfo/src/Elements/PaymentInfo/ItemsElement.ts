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
							<td><span data-translate="ItemsElement.Item"></span></td>
							<td><span data-translate="ItemsElement.Qty"></span></td>
							<td><span data-translate="ItemsElement.UnitPrice"></span></td>
							<td id="item-tax-column"><span data-translate="ItemsElement.TaxRate"></span></td>
							<td><span data-translate="ItemsElement.Amount"></span></td>
						</tr>
					</thead>
					<tbody id="items-body">
					</tbody>
				<table>
				<table class="total">
					<tr id="subtotal-row">
						<td><span data-translate="ItemsElement.Subtotal"></span></td>
						<td id="subtotal-value"></td>
					</tr>
					<tr id="total-tax-row">
						<td><span data-translate="ItemsElement.Tax"></span></td>
						<td id="tax-amount-value"></td>
					</tr>
					<tr class="total-row">
						<td><span data-translate="ItemsElement.Total"></span></td>
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
	private taxColumnElement: HTMLElement;
	private subtotalRowElement: HTMLElement;
	private totalTaxRowElement: HTMLElement;

	constructor() {
		super();
	}

	componentDidMount() {
		super.componentDidMount();

		this.itemsBodyElement = this.getChildElement('#items-body');
		this.subtotalValueElement = this.getChildElement('#subtotal-value');
		this.taxAmountValueElement = this.getChildElement('#tax-amount-value');
		this.totalValueElement = this.getChildElement('#total-value');
		this.taxColumnElement = this.getChildElement('#item-tax-column');
		this.subtotalRowElement = this.getChildElement('#subtotal-row');
		this.totalTaxRowElement = this.getChildElement('#total-tax-row');
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
			taxRateCol.classList.add('tax-item-column-value');
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
		
		if (taxAmmount === 0) {
			this.hideTaxElements();
		}
	}

	hideTaxElements() {
		this.taxColumnElement.style.display = 'none';
		this.subtotalRowElement.style.display = 'none';
		this.totalTaxRowElement.style.display = 'none';

		const taxColumnValues = this.getChildElements<HTMLElement>('.tax-item-column-value');
		taxColumnValues.forEach(elem => elem.style.display = 'none');
	}

}