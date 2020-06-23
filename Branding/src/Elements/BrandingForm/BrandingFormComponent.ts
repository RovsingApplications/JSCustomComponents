import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import BrandingFileInputBox from '../BrandingFileInputBox';
import Branding from '../../Framework/Models/Branding';
import FormLogobar from './FormLogoBar';
import FormColorsBar from './FormColorsBar';

@CustomElement({
	selector: 'esignatur-branding-form',
	template: `
		<esignatur-branding-form-logo-bar></esignatur-branding-form-logo-bar>
		<esignatur-branding-form-colors-bar></esignatur-branding-form-colors-bar>
	`,
	style: `
	`,
	useShadow: false,
})
export default class BrandingFormComponent extends CustomHTMLBaseElement {

	private change = new Event('change');
	private formLogobar: FormLogobar;
	private formColorsBar: FormColorsBar;

	logoInput: BrandingFileInputBox;

	constructor() {
		super();
	}

	get value(): Branding {
		const brandingColorsPart = this.formColorsBar.value;
		const brandingLogoPart = this.formLogobar.value;
		const branding = new Branding({
			logoBase64: brandingLogoPart.logoBase64,
			logoAlignment: brandingLogoPart.logoAlignment,
			logoScale: brandingLogoPart.logoScale,
			primaryColor: brandingColorsPart.primaryColor,
			secondaryColor: brandingColorsPart.secondaryColor,
			textColor: brandingColorsPart.textColor,
			backgroundColor: brandingColorsPart.backgroundColor
		});
		return branding;
	}

	componentDidMount() {
		this.formLogobar = this.getChildElement('esignatur-branding-form-logo-bar');
		this.formColorsBar = this.getChildElement('esignatur-branding-form-colors-bar');

		this.bindEvents();
	}

	bindEvents() {
		this.formLogobar.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
		this.formColorsBar.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
	}

	fillForm(branding: Branding) {
		this.formLogobar.fillInputs(branding);
		this.formColorsBar.fillInputs(branding);
	}

}
