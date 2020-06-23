import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';

@CustomElement({
	selector: 'esignatur-branding-email-preview',
	template: `
		<div>Test email Preview</div>
	`,
	style: `
	`,
	useShadow: false,
})
export default class BrandingEmailPreview extends CustomHTMLBaseElement {

	constructor() {
		super();
	}

	componentDidMount() {

	}
}
