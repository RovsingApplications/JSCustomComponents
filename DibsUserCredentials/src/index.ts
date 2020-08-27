import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import polyfills from './Framework/Polyfills/polyfills';
polyfills();

import FloatingLabelInputElement from './Elements/FloatingLabel/FloatingLabelInputElement';
import DibsUserCredentialsComponent from './DibsUserCredentialsComponent';
import SingleCredentialsElement from './Elements/Credentials/SingleCredentialsElement';
import CredentialsFormElement from './Elements/Credentials/CredentialsFormElement';

export {
	FloatingLabelInputElement,
	DibsUserCredentialsComponent,
	SingleCredentialsElement,
	CredentialsFormElement
}