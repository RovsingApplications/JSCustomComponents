import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import Translator from '../../framework/Language/Translator';
import getAttributeNamesPolyfill from '../../framework/Polyfills/getAttributeNamesPolyfill';
import debouncer from "../../framework/Utilities/debouncer";

@CustomElement({
	selector: 'address-element',
	template: `
			<div class="address-wrapper">
				<input class='address-part' id='address' type="text" placeholder='Address'/>
				<input class='address-part' id='city' type="text" placeholder='City'/>
				<input class='address-part' id='country' type="text" placeholder='Country'/>
				<input class='address-part' id='zip' type="text" placeholder='Zip'/>
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
	country: HTMLInputElement;
	zip: HTMLInputElement;

	constructor() {
		super();
		getAttributeNamesPolyfill();
	}

	get value(): string {
		let address = this.address.value || '';
		let city = this.city.value ? `,${this.city.value}` : '';
		let country = this.country.value ? `,${this.country.value}` : '';
		let zip = this.zip.value ? `,${this.zip.value}` : '';
		return `${address}${city}${country}${zip}`;
	}

	set value(value: string) {
		const values = value.split(',');
		this.address.value = values[0];
		this.city.value = values[1];
		this.country.value = values[2];
		this.zip.value = values[3];
	}

	get valid(): boolean {
		return (
			this.address.validity.valid &&
			this.city.validity.valid &&
			this.country.validity.valid &&
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
		this.country = super.getChildInput('#country');
		this.zip = super.getChildInput('#zip');
		const addressChaneDebounce = debouncer(this.change.bind(this), 400, false);
		this.address.addEventListener('change', () => {
			addressChaneDebounce();
		});
		this.city.addEventListener('change', this.change.bind(this));
		this.country.addEventListener('change', this.change.bind(this));
		this.zip.addEventListener('change', this.change.bind(this));

		if (this.required) {
			this.address.setAttribute('required', '');
			this.city.setAttribute('required', '');
			this.country.setAttribute('required', '');
			this.zip.setAttribute('required', '');
		}
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
		if (!this.address || !this.city || !this.country || !this.zip) {
			return;
		}
		this.address.placeholder = Translator.Translate('AddressElement.Address', language);
		this.city.placeholder = Translator.Translate('AddressElement.City', language);
		this.country.placeholder = Translator.Translate('AddressElement.Country', language);
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
		this.country.value = '';
		this.zip.value = '';

		const place = this.addressAutoComplete.getPlace();
		console.log(place);
		if (!place.address_components) {
			return;
		}
		
		this.address.value = place.name;

		const cityComponents = place.address_components.filter(component => {
			const citySynonyms = ['administrative_area_level_1', 'locality'];
			const isCityComponent = citySynonyms.some(citySynonym => component.types.indexOf(citySynonym) != -1);
			return isCityComponent;
		});
		if (cityComponents && cityComponents[0]) {
			this.city.value = cityComponents[cityComponents.length - 1].long_name;
		}

		const countryComponents = place.address_components.filter(component => component.types.indexOf('country') != -1);
		if (countryComponents && countryComponents[0]) {
			this.country.value = countryComponents[countryComponents.length - 1].long_name;
		}

		const zipComponents = place.address_components.filter(component => component.types.indexOf('postal_code') != -1);
		if (zipComponents && zipComponents[0]) {
			this.zip.value = zipComponents[0].long_name;
		}
		this.change(null);
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
