import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../../Elements/CustomHTMLBaseElement";
import SVGs from "../../Framework/Constants/SVGs";
import Colors from "../../Framework/Constants/Colors";
import { FloatingLabelInputElement } from "../..";
import SearchCustomersService from "../../Framework/Services/SearchCustomersService";
import CustomerSearchResult from "../../Framework/Models/CustomerSearchResult";
import Customer from "../../Framework/Models/Customer";
import debouncer from "../../Framework/Utilities/debouncer";
import DomUtility from "../../Framework/Utilities/DomUtility";


// https://www.w3schools.com/howto/howto_js_autocomplete.asp

@CustomElement({
	selector: 'esignatur-branding-admin-customer-name-autocomplete',
	template: `
		<div class="branding-admin-customer-name-autocomplete-wrapper">
			<esignatur-branding-admin-floating-label-input
				id="customer-name-search"
				label="Søg efter kundenavn"
			>
				<esignatur-branding-admin-search-icon-element slot="postfix" position="right">
					${SVGs.lensSVG}
				</esignatur-branding-admin-search-icon-element>
			</esignatur-branding-admin-floating-label-input>
		</div>		
`,
	style: `
		.branding-admin-customer-name-autocomplete-wrapper {
			font-family: sans-serif;
			position: relative;
		}
		.branding-admin-customer-name-autocomplete-wrapper-items {
			position: absolute;
			border: 1px solid ${Colors.quinary};
			border-bottom: none;
			border-top: none;
			z-index: 3;
			top: 100%;
			left: 0;
			right: 0;
		}

		.branding-admin-customer-name-autocomplete-wrapper-items div {
			padding: 10px;
			cursor: pointer;
			background-color: #FFFFFF;
			border-bottom: 1px solid ${Colors.quinary};
		}
		.branding-admin-customer-name-autocomplete-wrapper-items div:hover {
			/*when hovering an item:*/
			background-color: ${Colors.quinary};
		}
		.branding-admin-customer-name-autocomplete-wrapper-item-active {
			/*when navigating through the items using the arrow keys:*/
			background-color: ${Colors.primary} !important;
			color: #FFFFFF;
		}
	`,
	useShadow: true,
})
export default class CustomerNameAutoCompleteElement extends CustomHTMLBaseElement {

	private autocopmpleteWrapper: HTMLElement;
	private searchByNameElement: FloatingLabelInputElement;
	private customers: Customer[];
	private currentFoucsedIndex = -1;
	private customerClick = new Event('customerclick');
	private search = new Event('search');


	lastClickedCustomer: Customer;

	private get searchHasResults(): boolean {
		const autocompleteList = this.getChildElement<HTMLElement>('.branding-admin-customer-name-autocomplete-wrapper-items');
		return autocompleteList && this.customers && this.customers.length > 0;
	}

	get value() {
		return this.searchByNameElement.value;
	}

	constructor() {
		super();
	}

	focus() {
		this.searchByNameElement.focus();
	}

	componentDidMount() {
		this.autocopmpleteWrapper = this.getChildElement('.branding-admin-customer-name-autocomplete-wrapper');
		this.searchByNameElement = this.getChildElement('#customer-name-search');

		this.bindEvents();
	}

	private bindEvents() {
		const debounce = debouncer(this.inputEventHandler.bind(this), 400, false);
		this.searchByNameElement.addEventListener('input', () => {
			debounce();
		});

		this.searchByNameElement.addEventListener('postfixclicked', () => {
			this.dispatchEvent(this.search);
		});

		this.searchByNameElement.addEventListener('blur', () => {
			// find better solution for this - this is a workaround to wait for list item click event
			setTimeout(() => {
				this.closeAutocompleteList();
			}, 300);
		});

		this.bindAutoCompleteNavigation();
	}

	private bindAutoCompleteNavigation() {
		this.searchByNameElement.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				this.closeAutocompleteList();
			}
			if (event.key === 'ArrowDown') {
				if (!this.searchHasResults) {
					return;
				}
				this.currentFoucsedIndex = this.currentFoucsedIndex === this.customers.length - 1 ? 0 : this.currentFoucsedIndex + 1;
				this.highlightFocusedSearchResult();
			}
			if (event.key === 'ArrowUp') {
				if (!this.searchHasResults) {
					return;
				}
				this.currentFoucsedIndex = this.currentFoucsedIndex === 0 ? this.customers.length - 1 : this.currentFoucsedIndex - 1;
				this.highlightFocusedSearchResult();
			}
			if (event.key === 'Enter') {
				if (this.currentFoucsedIndex !== -1 && this.searchHasResults) {
					this.customerSelectedHandler(this.customers[this.currentFoucsedIndex]);
					return;
				}
				this.dispatchEvent(this.search);
			}
		});
	}

	private inputEventHandler() {
		this.closeAutocompleteList();
		if (!this.searchByNameElement.value || this.searchByNameElement.value.trim() === '') {
			return;
		}
		const autocompleteList = document.createElement("div");
		autocompleteList.classList.add('branding-admin-customer-name-autocomplete-wrapper-items');
		this.autocopmpleteWrapper.appendChild(autocompleteList);

		new SearchCustomersService()
			.searchByName(this.searchByNameElement.value)
			.then(res => {
				const customerSearchResult = new CustomerSearchResult(JSON.parse(res as string));
				if (customerSearchResult.totalResults === 0) {
					this.closeAutocompleteList();
					return;
				}
				this.customers = customerSearchResult.customers;
				this.customers.forEach(customer => {
					const autocompleteItem = document.createElement("div");
					const autocompleteItemText = DomUtility.boldenText(customer.senderName, this.searchByNameElement.value);
					autocompleteItem.innerHTML = autocompleteItemText;
					autocompleteItem.addEventListener('click', () => {
						this.customerSelectedHandler(customer);
					})
					autocompleteList.appendChild(autocompleteItem);
				});
			})
			.catch(err => {
				console.error(err);
			});
	}

	private customerSelectedHandler(customer: Customer) {
		this.lastClickedCustomer = customer;
		this.searchByNameElement.value = customer.senderName;
		this.dispatchEvent(this.customerClick);
		this.closeAutocompleteList();
	}

	private highlightFocusedSearchResult() {
		const autocompleteListItems = this.getChildElements<HTMLElement>('.branding-admin-customer-name-autocomplete-wrapper-items div');
		autocompleteListItems.forEach((listItem, index) => {
			listItem.classList.remove('branding-admin-customer-name-autocomplete-wrapper-item-active');
			if (index === this.currentFoucsedIndex) {
				listItem.classList.add('branding-admin-customer-name-autocomplete-wrapper-item-active');
			}
		});
	}

	private closeAutocompleteList() {
		this.currentFoucsedIndex = -1;
		const autocompleteList = this.getChildElement<HTMLElement>('.branding-admin-customer-name-autocomplete-wrapper-items');
		if (!autocompleteList) {
			return;
		}
		autocompleteList.remove();
	}
}