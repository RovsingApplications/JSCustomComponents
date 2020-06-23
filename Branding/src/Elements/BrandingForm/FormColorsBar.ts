import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import Branding from '../../Framework/Models/Branding';
import BrandingColorPicker from '../BrandingColorPicker';
import BrandingColorsPart from '../../Framework/Models/Partials/BrandingColorsPart';
import Color from '../../Framework/Models/Color';

@CustomElement({
	selector: 'esignatur-branding-form-colors-bar',
	template: `
		<esignatur-branding-collapsible>
			<span class="collapsible-title">Colors</span>
			<span class="collapsible-content">
				<esignatur-branding-color-picker name="primary-color"></esignatur-branding-color-picker>
				<br>
				<esignatur-branding-color-picker name="secondary-color"></esignatur-branding-color-picker>
				<br>
				<esignatur-branding-color-picker name="text-color"></esignatur-branding-color-picker>
				<br>
				<esignatur-branding-color-picker name="background-color" allow-gradient="true"></esignatur-branding-color-picker>
				<br>
			</span>
		</esignatur-branding-collapsible>
	`,
	style: `
	`,
	useShadow: false,
})
export default class FormColorsBar extends CustomHTMLBaseElement {
	private change = new Event('change');
	private primaryColorElement: BrandingColorPicker;
	private secondaryColorElement: BrandingColorPicker;
	private textColorElement: BrandingColorPicker;
	private backgroundColorElement: BrandingColorPicker;

	constructor() {
		super();
	}

	get value(): BrandingColorsPart {
		const brandingColorsPart = new BrandingColorsPart({
			primaryColor: this.primaryColorElement.value as string,
			secondaryColor: this.secondaryColorElement.value as string,
			textColor: this.textColorElement.value as string,
			backgroundColor: this.backgroundColorElement.value as Color
		});
		return brandingColorsPart;
	}

	componentDidMount() {
		this.primaryColorElement = this.getChildElement('[name="primary-color"]');
		this.secondaryColorElement = this.getChildElement('[name="secondary-color"]');
		this.textColorElement = this.getChildElement('[name="text-color"]');
		this.backgroundColorElement = this.getChildElement('[name="background-color"]');

		this.bindEvents();
	}

	private bindEvents() {
		this.getChildElements<BrandingColorPicker>('esignatur-branding-color-picker').forEach(colorPicker => {
			colorPicker.addEventListener('change', () => {
				this.dispatchEvent(this.change);
			});
		});
	}

	fillInputs(branding: Branding) {
		this.primaryColorElement.value = branding.primaryColor;
		this.secondaryColorElement.value = branding.secondaryColor;
		this.textColorElement.value = branding.textColor;
		this.backgroundColorElement.value = branding.backgroundColor;
	}
}
