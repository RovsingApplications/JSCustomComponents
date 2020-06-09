export default abstract class CustomHTMLBaseElement extends HTMLElement {
	constructor() {
		super();
	}

	getElement<T extends HTMLElement>(): T {
		let element: any = this;
		if (this.shadowRoot) {
			element = this.shadowRoot;
		}
		return element as T;
	}

	getChildElement<T extends HTMLElement>(selector: string): T {
		let element = this.getElement();
		return element.querySelector(selector);
	}

}
