import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import polyfills from './Framework/Polyfills/polyfills';
polyfills();

import DibsPaymentInfoComponent from './DibsPaymentInfoComponent';
import PaymentElement from './Elements/PaymentInfo/PaymentElement';
import ItemsElement from './Elements/PaymentInfo/ItemsElement';

export {
	DibsPaymentInfoComponent,
	PaymentElement,
	ItemsElement,
}