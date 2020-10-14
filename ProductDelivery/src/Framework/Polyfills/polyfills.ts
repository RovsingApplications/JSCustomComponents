import getAttributeNamesPolyfill from './getAttributeNamesPolyfill';
import childNodeRemovePolyfill from './childNodeRemovePolyfill';
import arrayFindPolyfill from './arrayFindPolyfill';

export default function polyfills() {
	getAttributeNamesPolyfill();
	childNodeRemovePolyfill();
	arrayFindPolyfill();
}
