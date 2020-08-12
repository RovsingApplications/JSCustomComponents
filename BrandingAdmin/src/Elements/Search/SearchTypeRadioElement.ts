import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import Colors from '../../Framework/Constants/Colors';
import { CustomerSearchCriteriaEnum } from '../../Framework/Models/CustomerSearchCriteriaEnum';
import { MobileSize } from '../../framework/Constants/Constants';

@CustomElement({
	selector: 'esignatur-branding-admin-search-type-radio-input',
	template: `
		<div class="search-radio-group">
			<span class="search-radio-container search-radio-container-by-id">
				<input type="radio" value="${CustomerSearchCriteriaEnum.byId}">
				<button class="search-radio-button">
					Søg efter kunde-id
				</button>
			</span>
			<span class="search-radio-container search-radio-container-by-name">
				<input type="radio" value="${CustomerSearchCriteriaEnum.byName}">
				<button class="search-radio-button">
					Søg efter kundenavn
				</button>
			</span>
		</div>
	`,
	style: `
		.search-radio-group {
			display: flex;
			justify-content: space-around;
		}
		.search-radio-container {
			display: flex;
			align-items: center;
			justify-content: center;
			user-select: none;
		}
		.search-radio-container input {
			display: none;
		}
		.search-radio-button {
			padding: 15px;
			background-color: ${Colors.quinary};
			color: ${Colors.secondary};
			border: none;
			cursor: pointer;
			outline: none;
		}
		.search-radio-container input:checked ~ .search-radio-button {
			color: White;
			background-color: ${Colors.primary};
			font-weight: 700;
			letter-spacing: 0.4px;	
		}
		@media only screen and (max-width: ${MobileSize}) {
			.search-radio-button {
				padding: 10px;
				font-size: 10px;
			}
		}
	`,
	useShadow: true,
})
export default class SearchTypeRadioElement extends CustomHTMLBaseElement {

	private change = new Event('change');
	private buttonById: HTMLElement;
	private buttonByName: HTMLElement;
	private nativeInputById: HTMLInputElement;
	private nativeInputByName: HTMLInputElement;

	constructor() {
		super();
	}

	get value() {
		if (this.nativeInputById.checked) {
			return this.nativeInputById.value;
		}
		if (this.nativeInputByName.checked) {
			return this.nativeInputByName.value;
		}
	}

	set value(val) {
		if (this.nativeInputById.value === val) {
			this.checkById();
		}
		if (this.nativeInputByName.value === val) {
			this.checkByName();
		}
	}

	private checkById() {
		this.nativeInputById.checked = true;
		this.nativeInputByName.checked = false;
		this.dispatchEvent(this.change);
	}
	private checkByName() {
		this.nativeInputById.checked = false;
		this.nativeInputByName.checked = true;
		this.dispatchEvent(this.change);
	}

	componentDidMount() {
		this.buttonById = this.getChildElement('.search-radio-container-by-id');
		this.nativeInputById = this.buttonById.querySelector('input');
		this.buttonByName = this.getChildElement('.search-radio-container-by-name');
		this.nativeInputByName = this.buttonByName.querySelector('input');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.bindEvents();
	}

	private bindEvents() {
		this.buttonById.addEventListener('click', () => {
			this.checkById();
		});
		this.buttonByName.addEventListener('click', () => {
			this.checkByName();
		});
	}

	private static get observedAttributes() {
		return ['name', 'value'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		if (!this.buttonById || !this.buttonByName) {
			return;
		}
		switch (name) {
			case 'name':
				this.nativeInputById.name = newVal;
				this.nativeInputByName.name = newVal;
				break;
			case 'value':
				this.value = newVal;
				break;
		}
	}
}
