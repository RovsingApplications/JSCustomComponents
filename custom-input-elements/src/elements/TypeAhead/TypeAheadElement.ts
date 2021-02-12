import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import OptionWithDescription from '../../framework/Models/OptionWithDescription';
import DomUtility from '../../framework/Utilities/DomUtility';

@CustomElement({
	selector: 'type-ahead-element',
	template: `
		<div class="wrapper">
			<input type="text" id="text-input">
			<div id="description"></div>
		</div>`,
	style: `
		:host {
			width:100%;
		}
		.wrapper {
			position: relative;
			display:flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		#text-input {
			box-sizing: border-box;
			width: 100% !important;
			border: none;
			background-color: #f1f4ff;
			margin: 2px;
			resize: none;
		}
		.wrapper #description {
			width: 100%;
			padding: 0 2px;
			box-sizing: border-box;
		}
		.options-list {
			position: absolute;
			border: 1px solid #E8E8E8;
			border-bottom: none;
			border-top: none;
			z-index: 3;
			top: 100%;
			left: 0;
			right: 0;
			max-height: 200px;
			overflow-y: auto;
		}
		.options-list-item {
			padding: 10px;
			cursor: pointer;
			background-color: #FFFFFF;
			border-bottom: 1px solid #E8E8E8;
		}
		.options-list-item:hover {
			background-color: #E8E8E8;
		}
		.options-list-item.active {
			/*when navigating through the items using the arrow keys:*/
			background-color: #003E64 !important;
			color: #FFFFFF;
		}
		.options-list-item-title {
			font-size: 16px;
		}
		.options-list-item-description {
			font-size: 10px;
		}
	`,
	useShadow: true,
})
export class TypeAheadElement extends CustomInputElement {

	private textInputElement: HTMLInputElement;
	private descriptionElement: HTMLElement;
	private componentWrapper: HTMLElement;
	private currentFoucsedIndex = -1;

	selectedOption: OptionWithDescription;
	searchResultOptions: OptionWithDescription[] = [];

	constructor() {
		super();
	}

	private get searchHasResults(): boolean {
		const autocompleteList = super.getChildElement('.options-list');
		return autocompleteList && this.optionsWithDescriptions && this.optionsWithDescriptions.length > 0;
	}

	get value(): string {
		if (!this.selectedOption) {
			return null;
		}
		return this.selectedOption.value;
	}

	set value(value: string) {
		if (!this.optionsWithDescriptions || this.optionsWithDescriptions.length === 0) {
			return;
		}
		const option = this.optionsWithDescriptions.find(option => option.value === value);
		if (!option) {
			this.descriptionElement.innerHTML = null;
			return;
		}
		this.selectedOption = option;
		this.textInputElement.value = option.title;
		this.descriptionElement.innerHTML = option.description;
	}

	get valid(): boolean {
		if (this.required) {
			return !!this.selectedOption;
		}
		return !!this.selectedOption || this.textInputElement.value === '';
	}

	connectedCallback(): void {
		super.connectedCallback();
	}

	initChildInputs() {
		this.textInputElement = super.getChildInput('#text-input');
		this.descriptionElement = super.getChildInput('#description');
		this.componentWrapper = super.getChildElement('.wrapper');
		if (this.required) {
			this.textInputElement.setAttribute('required', '');
		}
		this.textInputElement.addEventListener('change', this.change.bind(this));
		this.textInputElement.addEventListener('input', () => {
			this.inputEventHandler();
		});
		this.bindNavigation();
	}

	private inputEventHandler() {
		this.selectedOption = null;
		this.descriptionElement.innerHTML = null;
		this.closeOptionsList();
		this.searchResultOptions = [];
		const searchValue = this.textInputElement.value;
		if (!searchValue || searchValue.trim() === '') {
			return;
		}
		const optionslist = document.createElement('div');
		optionslist.classList.add('options-list');

		if (!this.optionsWithDescriptions) {
			return;
		}
		this.optionsWithDescriptions.forEach((option: OptionWithDescription, index) => {
			var regex = new RegExp(searchValue, 'gi');
			const isMatchingTitle = regex.test(option.title);
			const isMatchingValue = regex.test(option.value);
			const isMatchingDescription = regex.test(option.description);
			if (!isMatchingTitle && !isMatchingValue && !isMatchingDescription) {
				return;
			}
			this.searchResultOptions.push(option);
			const optionsListItem = document.createElement("div");
			optionsListItem.classList.add('options-list-item');
			optionsListItem.dataset['value'] = option.value;
			optionslist.appendChild(optionsListItem);
			const optionsListItemTitle = document.createElement("div");
			optionsListItemTitle.classList.add('options-list-item-title');
			optionsListItemTitle.innerHTML = DomUtility.boldenText(option.title, searchValue);
			optionsListItem.appendChild(optionsListItemTitle);
			const optionsListItemDescription = document.createElement("div");
			optionsListItemDescription.classList.add('options-list-item-description');
			optionsListItemDescription.innerHTML = DomUtility.boldenText(option.description, searchValue);
			optionsListItem.appendChild(optionsListItemDescription);
			optionsListItem.addEventListener('click', () => {
				this.optionSelectedHandler(option);
			});
			this.componentWrapper.appendChild(optionslist);
		});
	}

	private closeOptionsList() {
		this.currentFoucsedIndex = -1;
		const optionsList = super.getChildElement('.options-list');
		if (!optionsList) {
			return;
		}
		optionsList.remove();
	}

	private optionSelectedHandler(option: OptionWithDescription) {
		this.value = option.value;
		this.onChange.emit(new CustomElementEventArgs(this.value, 'change'));
		this.closeOptionsList();
	}

	private bindNavigation() {
		this.textInputElement.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				this.closeOptionsList();
			}
			if (event.key === 'ArrowDown') {
				if (!this.searchHasResults) {
					return;
				}
				this.currentFoucsedIndex = this.currentFoucsedIndex === this.searchResultOptions.length - 1 ? 0 : this.currentFoucsedIndex + 1;
				this.highlightFocusedSearchResult();
			}
			if (event.key === 'ArrowUp') {
				if (!this.searchHasResults) {
					return;
				}
				this.currentFoucsedIndex = this.currentFoucsedIndex === 0 ? this.searchResultOptions.length - 1 : this.currentFoucsedIndex - 1;
				this.highlightFocusedSearchResult();
			}
			if (event.key === 'Enter') {
				if (this.currentFoucsedIndex !== -1 && this.searchHasResults) {
					this.optionSelectedHandler(this.searchResultOptions[this.currentFoucsedIndex]);
					return;
				}
			}
		});
	}

	highlightFocusedSearchResult() {
		const optionListItems = super.getChildElements('.options-list-item');
		if (!optionListItems) {
			return;
		}
		optionListItems.forEach((listItem, index) => {
			listItem.classList.remove('active');
			if (index === this.currentFoucsedIndex) {
				listItem.classList.add('active');
			}
		});
	}

	public change($event): void {
		this.touched = true;
		this.onChange.emit(new CustomElementEventArgs(this.value, 'change'));
	}

	public validate(): void {
		this.valid;
		this.onValidate.emit(
			new CustomElementEventArgs(this.value, 'validate'),
		);
	}
}
