import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';

// form
import { CustomForm } from './custom-form';
import { CustomInputElement } from './framework/CustomInputElement';

// elements
import * as elements from './elements/Elements';

export { CustomForm, elements, CustomInputElement };
