import getAttributeNamesPolyfill from './getAttributeNamesPolyfill';
import childNodeRemovePolyfill from './childNodeRemovePolyfill';
import stringStartsWithPolyfill from './stringStartsWithPolyfill';

export default function polyfills() {
	getAttributeNamesPolyfill();
	childNodeRemovePolyfill();
	stringStartsWithPolyfill();
}
