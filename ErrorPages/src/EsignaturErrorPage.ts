import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import MakeRequest from "./Framework/Utilities/MakeRequest";
import ErrorResponse from "./Framework/Models/ErrorResponse";

@CustomElement({
	selector: 'esignatur-error-page',
	template: `
		<div class="error-page-content">
			<div class="error-page-title"></div>
			<br>
			<div class="error-page-body"></div>
		</div>
	`,
	style: `
		@import url('https://fonts.googleapis.com/css2?family=Raleway');
		* {
			font-family: Raleway,sans-serif;
		}
		@media (min-width: 768px) {
			.error-page-content {
				width: 470px;
			}
		}
		.error-page-title {
			color: #325d77;
			font-size: 24px;
		}
		.error-page-body {
			color: #333333;
			font-size: 14px;
		}
	`,
	useShadow: false,
})
export default class FloatingLabelInputElement extends CustomHTMLBaseElement {

	private errorPageTitle: HTMLElement;
	private errorPageBody: HTMLElement;
	key: string;
	apiUrl: string;
	language: string;
	tokens: { [placeholder: string]: string };

	constructor() {
		super();
	}

	componentDidMount() {
		this.errorPageTitle = this.getChildElement('.error-page-title');
		this.errorPageBody = this.getChildElement('.error-page-body');
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.renderPage();
	}

	renderPage() {
		new MakeRequest(`${this.apiUrl}api/Error/${this.key}/${this.language}`)
			.send().then(response => {
				let errorResponse = JSON.parse(response as string) as ErrorResponse;
				this.errorPageTitle.innerHTML = errorResponse.title;
				let body = this.formatBody(errorResponse.body);
				this.errorPageBody.innerHTML = body;

			})
			.catch(exception => {
				console.error(exception);
				this.errorPageTitle.innerHTML = 'Error!';
			})
	}
	formatBody(rawBody: string): string {
		let formattedBody = rawBody;
		for (let placeholder in this.tokens) {
			formattedBody = formattedBody.replace(`{${placeholder}}`, this.tokens[placeholder]);
		}
		return formattedBody;
	}


	private static get observedAttributes() {
		return ['key', 'apiurl', 'tokens'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'key':
				this.key = newVal;
				break;
			case 'apiurl':
				this.apiUrl = newVal;
				break;
			case 'language':
				this.language = newVal;
				break;
			case 'tokens':
				this.tokens = JSON.parse(newVal);
				break;
		}
	}




}