import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import './Elements/Search/SearchCustomerElement';
import Globals from "./Framework/Globals/Globals";


@CustomElement({
	selector: 'esignatur-branding-admin',
	template: `
		<esignatur-branding-admin-search-customer-element></esignatur-branding-admin-search-customer-element>
	`,
	style: `
	`,
	useShadow: true,
})
export default class BrandingAdminComponent extends CustomHTMLBaseElement {

	constructor() {
		super();
	}

	componentDidMount() {
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
	}


	private static get observedAttributes() {
		return ['eid', 'email', 'customer-base-url', 'branding-base-url'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'eid':
				Globals.adminEid = newVal;
				break;
			case 'email':
				Globals.adminEmail = newVal;
				break;
			case 'customer-base-url':
				Globals.customersBaseURL = newVal;
				if (Globals.customersBaseURL[Globals.customersBaseURL.length - 1] !== '/') {
					Globals.customersBaseURL = `${Globals.customersBaseURL}/`;
				}
				break;
			case 'branding-base-url':
				Globals.brandingBaseURL = newVal;
				if (Globals.brandingBaseURL[Globals.brandingBaseURL.length - 1] !== '/') {
					Globals.brandingBaseURL = `${Globals.brandingBaseURL}/`;
				}
				break;
		}
	}




}