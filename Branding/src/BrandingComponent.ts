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
		</div>
		
	`,
	style: `
		* {
			font-family: 'Raleway', sans-serif;
		}
		:host {
			height: 100%;
		}
		#container {
			display: flex;
			flex-direction: row;
			height: 100%;
		}
		#side-bar {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 300px;
			background-color: ${Colors.septenary};
			height: 100%;
		}
		#side-bar-top {
			display: flex;
			flex-direction: column;
			max-height: calc(100% - 60px);
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
			padding: 100px 200px 100px 100px;
			overflow: auto;
		}
	`,
	useShadow: true,
})
export default class BrandingComponent extends CustomHTMLBaseElement {

	private brandingFormComponent: BrandingFormComponent;
	private brandingPreview: BrandingPreviewComponent;
	private submitButton: HTMLButtonElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.addFontToDocumentHead();

		this.brandingFormComponent = this.getChildElement('esignatur-branding-form');
		this.brandingPreview = this.getChildElement('esignatur-branding-preview');
		this.submitButton = this.getChildElement('#submit-button');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.renderComponent();
	}

	addFontToDocumentHead() {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;700&display=swap';
		document.head.appendChild(link);
	}

	private renderComponent() {
		// add spinner

		const headerName = Constants.apiKeyHeaderName;

		new MakeRequest(
			`${Globals.apiUrl}api/branding/Get`,
			'get', { [headerName]: Globals.apiKey }
		).send().then(res => {
			const branding = new Branding(JSON.parse(res as string));
			console.log(branding);
			this.brandingFormComponent.fillForm(branding);
			this.formChangeHandler();
			this.bindEvents();
		}).catch(exception => {
			console.log(exception);

			// if has no company (404) add new one
			// else display error
		});
	}

	private bindEvents() {
		this.bindFormChangeEvent();
		this.bindSubmitEvent();
	}

	private bindFormChangeEvent() {
		this.brandingFormComponent.addEventListener('change', () => {
			this.formChangeHandler();
		});
	}
	private formChangeHandler() {
		const branding = this.brandingFormComponent.value;
		console.log(branding);
		this.brandingPreview.styleComponent(branding);
	}

	private bindSubmitEvent() {
		this.submitButton.addEventListener('click', () => {
			this.submitButton.disabled = true;
			// add spinner

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
				// remove spinner
				// display success modal
				console.log(res);
			}).catch(exception => {
				this.submitButton.disabled = false;
				// remove spinner
				// display error notification
				console.log(exception);
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