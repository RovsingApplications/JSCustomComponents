import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import BrandingSignPreview from './BrandingSignPreview';
import Branding from '../../Framework/Models/Branding';
import Colors from '../../Framework/Constants/Colors';

@CustomElement({
	selector: 'esignatur-branding-preview',
	template: `
	<div class="esignatur-branding-preview-container">
		<div class="preview-nav">
			<button class="preview-nav-button active" data-target="sign-preview-item">Sign</button>
			<button class="preview-nav-button" data-target="email-preview-item" hidden>E-mail</button>
		</div>
		<div>
			<div id="sign-preview-item" class="preview-item active">
				<esignatur-branding-sign-preview></esignatur-branding-sign-preview>
			</div>
			<div id="email-preview-item" class="preview-item">
				<esignatur-branding-email-preview></esignatur-branding-email-preview>
			</div>
		</div>
	</div>
	`,
	style: `
		.esignatur-branding-preview-container {
			margin: 10px 200px 100px 100px;
			transition: 0.3s ease-in-out;
		}
		.esignatur-branding-preview-container.hidden {
			margin: 0;
		}
		.preview-nav{
			padding: 20px 0;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: 0.3s ease-in-out;
		}
		.preview-nav.hidden {
			height: 0;
			flex-wrap: wrap;
			overflow: hidden;
			padding: 0;
		}
		.preview-nav-button {
			padding: 10px;
			color: #FFFFFF;
			background-color: ${Colors.primary};
			outline: none;
			width: 150px;
			height: 50px;
			font-size: 14px;
			letter-spacing: 2px;
			margin: 0 2px;
			border: none;
			cursor: pointer;
		}
		.preview-nav-button.active {
			background-color: ${Colors.octonary};
		}
		.preview-item {
			display: none;
		}
		.preview-item.active {
			display: block;
		}

		.esignatur-branding-preview-container.hidden #email-preview-item.active {
			margin: 20px auto;
		}
	`,
	useShadow: true,
})
export default class BrandingPreviewComponent extends CustomHTMLBaseElement {

	private previewContainerElement: HTMLElement;
	private previewNavElement: HTMLElement;
	private signPreview: BrandingSignPreview;
	private previewNavButtons: HTMLElement[];
	private previewItems: HTMLElement[];

	constructor() {
		super();
	}

	componentDidMount() {
		this.previewContainerElement = this.getChildElement('.esignatur-branding-preview-container');
		this.previewNavElement = this.getChildElement('.preview-nav');
		this.signPreview = this.getChildElement('esignatur-branding-sign-preview');
		this.previewNavButtons = this.getChildElements('.preview-nav-button');
		this.previewItems = this.getChildElements('.preview-item');

		this.bindEvents();
	}

	private bindEvents() {
		this.previewNavButtons.forEach(navButton => {
			navButton.addEventListener('click', () => {
				const targetId = navButton.dataset['target'];
				const targetPreviewItem = this.getChildElement(`#${targetId}`);
				if (!targetPreviewItem) {
					return;
				}
				this.highlightNavButton(navButton);
				this.showTargetPreviewItem(targetPreviewItem);
			});
		});
	}

	private highlightNavButton(navButton: HTMLElement) {
		this.previewNavButtons.forEach(navButton => {
			navButton.classList.remove('active');
		});
		navButton.classList.add('active');
	}
	private showTargetPreviewItem(targetPreviewItem: HTMLElement) {
		this.previewItems.forEach(previewItem => {
			previewItem.classList.remove('active');
		});
		targetPreviewItem.classList.add('active');
	}

	styleComponent(branding: Branding) {
		this.signPreview.styleComponent(branding);
	}

	magnifyPreview() {
		this.previewNavElement.classList.add('hidden');
		this.previewContainerElement.classList.add('hidden');
		this.signPreview.magnifyPreview();
	}
	unmagnifyPreview() {
		this.previewNavElement.classList.remove('hidden');
		this.previewContainerElement.classList.remove('hidden');
		this.signPreview.unmagnifyPreview();
	}
}
