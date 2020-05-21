import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import Translator from '../../framework/Language/Translator';

@CustomElement({
	selector: 'address-element',
	template: `
			<div class="address-wrapper">
				<input class='address-part' id='address' type="text" placeholder='Address'/>
				<input class='address-part' id='city' type="text" placeholder='City'/>
				<input class='address-part' id='zip' type="number" placeholder='Zip'/>
			</div>`,
	style: `.address-wrapper{
                display: flex;
                flex-wrap: nowrap;
            }
            input.address-part{
                box-sizing: border-box;
                border: none;
                background-color: #f1f4ff;
                margin: 2px;
                resize: none;
                width:33% !important;
            }
           `,
	templatePath: './html.html',
	useShadow: true,
})
export class AddressElement extends CustomInputElement {
	address: HTMLInputElement;
	city: HTMLInputElement;
	zip: HTMLInputElement;

	constructor() {
		super();
	}

	get value(): string {
		let address = this.address.value || '';
		let city = this.city.value ? `,${this.city.value}` : '';
		let zip = this.zip.value ? `,${this.zip.value}` : '';
		return `${address}${city}${zip}`;
	}

	set value(value: string) {
		const values = value.split(',');
		this.address.value = values[0];
		this.city.value = values[1];
		this.zip.value = values[2];
	}

	get valid(): boolean {
		return (
			this.address.validity.valid &&
			this.city.validity.valid &&
			this.zip.validity.valid
		);
	}

	connectedCallback(): void {
		super.connectedCallback();
	}

	componentDidMount() {
		this.initChildInputs();
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
	}

	initChildInputs() {
		this.address = super.getChildInput('#address');
		this.city = super.getChildInput('#city');
		this.zip = super.getChildInput('#zip');
		this.address.addEventListener('change', this.change.bind(this));
		this.city.addEventListener('change', this.change.bind(this));
		this.zip.addEventListener('change', this.change.bind(this));
	}

	// events
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

	changeLanguage(language: string) {
		if (!this.address || !this.city || !this.zip) {
			return;
		}
		this.address.placeholder = Translator.Translate('AddressElement.Address');
		this.city.placeholder = Translator.Translate('AddressElement.City');
		this.zip.placeholder = Translator.Translate('AddressElement.Zip');
	}

	static get observedAttributes() {
		return ['language'];
	}
	attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}
	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'language':
				this.changeLanguage(newVal)
				break;
		}
	}
}
