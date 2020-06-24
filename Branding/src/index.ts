import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import getAttributeNamesPolyfill from './Framework/Polyfills/getAttributeNamesPolyfill';
getAttributeNamesPolyfill();

import BrandingComponent from './BrandingComponent';
import BrandingCollapsibleComponent from './Elements/BrandingCollapsibleComponent';
import BrandingFormComponent from './Elements/BrandingForm/BrandingFormComponent';
import BrandingFileInputBox from './Elements/BrandingFileInputBox';
import BrandingPreviewComponent from './Elements/BrandingPreview/BrandingPreviewComponent';
import FormLogoBar from './Elements/BrandingForm/FormLogoBar';
import FormColorsBar from './Elements/BrandingForm/FormColorsBar';
import BrandingAllignmentRadioInput from './Elements/BrandingAllignmentRadioInput';
import BrandingSizeSlider from './Elements/BrandingSizeSlider';
import BrandingColorPicker from './Elements/BrandingColorPicker';
import BrandingEmailPreview from './Elements/BrandingPreview/BrandingEmailPreview';
import BrandingSignPreview from './Elements/BrandingPreview/BrandingSignPreview';
import SaveSuccessModal from './Elements/Modals/SaveSuccessModal';
import SaveFailureModal from './Elements/Modals/SaveFailureModal';

export {
	SaveFailureModal,
	SaveSuccessModal,
	BrandingSignPreview,
	BrandingEmailPreview,
	BrandingColorPicker,
	BrandingSizeSlider,
	BrandingAllignmentRadioInput,
	FormColorsBar,
	FormLogoBar,
	BrandingFileInputBox,
	BrandingCollapsibleComponent,
	BrandingFormComponent,
	BrandingPreviewComponent,
	BrandingComponent
}