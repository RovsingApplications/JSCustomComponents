export default abstract class CustomHTMLBaseElement extends HTMLElement {
	constructor() {
		super();
	}

	applyCustomStyle(customStyle: HTMLStyleElement) {
		if (!customStyle) {
			return;
		}
		let element = this.getElement();
		element.appendChild(customStyle);
	}

	replaceCustomStyle(customStyle: HTMLStyleElement) {
		if (!customStyle) {
			return;
		}
		let element = this.getElement() as CustomHTMLBaseElement;
		const existingStyleElements = element.getChildElements<HTMLStyleElement>('style');
		existingStyleElements.forEach(styleElement => {
			styleElement.remove();
		});
		element.appendChild(customStyle);
	};

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

	fillContent(content: string | HTMLElement) {
		let element = this.getElement();

		Array.prototype.slice.call(element.children).forEach(childElement => {
			if (childElement instanceof HTMLStyleElement) {
				return;
			}
			childElement.remove();
		});
		if (typeof content === "string") {
			element.innerHTML += content;
			return;
		}
		element.appendChild(content);
	}

	getChildElements<T>(selector: string): T[] {
		let element = this.getElement();
		return Array.prototype.slice.call(element.querySelectorAll(selector));
	}

	hasChildElement(childElement: HTMLElement): boolean {
		let found = false;
		let element = this.getElement();
		Array.prototype.slice.call(element.children).forEach(child => {
			if (child === childElement) {
				found = true;
			}
		});
		return found;
	}

	appendChildElement(child: HTMLElement): void {
		let element = this.getElement();
		element.appendChild(child);
	}

	removeChildElement(child: HTMLElement): void {
		let element = this.getElement();
		element.removeChild(child);
	}

}
