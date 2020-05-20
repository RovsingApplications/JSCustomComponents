export default abstract class CustomHTMLBaseElement extends HTMLElement {
	constructor() {
		super();
	}

	public applyCustomStyle(customStyle: HTMLStyleElement) {
		if (!customStyle) {
			return;
		}
		let element: any = this;
		if (this.shadowRoot) {
			element = this.shadowRoot;
		}
		element.appendChild(customStyle);
	}
}
