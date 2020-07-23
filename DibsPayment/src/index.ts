import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import polyfills from './Framework/Polyfills/polyfills';
polyfills();

import DibsCheckoutWrapper from './Elements/DibsCheckoutWrapper';

export {
	DibsCheckoutWrapper
}