import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import Branding from '../../Framework/Models/Branding';
import BrandingAllignmentRadioInput from '../BrandingAllignmentRadioInput';
import BrandingFileInputBox from '../BrandingFileInputBox';
import BrandingSizeSlider from '../BrandingSizeSlider';
import BrandingLogoPart from '../../Framework/Models/Partials/BrandingLogoPart';
import { AlignmentPositionEnum } from '../../Framework/Models/AlignmentPositionEnum';

@CustomElement({
	selector: 'esignatur-branding-form-logo-bar',
	template: `
		<esignatur-branding-collapsible>
			<span class="collapsible-title">Logo</span>
			<span class="collapsible-content">
				<esignatur-branding-file-input-box text='Tilføj logo'></esignatur-branding-file-input-box>
				<br>
				<esignatur-branding-allignment-radio-input></esignatur-branding-allignment-radio-input>
				<br>
				<esignatur-branding-size-slider></esignatur-branding-size-slider>
				<br>
		</esignatur-branding-collapsible>
	`,
	style: `
	`,
	useShadow: false,
})
export default class FormLogoBar extends CustomHTMLBaseElement {

	private change = new Event('change');
	private logoFileElement: BrandingFileInputBox;
	private logoAlignmentElement: BrandingAllignmentRadioInput;
	private logoSizeElement: BrandingSizeSlider;

	constructor() {
		super();
	}

	get value(): BrandingLogoPart {
		const brandingLogoPart = new BrandingLogoPart({
			logoBase64: this.logoFileElement.value,
			logoAlignment: parseInt(this.logoAlignmentElement.value),
			logoScale: parseInt(this.logoSizeElement.value)
		});
		return brandingLogoPart;
	}

	componentDidMount() {
		this.logoFileElement = this.getChildElement('esignatur-branding-file-input-box');
		this.logoAlignmentElement = this.getChildElement('esignatur-branding-allignment-radio-input');
		this.logoSizeElement = this.getChildElement('esignatur-branding-size-slider');

		this.bindEvents();
	}

	private bindEvents() {
		this.logoFileElement.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
		this.logoAlignmentElement.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
		this.logoSizeElement.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
	}

	fillInputs(branding: Branding) {
		if (branding.logoBase64) {
			this.logoFileElement.value = branding.logoBase64;
		}

		this.logoAlignmentElement.value = branding.logoAlignment.toString();

		if (branding.logoScale) {
			this.logoSizeElement.value = branding.logoScale.toString();
		}
	}
}
