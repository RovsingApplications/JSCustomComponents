import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../../Elements/CustomHTMLBaseElement";
import { CustomerSearchCriteriaEnum } from "../../Framework/Models/CustomerSearchCriteriaEnum";
import SearchTypeRadioElement from "./SearchTypeRadioElement";
import FloatingLabelInputElement from "../FloatingLabel/FloatingLabelInputElement";
import { MobileSize } from "../../framework/Constants/Constants";
import SVGs from "../../Framework/Constants/SVGs";
import Globals from "../../Framework/Globals/Globals";
import ElementsCreator from "../../Framework/Utilities/ElementsCreator";
import DomUtility from "../../Framework/Utilities/DomUtility";
import Customer from "../../Framework/Models/Customer";
import SearchResultsTable from "./SearchResultsTable";
import CustomerNameAutoCompleteElement from "./CustomerNameAutoCompleteElement";
import SearchCustomersService from "../../Framework/Services/SearchCustomersService";

@CustomElement({
	selector: 'esignatur-branding-admin-search-customer-element',
	template: `
		<div id="search-customer-element">
			<div class="search-input-wrapper">
				<esignatur-branding-admin-floating-label-input
					id="customer-id-search"
					label="Søg efter kunde-id"
					number-input="true"
				>
					<esignatur-branding-admin-search-icon-element slot="postfix" position="right">
						${SVGs.lensSVG}
					</esignatur-branding-admin-search-icon-element>
				</esignatur-branding-admin-floating-label-input>

				<esignatur-branding-admin-customer-name-autocomplete></esignatur-branding-admin-customer-name-autocomplete>
			</div>
			<div id="search-criteria-wrapper">
				<esignatur-branding-admin-search-type-radio-input
					id="search-criteria"
					value="${CustomerSearchCriteriaEnum.byName}"
				></esignatur-branding-admin-search-type-radio-input>
			</div>
			<div id="search-results-wrapper">
				<esignatur-branding-admin-search-results-table></esignatur-branding-admin-search-results-table>
			</div>
			<div id="branding-modal-container"></div>
			<div id="error-popup-container"></div>
		</div>
	`,
	style: `
		#search-customer-element {
			position: relative;
			height: 100%;
		}
		.search-input-wrapper {
			padding: 20px;
		}
		#search-criteria-wrapper {
			margin: 10px auto;
		}
		#search-results-wrapper {
			margin-top: 50px;
			max-height: calc(100% - 200px);
			overflow: auto;
		}
		@media only screen and (max-width: ${MobileSize}) {
			.search-input-wrapper {
				margin: 0;
			}
		}
	`,
	useShadow: true,
})
export default class SearchCustomerElement extends CustomHTMLBaseElement {

	private searchByIdElement: FloatingLabelInputElement;
	private nameAutocompleteElement: CustomerNameAutoCompleteElement;
	private searchCriteriaElement: SearchTypeRadioElement;
	private searchResultsWrapper: HTMLElement;
	private searchResultsTable: SearchResultsTable;
	private brandingModalContainer: HTMLElement;
	private errorPopupContainer: HTMLElement;
	private isLoading = false;

	constructor() {
		super();
	}

	componentDidMount() {
		this.searchByIdElement = this.getChildElement('#customer-id-search');
		this.nameAutocompleteElement = this.getChildElement('esignatur-branding-admin-customer-name-autocomplete');
		this.searchCriteriaElement = this.getChildElement('#search-criteria');
		this.searchResultsWrapper = this.getChildElement('#search-results-wrapper');
		this.searchResultsTable = this.getChildElement('esignatur-branding-admin-search-results-table');
		this.brandingModalContainer = this.getChildElement('#branding-modal-container');
		this.errorPopupContainer = this.getChildElement('#error-popup-container');
		this.activateSearchByName();

		this.bindEvents();
	}

	private bindEvents() {
		this.searchCriteriaElement.addEventListener('change', () => {
			if (this.searchCriteriaElement.value === CustomerSearchCriteriaEnum.byName.toString()) {
				this.activateSearchByName();
			}
			if (this.searchCriteriaElement.value === CustomerSearchCriteriaEnum.byId.toString()) {
				this.activateSearchById();
			}
		});

		this.nameAutocompleteElement.addEventListener('search', () => {
			this.searchByName(this.nameAutocompleteElement.value);
		});

		this.searchByIdElement.addEventListener('postfixclicked', () => {
			this.searchById();
		});
		this.searchByIdElement.addEventListener('inputenter', () => {
			this.searchById();
		});

		this.searchResultsTable.addEventListener('customerclick', () => {
			this.displayBrandingModal(this.searchResultsTable.lastClickedCustomer);
		});

		this.nameAutocompleteElement.addEventListener('customerclick', () => {
			this.displayBrandingModal(this.nameAutocompleteElement.lastClickedCustomer);
			this.nameAutocompleteElement.blur();
		});
	}

	private activateSearchByName() {
		this.nameAutocompleteElement.style.display = 'block';
		this.searchByIdElement.style.display = 'none';
		this.searchResultsWrapper.style.display = 'block';
		this.nameAutocompleteElement.focus();
	}
	private activateSearchById() {
		this.searchByIdElement.style.display = 'block';
		this.nameAutocompleteElement.style.display = 'none';
		this.searchResultsWrapper.style.display = 'none';
		this.searchByIdElement.focus();
	}

	private searchByName(nameSearchText: string) {
		if (this.isLoading) {
			return;
		}
		this.isLoading = true;
		this.searchResultsWrapper.style.display = 'block';
		this.searchResultsTable.searchByName(nameSearchText).then(() => {
			this.isLoading = false;
			this.nameAutocompleteElement.blur();
			this.removeErrorBlock();
		}).catch((error: string) => {
			this.isLoading = false;
			this.searchResultsWrapper.style.display = 'none';
			if (error === 'NoResults') {
				this.displayNoResults();
			}
			if (error === 'Exception') {
				this.displayError();
			}
		});
	}

	private searchById() {
		if (this.isLoading) {
			return;
		}
		const customerId = this.searchByIdElement.value.trim();
		if (customerId === '') {
			return;
		}
		this.isLoading = true;
		const loadingElement = ElementsCreator.generateOverlayWithLoadingDots(100);
		this.brandingModalContainer.appendChild(loadingElement);
		new SearchCustomersService()
			.searchById(customerId)
			.then(res => {
				this.isLoading = false;
				loadingElement.remove();
				if (!res) {
					this.displayNoResults();
					return;
				}
				this.searchByIdElement.blur();
				const customer = new Customer(JSON.parse(res as string));
				this.removeErrorBlock();
				this.displayBrandingModal(customer);
			}).catch(ex => {
				console.error(ex);
				this.isLoading = false;
				loadingElement.remove();
				this.displayError();
			});
	}

	private displayError(errorText?: string) {
		const errorElement = ElementsCreator.generateErrorBlock(errorText);
		DomUtility.fillContent(this.errorPopupContainer, errorElement);
	}

	private displayNoResults() {
		this.displayError('Ingen resultater fundet');
	}

	private removeErrorBlock() {
		DomUtility.removeAllChildren(this.errorPopupContainer);
	}

	private displayBrandingModal(customer: Customer) {
		const brandingElement = document.createElement('esignatur-branding');
		brandingElement.setAttribute('api-key', customer.apiKey);
		brandingElement.setAttribute('api-url', Globals.brandingBaseURL);
		const modal = ElementsCreator.generateModal(brandingElement, customer.senderName);
		DomUtility.fillContent(this.brandingModalContainer, modal);
	}


}