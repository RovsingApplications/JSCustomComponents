import CustomTable from "../elements/Table/CustomTable";
import ElementsCreator from "../framework/Utilities/ElementsCreator";
import MakeRequest from "../framework/Utilities/MakeRequest";
import Constants from "../framework/Constants/Constants";
import Parameters from "../framework/Parameters/Parameters";
import ChildCompaniesPage from "../framework/Models/ChildCompaniesAndCount";
import ChildCompany from "../framework/Models/ChildCompany";
import DateUtil from "../framework/Utilities/DateUtil";
import CustomElement from "../framework/custom-element.decorator";
import PaginatorElement from "../elements/Paginator/PaginatorElement";
import * as	XLSX from 'xlsx';
import ChildCompanyCredentials from "../framework/Models/ChildCompanyCredentials";
import Colors from "../framework/Constants/Colors";
import { CustomCheckbox } from "../elements/Elements";
import ChildCompanyTranslations from "../framework/Translations/ChildCompanyTranslations";

@CustomElement({
	selector: 'child-companies-custom-table',
	template: `
		<div id="action-bar-wrapper"></div>
		<div id="custom-table-wrapper"></div>
		<div id="paginator-wrapper"></div>
	`,
	style: `
		@import url('https://fonts.googleapis.com/css?family=Roboto');

		* {
			font-family: Roboto, sans-serif;
		}

		#action-bar-wrapper {
			margin: 0 0 10px 0;
			padding: 0 12px;
			border-radius: 3px;
			background-color: ${Colors.tertiary};
			min-height: 30px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}

		#action-bar-wrapper .download-button {
			border: none;
			background-color: transparent;
			outline: unset;
			cursor: pointer;
			color: ${Colors.primary};
		}
		#action-bar-wrapper .download-button:hover {
			color: ${Colors.secondary};
		}
		#action-bar-wrapper .download-button:disabled {
			color: ${Colors.primary};
			opacity: 0.6;
		}

		#paginator-wrapper {
			display: flex;
			justify-content: center;
		}
	`,
	useShadow: true,
})
export default class ChildCompaniesTable extends HTMLElement {
	private apiKey = Parameters.apiKey;
	private apiUrl = Parameters.apiUrl;
	private childCompanies: ChildCompany[];
	private brandingsExists: boolean;
	private _currentPage: number = 1;
	private allChildCompaniesCount: number;
	private pageSize: number = 5;
	private childCompaniesTableWrapper: HTMLElement;
	private paginatorWrapper: HTMLElement;
	private paginatorElement: PaginatorElement = new PaginatorElement();
	private customTable: CustomTable;
	private customTableWrapper: HTMLElement;
	private actionBarWrapper: HTMLElement;
	private errorEvent = new Event('error');
	private checkedCheckboxes: CustomCheckbox[];

	constructor() {
		super();
	}

	get currentPage() {
		return this._currentPage;
	}

	get numberOfRows() {
		if (this.customTable) {
			return this.customTable.numberOfRows;
		}
	}

	componentDidMount() {
		this.paginatorWrapper = this.getChildElement('#paginator-wrapper');
		this.customTableWrapper = this.getChildElement('#custom-table-wrapper');
		this.actionBarWrapper = this.getChildElement('#action-bar-wrapper');
		this.bindEvents();
	}

	private bindEvents() {
		this.paginatorElement.addEventListener('pageClicked', (event) => {
			this._currentPage = this.paginatorElement.lastClickedPageNumber;
			this.renderTable(this.childCompaniesTableWrapper, this.brandingsExists, this._currentPage, this.pageSize);
		});
		this.paginatorElement.addEventListener('pageSizeChanged', (event) => {
			this.pageSize = this.paginatorElement.pageSize;
			if (this._currentPage > this.paginatorElement.numberOfPages) {
				this._currentPage = this.paginatorElement.numberOfPages;
			}
			this.renderTable(this.childCompaniesTableWrapper, this.brandingsExists, this._currentPage, this.pageSize);
		});
	}

