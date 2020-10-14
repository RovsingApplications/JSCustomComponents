import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import polyfills from './Framework/Polyfills/polyfills';
polyfills();

import CustomInputElement from './Elements/Input/CustomInputElement';
import DropDownListElement from './Elements/DropDownList/DropDownListElement';
import ProductDeliveryWebElement from './ProductDeliveryWebElement';


export {
	CustomInputElement,
	ProductDeliveryWebElement,
	DropDownListElement,
}
