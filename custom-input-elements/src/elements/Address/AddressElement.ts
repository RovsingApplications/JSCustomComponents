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
	private autoCompleteEnabled = false;
	private addressAutoComplete: google.maps.places.Autocomplete;

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
		this.address.placeholder = Translator.Translate('AddressElement.Address', language);
		this.city.placeholder = Translator.Translate('AddressElement.City', language);
		this.zip.placeholder = Translator.Translate('AddressElement.Zip', language);
	}

	enableAutoComplete(apiKey: string) {
		if (!apiKey || apiKey.trim() === '') {
			return;
		}
		this.autoCompleteEnabled = true;
		let googlePlacesLibraryElementExists = document.querySelector(`[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"]`);
		if (googlePlacesLibraryElementExists) {
			return;
		}
		let googlePlacesLibraryElement = document.createElement('script');
		googlePlacesLibraryElement.type = 'text/javascript';
		googlePlacesLibraryElement.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
		window.document.head.appendChild(googlePlacesLibraryElement);
		googlePlacesLibraryElement.onload = () => {
			this.bindAutoComplete();
		};
	}

	bindAutoComplete(): void {
		this.addressAutoComplete = new google.maps.places.Autocomplete(this.address);
		this.addressAutoComplete.addListener("place_changed", this.onAddressChangedHandler.bind(this));
	}

	onAddressChangedHandler() {
		this.city.value = '';
		this.zip.value = '';

		const place = this.addressAutoComplete.getPlace();
		if (!place.address_components) {
			return;
		}
		let cityComponents = place.address_components.filter(component => {
			const citySynonyms = ['administrative_area_level_1', 'locality'];
			const isCityComponent = citySynonyms.some(citySynonym => component.types.indexOf(citySynonym) != -1);
			return isCityComponent;
		});
		if (cityComponents && cityComponents[0]) {
			this.city.value = cityComponents[0].long_name;
		}
		const zipComponents = place.address_components.filter(component => component.types.indexOf('postal_code') != -1);
		if (zipComponents && zipComponents[0]) {
			this.zip.value = zipComponents[0].long_name;
		}
	}

	static get observedAttributes() {
		return ['language', 'google-places-key'];
	}
	attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}
	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'language':
				this.changeLanguage(newVal)
				break;
			case 'google-places-key':
				this.enableAutoComplete(newVal)
				break;
		}
	}
}
