import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import Globals from "./Framework/Globals/Globals";
import Constants from "./Framework/Constants/Constants";
import MakeRequest from "./Framework/Utilities/MakeRequest";
import Branding from "./Framework/Models/Branding";
import BrandingFormComponent from "./Elements/BrandingForm/BrandingFormComponent";
import Colors from "./Framework/Constants/Colors";
import { WhiteEDataUrl } from "./Framework/Constants/images/white-e";
import BrandingPreviewComponent from "./Elements/BrandingPreview/BrandingPreviewComponent";
import ElementsCreator from "./Framework/Utilities/ElementsCreator";
import SaveSuccessModal from "./Elements/Modals/SaveSuccessModal";
import { SaveFailureModal } from ".";
import SVGs from "./Framework/Constants/SVGs";

@CustomElement({
	selector: 'esignatur-branding',
	template: `
		<div id="container">
			<div id="side-bar">
				<div id="side-bar-top">
					<div id="logo-container">
						<img src="${WhiteEDataUrl}">
						<span>esignatur <b>Branding</b></span>
					</div>
					<div id="branding-form">
						<esignatur-branding-form></esignatur-branding-form>
					</div>
				</div>
				<div>
					<button id="submit-button">GEM</button>
				</div>
			</div>
			<div id="preview-container">
				<esignatur-branding-preview></esignatur-branding-preview>
			</div>
			<div id="preview-lens">${SVGs.lensSVG}</div>
		</div>
		
	`,
	style: `
		* {
			font-family: 'Raleway', sans-serif;
		}
		:host {
			height: 100%;
			width: 100%;
		}
		#container {
			display: flex;
			flex-direction: row;
			height: 100%;
			position: relative;
		}
		#side-bar {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 300px;
			min-width: 300px;
			background-color: ${Colors.septenary};
			height: 100%;
			transition: 0.3s ease-in-out;
		}
		#side-bar.hidden {
			width: 0;
			min-width: 0;
			overflow: hidden;
		}
		#side-bar-top {
			display: flex;
			flex-direction: column;
			height: calc(100% - 60px);
		}
		#branding-form {
			overflow-y: auto;
			scrollbar-width: thin;
			scrollbar-color: ${Colors.tertiary} #FFFFFF;
		}
		#branding-form::-webkit-scrollbar {
			width: 5px;
		}
		#branding-form::-webkit-scrollbar-track {
			background: #FFFFFF;
		}
		#branding-form::-webkit-scrollbar-thumb {
			background: ${Colors.tertiary};
		}

		#logo-container {
			display: flex;
			align-items: center;
			padding: 20px 30px;
			color: ${Colors.quinary};
			font-size: 16px;
			letter-spacing: 0.4px;
			user-select: none;
		}
		#logo-container img {
			margin-right: 10px;
		}
		#submit-button {
			width: 100%;
			height: 60px;
			background-color: ${Colors.octonary};
			border: none;
			color: #FFFFFF;
			font-size: 14px;
			font-weight: 700;
			letter-spacing: 2.1px;
			cursor: pointer;
			outline: none;
			transition: 0.1s;
		}
		#submit-button:hover {
			opacity: 0.9;
		}
		#preview-container {
			background-color: ${Colors.quinary};
			width: 100%;
			overflow: auto;
		}

		#preview-lens {
			cursor: pointer;
			position: absolute;
			right: 40px;
			top: 20px;
		}
		#preview-lens svg {
			width: 20px;
			height: 20px;
			opacity: 0.5;
			transition: transform 0.3s;
		}
		#preview-lens svg:hover {
			transform: scale(1.5);
			opacity: 1;
		}
		#preview-lens svg path {
			fill: ${Colors.primary};
		}

	`,
	useShadow: true,
})
export default class BrandingComponent extends CustomHTMLBaseElement {

	private brandingFormComponent: BrandingFormComponent;
	private brandingPreview: BrandingPreviewComponent;
	private submitButton: HTMLButtonElement;
	private previewLens: HTMLElement;
	private sideBarElement: HTMLElement;

	isMagnified = false;

