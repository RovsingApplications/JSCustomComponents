import EsignaturInputElement from "../../EsignaturInputElement";
import CustomElement from "../../CustomElement";
import IOptionsItem from "../../models/IOptionsItem";
import Constants from "../../Constants";
import DomUtil from "../../Utilities/DomUtil";

@CustomElement({
	selector: 'typeahead-element',
	template: `
<div class="wrapper custom-element typeahead-element">
	<label class="title" for="autocomplete-input"></label>
	<input class="value" type="text" id="autocomplete-input" />` +
		//<p class="description"></p>
		`<span class="error"></span>
	<ul id="autocomplete-results" style="display: none;"></ul>
</div>`,
	style: `${Constants.stylingInput}
	.typeahead-element input, .wrapper ul {
		width: 100%; }
	.typeahead-element ul {
		list-style-type: none;
		background: #fff;
		padding: 0;
		margin: 0;
		max-height: 300px;
		overflow-y: auto;
		margin-top: 5px;
		border-radius: 4px;
		-webkit-box-shadow: 0px 0px 5px 2px #e0e0e0;
		-moz-box-shadow: 0px 0px 5px 2px #e0e0e0;
		box-shadow: 0px 0px 5px 2px #e0e0e0; }
	.typeahead-element ul p {
		margin: 0;
		padding: 0; }
	.typeahead-element ul li {
		property-events: auto;
		padding: 15px;
		margin: 0;
		cursor: pointer;
		border-bottom: 1px solid #dddddd; }
	.typeahead-element ul li:last-child {
		border-bottom: 0; }
	.typeahead-element ul li .name {
		font-weight: 600;
		font-size: 14px;
		color: #325d77;
		margin-bottom: 5px; }
	.typeahead-element ul li .description {
		font-size: 13px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis; }
	`,
	useShadow: true
})
class TypeaheadElement extends EsignaturInputElement {
	resultViewId: string;
	autoCompleteId: string;
	css: string;
	autoCompleteInput: HTMLInputElement;
	resultView: HTMLUListElement;
	isEventListenerAttached: any;
	clickEvent: EventListenerOrEventListenerObject;
	label: HTMLLabelElement;
	dependencyElements: any;
	//description: HTMLParagraphElement;
	error: HTMLSpanElement;
	wrapper: HTMLDivElement;

	constructor() {
		super();
		this.resultViewId = 'autocomplete-results';
		this.autoCompleteId = 'autocomplete-input';
	}

	get value() {
		return this.getValue;
	}

	connectedCallback(): void {
		this.getElementData();
		this.label = this.shadowRoot.querySelector('label');
		this.label.textContent = this.fieldData.title
		this.error = this.shadowRoot.querySelector('span');
		this.wrapper = this.shadowRoot.querySelector('.wrapper');
		//this.description = this.shadowRoot.querySelector('p');
		//this.description.textContent = this.fieldData.description
		this.autoCompleteInput = this.shadowRoot.querySelector('input') as HTMLInputElement;
		this.setAutoCompleteInput(this.autoCompleteInput);
		this.resultView = this.shadowRoot.querySelector('ul');

		this.autoCompleteInput.addEventListener('keyup', this.showResults.bind(this));
		this.autoCompleteInput.addEventListener('focus', this.showResults.bind(this));
		this.autoCompleteInput.addEventListener('change', this.setDependency.bind(this));
		this.autoCompleteInput.addEventListener('change', this.changeEvent.bind(this));
		this.autoCompleteInput.addEventListener('change', this.validationCheck.bind(this));
		this.setInputLabelListeners();
	}

	setMoveError() {
		if (this.isValid) {
			this.removeError();
			return;
		}
		this.setError();
	}

	validationCheck() {
		setTimeout(this.setMoveError.bind(this), 50);
	}

	setError() {
		this.error.textContent = this.fieldData.customErrorMessage;
		this.wrapper.classList.add('error');
	}

	removeError() {
		this.error.textContent = '';
		this.wrapper.classList.remove('error');
	}

	setAutoCompleteInput(inputElement: HTMLInputElement): void {
		inputElement.setAttribute('name', this.fieldData.fieldName);
		inputElement.value = this.fieldData.value;
	}

	static get observedAttributes() {
		return [];
	}

	isOptionMatch(option, filter): boolean {
		for (let property in option) {
			if (!option[property] || !option[property].toLowerCase) {
				continue;
			}

			if (option[property].toLowerCase().indexOf(filter) > -1) {
				return true;
			}
		}

		return false;
	}

	isEnterKey(event: KeyboardEvent) {
		const key = event.which || event.keyCode;
		if (key === 13) {
			return true;
		}
		return false;
	}

	autoCompleteFilter(filteredValue: string): IOptionsItem[] {
		const filteredResult = [] as IOptionsItem[];
		const filterValues = filteredValue
			.split(' ') // split on space
			.filter(x => x) // remove empty strings
			.map(x => x.toLocaleLowerCase()) as string[];

		this.fieldData.options.forEach(option => {
			for (let filter of filterValues) {
				if (!this.isOptionMatch(option, filter)) {
					return;
				}
			}
			filteredResult.push(option);
		});

		return filteredResult;
	}

