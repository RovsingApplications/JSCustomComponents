import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import '@luftborn/esignatur-branding';
import polyfills from './Framework/Polyfills/polyfills';
polyfills();

import BrandingAdminComponent from './BrandingAdminComponent';
import FloatingLabelInputElement from "./Elements/FloatingLabel/FloatingLabelInputElement";
import SearchTypeRadioElement from './Elements/Search/SearchTypeRadioElement';
import SearchCustomerElement from './Elements/Search/SearchCustomerElement';
import SearchIconElement from './Elements/Search/SearchIconElement';
import SearchResultsTable from './Elements/Search/SearchResultsTable';
import CustomerNameAutoCompleteElement from './Elements/Search/CustomerNameAutoCompleteElement';

export {
	BrandingAdminComponent,
	FloatingLabelInputElement,
	SearchTypeRadioElement,
	SearchCustomerElement,
	SearchIconElement,
	SearchResultsTable,
	CustomerNameAutoCompleteElement
}