	constructor() {
		super();
	}

	componentDidMount() {
		this.addFontToDocumentHead();

		this.brandingFormComponent = this.getChildElement('esignatur-branding-form');
		this.brandingPreview = this.getChildElement('esignatur-branding-preview');
		this.submitButton = this.getChildElement('#submit-button');
		this.previewLens = this.getChildElement('#preview-lens');
		this.sideBarElement = this.getChildElement('#side-bar')

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.initComponent();
	}

	addFontToDocumentHead() {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;700&display=swap';
		document.head.appendChild(link);
	}

	private initComponent() {
		const loadingOverlay = ElementsCreator.generateOverlayWithSpinner(100);
		this.appendChildElement(loadingOverlay);
		const headerName = Constants.apiKeyHeaderName;
		new MakeRequest(
			`${Globals.apiUrl}api/branding/Get`,
			'get', { [headerName]: Globals.apiKey }
		).send().then(res => {
			this.removeChildElement(loadingOverlay);
			const branding = new Branding(JSON.parse(res as string));
			this.fillForm(branding);
		}).catch(exception => {
			this.removeChildElement(loadingOverlay);
			console.log(exception);
			if (exception.status === 404) {
				const branding = new Branding();
				this.fillForm(branding);
				return
			}
			const errorBlock = ElementsCreator.generateErrorBlock();
			this.fillContent(errorBlock);
		});
	}

	private fillForm(branding: Branding) {
		this.brandingFormComponent.fillForm(branding);
		this.formChangeHandler();
		this.bindEvents();
	}

	private bindEvents() {
		this.bindFormChangeEvent();
		this.bindSubmitEvent();
		this.bindLensClickEvent();
	}

	private bindLensClickEvent() {
		this.previewLens.addEventListener('click', () => {
			this.toggleMagnification();
		});
	}

	private toggleMagnification() {
		if (this.isMagnified) {
			this.isMagnified = false;
			this.unmagnifyPreview();
			return;
		}
		if (!this.isMagnified) {
			this.isMagnified = true;
			this.magnifyPreview();
		}
	}

	private magnifyPreview() {
		this.sideBarElement.classList.add('hidden');
		this.brandingPreview.magnifyPreview()
	}
	private unmagnifyPreview() {
		this.sideBarElement.classList.remove('hidden');
		this.brandingPreview.unmagnifyPreview()
	}

	private bindFormChangeEvent() {
		this.brandingFormComponent.addEventListener('change', () => {
			this.formChangeHandler();
		});
	}
	private formChangeHandler() {
		const branding = this.brandingFormComponent.value;
		this.brandingPreview.styleComponent(branding);
	}

	private bindSubmitEvent() {
		this.submitButton.addEventListener('click', () => {
			this.submitButton.disabled = true;
			const loadingOverlay = ElementsCreator.generateOverlayWithLoadingDots(300);
			this.appendChildElement(loadingOverlay);
			const headerName = Constants.apiKeyHeaderName;
			const branding = this.brandingFormComponent.value;
			new MakeRequest(
				`${Globals.apiUrl}api/branding/Upsert`,
				'post', {
				[headerName]: Globals.apiKey,
				'Content-Type': 'application/json'
			}
			).send(JSON.stringify(branding)).then(res => {
				this.submitButton.disabled = false;
				this.removeChildElement(loadingOverlay);
				const successModal = new SaveSuccessModal();
				this.appendChildElement(successModal);
			}).catch(exception => {
				console.log(exception);
				this.submitButton.disabled = false;
				this.removeChildElement(loadingOverlay);
				const failureModal = new SaveFailureModal();
				this.appendChildElement(failureModal);
			});


		});
	}

	private static get observedAttributes() {
		return ['api-key', 'api-url'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'api-key':
				Globals.apiKey = newVal;
				break;
			case 'api-url':
				Globals.apiUrl = newVal;
				if (Globals.apiUrl[Globals.apiUrl.length - 1] !== '/') {
					Globals.apiUrl = `${Globals.apiUrl}/`;
				}
				break;
		}
	}




}