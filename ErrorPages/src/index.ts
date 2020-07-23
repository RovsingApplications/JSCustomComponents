import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import getAttributeNamesPolyfill from './Framework/Polyfills/getAttributeNamesPolyfill';
getAttributeNamesPolyfill();
import EsignaturErrorPage from './EsignaturErrorPage';

export {
	EsignaturErrorPage
}