	public renderTable(childCompaniesTableWrapper: HTMLElement, brandingsExists: boolean, pageNumber = 1, pageSize = 5) {
		return new Promise((resolve, reject) => {
			this._currentPage = pageNumber;
			this.pageSize = pageSize;
			this.brandingsExists = brandingsExists;
			this.childCompaniesTableWrapper = childCompaniesTableWrapper;

			const tableOverlay = ElementsCreator.generateOverlayWithLoadingDots(100);
			childCompaniesTableWrapper.appendChildElement(tableOverlay);
			const headerName = Constants.collaboratorOnboardingApiKeyHeaderName;
			new MakeRequest(
				`${this.apiUrl}api/CollaboratorOnboarding/ChildCompaniesPage?pageNumber=${pageNumber}&pageSize=${pageSize}`,
				'get', { [headerName]: this.apiKey }
			).send().then(res => {
				childCompaniesTableWrapper.removeChildElement(tableOverlay);
				let childCompaniesPage: ChildCompaniesPage;
				childCompaniesPage = JSON.parse(res as string);
				this.childCompanies = childCompaniesPage.childCompanies;
				this.allChildCompaniesCount = childCompaniesPage.allChildCompaniesCount;
				if (!this.allChildCompaniesCount || !this.childCompanies || this.childCompanies.length === 0) {
					const noRecords = document.createElement('div');
					noRecords.classList.add('no-records');
					noRecords.innerHTML = 'Ingen tidligere anmodninger';
					childCompaniesTableWrapper.fillContent(noRecords);
					return;
				}

				if (!childCompaniesTableWrapper.hasChildElement(this)) {
					childCompaniesTableWrapper.fillContent(this);
				}

				this.renderActionBar();

				const headerCheckbox = new CustomCheckbox();
				headerCheckbox.classList.add('header-checkbox');
				headerCheckbox.addEventListener('change', () => {
					this.headerCheckboxChanged();
				});
				const headerCheckboxWrapper = document.createElement('span');
				headerCheckboxWrapper.appendChildElement(headerCheckbox);
				headerCheckboxWrapper.style.display = 'flex';
				headerCheckboxWrapper.style.alignItems = 'center';
				headerCheckboxWrapper.style.justifyContent = 'flex-end';

				var tableHeaders: Array<string | HTMLElement>;
				if (brandingsExists) {
					tableHeaders = ['Kundenavn', 'Virk Nr.', 'CVR', 'Email', 'Afdeling', 'Branding', 'Oprettet kl', headerCheckboxWrapper];
				} else {
					tableHeaders = ['Kundenavn', 'Virk Nr.', 'CVR', 'Email', 'Afdeling', 'Oprettet kl', headerCheckboxWrapper];
				}
				this.customTable = new CustomTable();
				this.customTableWrapper.fillContent(this.customTable);
				this.addCustomTableStyling();
				this.customTable.setHeaders(tableHeaders);
				this.childCompanies.forEach(childCompany => {
					this.addChildCompanyRow(childCompany);
				});
				if (!this.getChildElement('paginator-element')) {
					this.paginatorWrapper.fillContent(this.paginatorElement);
				}
				this.paginatorElement.currentPage = pageNumber;
				this.paginatorElement.totalItemsCount = this.allChildCompaniesCount;
				resolve();
			}).catch(exception => {
				console.log(exception);
				childCompaniesTableWrapper.removeChildElement(tableOverlay);
				this.dispatchEvent(this.errorEvent);
				const errorElement = ElementsCreator.generateErrorBlock();
				this.childCompaniesTableWrapper.fillContent(errorElement);
			});
		});
	}

	addChildCompanyRow(childCompany: ChildCompany, insertOnTop = false, animation = false, incrementPaginator = false, appendToChildCompanies = false) {
		const infoIcon = ElementsCreator.generateInfoSVG();
		infoIcon.addEventListener('click', () => {
			this.displayRowDetails(childCompany);
		});

		const checkbox = new CustomCheckbox();
		checkbox.setAttribute('data-child-company-id', childCompany.id);
		checkbox.classList.add('child-company-checkbox');
		checkbox.addEventListener('change', () => {
			this.rowCheckboxChanged();
		});

		const actionsWrapper = document.createElement('span');
		actionsWrapper.appendChildElement(infoIcon);
		actionsWrapper.appendChildElement(checkbox);
		actionsWrapper.style.display = 'flex';
		actionsWrapper.style.alignItems = 'center';
		actionsWrapper.style.justifyContent = 'space-between';

		let tableRow: Array<string | HTMLElement>;
		if (this.brandingsExists) {
			tableRow = [
				childCompany.senderName,
				childCompany.customerNumber ? childCompany.customerNumber : '-',
				childCompany.cvr,
				childCompany.email,
				childCompany.department,
				childCompany.branding ? childCompany.branding.key : '-',
				DateUtil.format(new Date(childCompany.createdAt)),
				actionsWrapper
			];
		} else {
			tableRow = [
				childCompany.senderName,
				childCompany.customerNumber,
				childCompany.cvr,
				childCompany.email,
				childCompany.department,
				DateUtil.format(new Date(childCompany.createdAt)),
				actionsWrapper
			];
		}
		this.customTable.addRow(tableRow, insertOnTop, animation, childCompany.id);
		if (incrementPaginator) {
			this.paginatorElement.totalItemsCount++;
			if (this.customTable.numberOfRows > this.pageSize) {
				this.customTable.removeRow(this.pageSize);
			}
		}
		if (appendToChildCompanies) {
			this.childCompanies.push(childCompany);
		}
	}

	displayRowDetails(childCompany: ChildCompany) {
		const detailsTable = new CustomTable();
		const modal = ElementsCreator.generateModal(detailsTable, childCompany.senderName);
		this.childCompaniesTableWrapper.parentElement.append(modal);
		detailsTable.addRow(['ApiKey', childCompany.apiKey]);
		detailsTable.addRow(['CreatorId', childCompany.creatorId]);
		detailsTable.addRow(['Email', childCompany.email]);
	}