	getOptionsElement(option: IOptionsItem): HTMLElement {
		const listElement = document.createElement('li');
		if (option.name) {
			const nameElement = document.createElement('p');
			nameElement.classList.add("name");
			nameElement.textContent = option.name;
			listElement.appendChild(nameElement);
		}

		if (option.description) {
			const descriptionElement = document.createElement('p');
			descriptionElement.classList.add("description");
			descriptionElement.textContent = option.description;
			listElement.appendChild(descriptionElement);
		}

		return listElement;
	}

	sortResult(a, b): number {
		if (a.name < b.name) {
			return -1;
		}

		if (a.name > b.name) {
			return 1;
		}

		return 0;
	}

	isOutsideClick(eventElement: HTMLElement): boolean {
		const targetDomUtil = new DomUtil(eventElement);

		const resultView = targetDomUtil.getClosest(`#${this.resultViewId}`);
		const isInResultView = (resultView === this.resultView);
		if (!isInResultView) {
			return true;
		}

		const listElement = targetDomUtil.getClosest('li');
		if (!listElement) {
			return true;
		}

		return false;
	}

	selectOption(event: Event): void {
		event.stopPropagation();
		const targetElement = event.target as HTMLElement;
		if (this.isOutsideClick(targetElement)) {
			this.hideResults();
			return;
		}

		const targetDomUtil = new DomUtil(targetElement);
		const listElement = targetDomUtil.getClosest('li');
		const name = listElement.querySelector('.name');
		this.setinputValue(name.textContent);
	}

	setinputValue(value: string) {
		this.autoCompleteInput.value = value;
		this.saveChanges();
		this.hideResults();
		this.validationCheck();
		this.setLabelPosition(null);
	}

	hideResults(): void {
		this.resultView.innerHTML = '';
		this.resultView.style.display = 'none';
		if (this.isEventListenerAttached) {
			window.removeEventListener('click', this.clickEvent);
			this.isEventListenerAttached = false;
		}
	}

	selectFirstResult() {
		const listElement = this.resultView.querySelector('li');
		const name = listElement.querySelector('.name');
		this.autoCompleteInput.value = name.textContent;
		this.saveChanges();
		this.hideResults();
		this.validationCheck();
	}

	showResults(event: KeyboardEvent): void {
		if (this.isEnterKey(event)) {
			this.selectFirstResult();
			this.hideResults();
			return;
		}
		const value = this.autoCompleteInput.value;
		this.hideResults();
		/*if (!value) {
			return;
		}*/
		const optionsResult = this.autoCompleteFilter(value);
		if (optionsResult.length === 1) {
			if (optionsResult[0].name === value) {
				this.setinputValue(optionsResult[0].name);
			}
		}
		const sortedResults = optionsResult.sort(this.sortResult);
		const listElements = sortedResults.map(x => this.getOptionsElement(x));
		listElements.forEach(element => {
			this.resultView.appendChild(element);
			element.addEventListener('click', this.selectOption.bind(this));
		});
		this.resultView.style.display = 'block';
		setTimeout(() => {
			if (!this.isEventListenerAttached) {
				this.clickEvent = this.hideResults.bind(this) as EventListenerOrEventListenerObject;
				window.addEventListener('click', this.clickEvent);
				this.isEventListenerAttached = true;
			}
		}, event.type == 'focus' ? 250 : 50);
	}

	get getValue(): string {
		if (!this.autoCompleteInput || this.hidden) return '';
		return this.autoCompleteInput.value;
	}

	set setValue(value: string) {
		if (this.fieldData.options.some(x => x.name === value)) {
			this.autoCompleteInput.value = value;
			return;
		}
		this.autoCompleteInput.value = '';
	}

	get isValid(): boolean {
		const value = this.getValue;

		if (this.fieldData.mandatory && !Boolean(value)) {
			return true;
		}

		return this.fieldData.options.some(x => x.name === value);
	}

	setInputLabelListeners() {
		this.autoCompleteInput.addEventListener('focus', this.setLabelPosition.bind(this));
		this.autoCompleteInput.addEventListener('blur', this.setLabelPosition.bind(this));
		this.autoCompleteInput.addEventListener('change', this.setLabelPosition.bind(this));

		this.setLabelPosition(null);
	}

	setLabelPosition(event): void {
		setTimeout(() => {
			if (!event) {
				if (this.autoCompleteInput.value) {
					this.label.classList.add('input-top');
					return;
				}
				this.label.classList.remove('input-top');
				return;
			}
			if (event.type == 'focus') {
				this.label.classList.add('input-top');
				return;
			}

			if (this.autoCompleteInput.value) {
				this.label.classList.add('input-top');
				return;
			}

			this.label.classList.remove('input-top');
		}, 10);
	}

	getDependencyElements(): HTMLElement[] {
		if (this.dependencyElements) {
			return this.dependencyElements;
		}

		this.dependencyElements = [].slice.call(document.querySelectorAll(`[data-dependency="${this.fieldData.fieldId}"]`));

		return this.dependencyElements;
	}

	setDependency(): void {
		this.getDependencyElements().forEach(element => {
			if (element.getAttribute('data-dependencyvalue') !== this.value) {
				element.style.display = 'none';
				return;
			}

			element.style.display = 'block';
		})
	}
}

export default TypeaheadElement;