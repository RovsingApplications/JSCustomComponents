import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import BrandingSignPreview from './BrandingSignPreview';
import Branding from '../../Framework/Models/Branding';

@CustomElement({
	selector: 'esignatur-branding-preview',
	template: `
		<esignatur-branding-sign-preview></esignatur-branding-sign-preview>
	`,
	style: `
	`,
	useShadow: true,
})
export default class BrandingPreviewComponent extends CustomHTMLBaseElement {

	private signPreview: BrandingSignPreview;

	constructor() {
		super();
	}

	componentDidMount() {
		this.signPreview = this.getChildElement('esignatur-branding-sign-preview');
	}

	styleComponent(branding: Branding) {
		this.signPreview.styleComponent(branding);
	}
}
