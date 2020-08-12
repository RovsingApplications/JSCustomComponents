import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../../Elements/CustomHTMLBaseElement";
import CustomerSearchResult from "../../Framework/Models/CustomerSearchResult";
import CustomTable from "../Table/CustomTable";
import DomUtility from "../../Framework/Utilities/DomUtility";
import Colors from "../../Framework/Constants/Colors";
import Customer from "../../Framework/Models/Customer";
import PaginatorElement from "../Paginator/PaginatorElement";
import ElementsCreator from "../../Framework/Utilities/ElementsCreator";
import SearchCustomersService from "../../Framework/Services/SearchCustomersService";

@CustomElement({
	selector: 'esignatur-branding-admin-search-results-table',
	template: `
		<div id="loading-element-wrapper"></div>
		<div id="custom-table-wrapper"></div>
		<div id="paginator-wrapper"></div>
	`,
	style: `
		#custom-table-wrapper {
			font-family: sans-serif;
		}
		#paginator-wrapper {
			padding: 20px 0;
			display: flex;
			justify-content: center;
		}
	`,
	useShadow: true,
})
export default class SearchResultsTable extends CustomHTMLBaseElement {

	private loadingElementWrapper: HTMLElement;
	private customTableWrapper: HTMLElement;
	private paginatorWrapper: HTMLElement;
	private paginatorElement: PaginatorElement = new PaginatorElement();
	private customTable: CustomTable;
	private tableHeaders = ['Id', 'ApiKey', 'Name', 'Department'];
	private customerSearchResult: CustomerSearchResult;
	private customerClick = new Event('customerclick');
	private currentPage = 1;
	private pageSize = 5;
	private lastSearchedText: string;

	public lastClickedCustomer: Customer;

	constructor() {
		super();
	}

	componentDidMount() {
		this.loadingElementWrapper = this.getChildElement('#loading-element-wrapper');
		this.customTableWrapper = this.getChildElement('#custom-table-wrapper');
		this.paginatorWrapper = this.getChildElement('#paginator-wrapper');
		this.bindEvents();
	}

	private bindEvents() {
		this.paginatorElement.addEventListener('pageClicked', (event) => {
			this.currentPage = this.paginatorElement.lastClickedPageNumber;
			this.searchByName(this.lastSearchedText);
		});
		this.paginatorElement.addEventListener('pageSizeChanged', (event) => {
			this.pageSize = this.paginatorElement.pageSize;
			if (this.currentPage > this.paginatorElement.numberOfPages) {
				this.currentPage = this.paginatorElement.numberOfPages;
			}
			this.searchByName(this.lastSearchedText);
		});
	}

	searchByName(nameSearchText: string) {
		return new Promise((resolve, reject) => {
			if (nameSearchText.trim() === '') {
				reject();
			}
			const loadingElement = ElementsCreator.generateOverlayWithLoadingDots(100);
			DomUtility.fillContent(this.loadingElementWrapper, loadingElement);
			new SearchCustomersService()
				.searchByName(nameSearchText, this.currentPage, this.pageSize)
				.then(res => {
					loadingElement.remove();
					const customerSearchResult = new CustomerSearchResult(JSON.parse(res as string));
					if (customerSearchResult.totalResults === 0) {
						this.emptyTable();
						reject('NoResults');
					}
					this.lastSearchedText = nameSearchText;
					this.customerSearchResult = customerSearchResult;
					this.renderTable(customerSearchResult);
					resolve();
				}).catch(ex => {
					console.error(ex);
					loadingElement.remove();
					this.emptyTable();
					reject('Exception');
				});
		});
	}

	private renderTable(customerSearchResult: CustomerSearchResult) {
		this.customTable = new CustomTable();
		DomUtility.fillContent(this.customTableWrapper, this.customTable);
		this.addCustomTableStyling();
		this.customTable.setHeaders(this.tableHeaders);

		customerSearchResult.customers.forEach(customer => {
			const tableRow: Array<string | HTMLElement> = [
				customer.id.toString(),
				customer.apiKey,
				customer.senderName,
				customer.department
			];
			this.customTable.addRow(tableRow, false, customer.id.toString());
		});
		this.bindRowClickEvent();
		this.renderPaginator();
	}

	private renderPaginator() {
		if (!this.getChildElement('paginator-element')) {
			DomUtility.fillContent(this.paginatorWrapper, this.paginatorElement);
		}
		this.paginatorElement.currentPage = this.currentPage;
		this.paginatorElement.totalItemsCount = this.customerSearchResult.totalResults;
	}

	emptyTable() {
		DomUtility.removeAllChildren(this.customTableWrapper);
	}

	private bindRowClickEvent() {
		this.customTable.addEventListener('rowclick', () => {
			this.lastClickedCustomer = this.customerSearchResult.customers.find(c => c.id.toString() === this.customTable.lastclickedRowId);
			this.dispatchEvent(this.customerClick);
		});
	}

	private addCustomTableStyling() {
		const styleElement = document.createElement('style');
		styleElement.innerHTML = `
			tbody tr {
				cursor: pointer;
			}
			tbody tr:hover {
				background-color: ${Colors.quinary};
			}
		`;
		this.customTable.applyCustomStyle(styleElement);
	}

}