	public animateFirstRow() {
		this.customTable.animateRowByIndex(1);
	}

	private addCustomTableStyling() {
		const styleElement = document.createElement('style');
		styleElement.innerHTML = `
			#table-wrapper {
				max-height: 500px;
				overflow: auto;
				margin-bottom: 20px;
			}
		`;
		this.customTable.applyCustomStyle(styleElement);
	}

	private renderActionBar() {
		const downloadCredentialsButton = document.createElement('button');
		downloadCredentialsButton.classList.add('download-button');
		downloadCredentialsButton.innerHTML = 'Download credentials';
		this.actionBarWrapper.fillContent(downloadCredentialsButton);
		downloadCredentialsButton.onclick = () => {
			downloadCredentialsButton.disabled = true;
			const downloadSVG = ElementsCreator.generateDownloadSVG(30);
			this.actionBarWrapper.appendChildElement(downloadSVG);

			const headerName = Constants.collaboratorOnboardingApiKeyHeaderName;
			new MakeRequest(
				`${this.apiUrl}api/CollaboratorOnboarding/ChildCompaniesCredentials`,
				'get', { [headerName]: this.apiKey }
			).send().then(res => {
				downloadSVG.remove();
				downloadCredentialsButton.disabled = false;
				var credentials: ChildCompanyCredentials[] = JSON.parse(res as string);
				const workBook = XLSX.utils.book_new();
				const workSheet = XLSX.utils.json_to_sheet(credentials);
				XLSX.utils.book_append_sheet(workBook, workSheet, 'all credentials');
				XLSX.writeFile(workBook, 'credentials.xlsx');
			}).catch(exception => {
				console.log(exception);
				downloadSVG.remove();
				downloadCredentialsButton.disabled = false;
				const errorSnackbar = ElementsCreator.generateSnackbar('Filen kunne ikke downloades !');
				this.childCompaniesTableWrapper.parentElement.append(errorSnackbar);
				setTimeout(() => {
					errorSnackbar.remove();
				}, 3000);
			});

		};
	}

	private rowCheckboxChanged() {
		const headerCheckbox = this.customTable.getChildElement<CustomCheckbox>('.header-checkbox');
		const checkboxes = this.customTable.getChildElements<CustomCheckbox>('.child-company-checkbox');

		this.checkedCheckboxes = checkboxes.filter(checkbox => checkbox.checked);
		if (this.checkedCheckboxes.length === checkboxes.length) {
			headerCheckbox.checked = true;
		} else {
			headerCheckbox.checked = false;
		}
		var downloadSelectedCredentialsButton: HTMLButtonElement;
		downloadSelectedCredentialsButton = this.getChildElement('#download-selected-button');
		if (this.checkedCheckboxes.length === 0) {
			if (downloadSelectedCredentialsButton) {
				downloadSelectedCredentialsButton.remove();
			}
		}
		if (this.checkedCheckboxes.length > 0) {
			var downloadSelectedCredentialsButton: HTMLButtonElement;
			downloadSelectedCredentialsButton = this.getChildElement('#download-selected-button');
			if (!downloadSelectedCredentialsButton) {
				downloadSelectedCredentialsButton = document.createElement('button');
				downloadSelectedCredentialsButton.classList.add('download-button');
				downloadSelectedCredentialsButton.id = 'download-selected-button';
				downloadSelectedCredentialsButton.innerHTML = 'Download valgte credentials';
				this.actionBarWrapper.insertAdjacentElement('afterbegin', downloadSelectedCredentialsButton);

				downloadSelectedCredentialsButton.onclick = () => {
					this.exportSelectedCredentials();
				}
			}
		}
	}

	private headerCheckboxChanged() {
		const headerCheckbox = this.customTable.getChildElement<CustomCheckbox>('.header-checkbox');
		const checkboxes = this.customTable.getChildElements<CustomCheckbox>('.child-company-checkbox');
		checkboxes.forEach(checkbox => {
			checkbox.checked = headerCheckbox.checked;
		});
		this.rowCheckboxChanged();
	}

	private exportSelectedCredentials() {
		const selectedChildCompanies = this.childCompanies.filter(childCompany => {
			return this.checkedCheckboxes.findIndex(checkbox => checkbox.dataset['childCompanyId'] === childCompany.id) !== -1;
		});
		const selectedCredentials = selectedChildCompanies.map(childCompany => {
			return ChildCompanyTranslations.ToChildCompanyCredentials(childCompany);
		});
		const workBook = XLSX.utils.book_new();
		const workSheet = XLSX.utils.json_to_sheet(selectedCredentials);
		XLSX.utils.book_append_sheet(workBook, workSheet, 'credentials');
		XLSX.writeFile(workBook, 'credentials.xlsx');
	}

}
