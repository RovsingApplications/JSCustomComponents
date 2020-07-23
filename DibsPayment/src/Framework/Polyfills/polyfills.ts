import getAttributeNamesPolyfill from './getAttributeNamesPolyfill';
import childNodeRemovePolyfill from './childNodeRemovePolyfill';

export default function polyfills() {
	getAttributeNamesPolyfill();
	childNodeRemovePolyfill();
}
