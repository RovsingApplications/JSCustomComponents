import CustomElement from "../../framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Colors from "../../framework/Constants/Colors";

@CustomElement({
	selector: 'custom-table',
	template: `
		<div id="table-wrapper">
			<table class="table">
				<tbody></tbody>
			</table>
		</div>
	`,
	style: `
		:host {
			font-family: sans-serif;
		}
		.table {
			width: 100%;
			margin-bottom: 1rem;
			color: grey;
		}

		.table thead tr td {
			padding: 0.75rem;
		}
		
		.table tbody tr td {
			padding: 0.75rem;
			vertical-align: top;
			border-top: 1px solid #dee2e6;
			text-align: center;
		}
		
		.table tbody tr:first-of-type td {
			border-top: none;
		}


		
		.table thead tr td {
			color: ${Colors.primary};
			vertical-align: bottom;
			border-bottom: 2px solid #dee2e6;
			text-align: center;
		}
	`,
	useShadow: true,
})
export default class CustomTable extends CustomHTMLBaseElement {

	private nativeTable: HTMLTableElement;
	private tableBody: HTMLTableSectionElement;
	private rowClick = new Event('rowclick');

	public numberOfRows = 0;
	public nubmerOfColumns: number;
	public lastclickedRowId: string;


	constructor() {
		super();
	}

	componentDidMount() {
		this.nativeTable = this.getChildElement('.table');
		this.tableBody = this.getChildElement('tbody');
	}

	setHeaders(headers: Array<string | HTMLElement>) {
		this.nubmerOfColumns = headers.length;
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');
		headers.forEach(header => {
			let td = document.createElement('td');
			if (typeof (header) === 'string' || !header) {
				td.innerHTML = header as string;
			} else {
				td.appendChild(header);
			}
			tr.appendChild(td);
		});
		thead.appendChild(tr);
		this.nativeTable.appendChild(thead);
	}

	addRow(cellsValues: Array<string | HTMLElement>, insertOnTop = false, id?: string) {
		const tr = document.createElement('tr');
		cellsValues.forEach(cellValue => {
			let td = document.createElement('td');
			if (typeof (cellValue) === 'string' || !cellValue) {
				td.innerHTML = cellValue as string;
			} else {
				td.appendChild(cellValue);
			}
			tr.appendChild(td);
		});
		if (id) {
			tr.setAttribute('data-id', id);
		}
		if (this.numberOfRows === 0) {
			this.tableBody.appendChild(tr);
		} else if (insertOnTop) {
			this.tableBody.insertBefore(tr, this.tableBody.firstChild);
		} else {
			this.tableBody.insertAdjacentElement('beforeend', tr);
		}
		this.numberOfRows++;

		this.bindClickEvent(tr);
	}

	private bindClickEvent(tr: HTMLElement) {
		tr.onclick = () => {
			this.lastclickedRowId = tr.dataset['id'];
			this.dispatchEvent(this.rowClick);
		}
	}

}
