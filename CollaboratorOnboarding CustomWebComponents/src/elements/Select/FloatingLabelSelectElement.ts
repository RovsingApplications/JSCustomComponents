import CustomElement from "../../framework/custom-element.decorator";
import FloatingLabelBaseElement from '../FloatingLabelBaseElement';

@CustomElement({
	selector: 'floating-label-select-element',
	template: `
		<span id="item-group">
			<select id="inner-element">
			</select>
			<label id="inner-label"></label>
			<span id="error-message"></span>
		</span>
	`,
	style: ``,
	useShadow: true,
})
export default class FloatingLabelSelectElement extends FloatingLabelBaseElement {
	private selectElement: HTMLSelectElement;

	constructor() {
		super();
	}

	get value(): any {
		if (!this.selectElement.options || !this.selectElement.options.length || this.selectElement.selectedIndex === -1) {
			return null;
		}
		return this.selectElement.options[this.selectElement.selectedIndex].value;
	}
	set value(val: any) {
		let options: HTMLOptionElement[] = Array.prototype.slice.call(this.selectElement.options);
		let matchingOption = options.find(option => option.value === val);
		if (!matchingOption) {
			this.selectElement.selectedIndex = -1;
			return;
		}
		this.selectElement.selectedIndex = matchingOption.index;
	}
	get valid(): boolean {
		if (this.required) {
			return this.selectElement.selectedIndex >= 0;
		}
		return true;
	}

	componentDidMount() {
		this.selectElement = this.getChildElement('#inner-element');
		const selectOptions: HTMLOptionElement[] = Array.prototype.slice.call(this.querySelectorAll<HTMLOptionElement>('option'));
		selectOptions.forEach(option => {
			this.selectElement.appendChild(option);
		});
		this.bindEvents();
		super.componentDidMount();
	}

	private bindEvents() {
		this.selectElement.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
	}

	addOption(option: string, value: string) {
		let optionElement = document.createElement('option');
		optionElement.value = value;
		optionElement.innerHTML = option;
		this.selectElement.appendChild(optionElement);
	}
	removeAllOptions() {
		this.selectElement.innerHTML = '';
	}

	private static get observedAttributes() {
		return [...FloatingLabelBaseElement.baseObservedAttributes(), 'required'];
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		super.attributeChanged(name, oldVal, newVal);
		if (!this.selectElement) {
			return;
		}
		switch (name) {
			case 'required':
				if (newVal === 'true') {
					this.required = true;
					break;
				}
		}
	}
}
