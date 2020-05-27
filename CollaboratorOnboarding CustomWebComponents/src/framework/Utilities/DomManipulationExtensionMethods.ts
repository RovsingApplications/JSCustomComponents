// move to CustomHTMLBaseElement

interface HTMLElement {
	getElement(): any;
	fillContent(content: string | HTMLElement): void;
	getChildElement<T>(selector: string): T;
	getChildElements<T>(selector: string): T[];
	appendChildElement(child: HTMLElement): void;
	removeChildElement(child: HTMLElement): void;
	hasChildElement(child: HTMLElement): boolean;
}

HTMLElement.prototype.getElement = function <T extends HTMLElement>(): T {
	let element: any = this;
	if (this.shadowRoot) {
		element = this.shadowRoot;
	}
	return element as T;
}

HTMLElement.prototype.fillContent = function (content: string | HTMLElement) {
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

HTMLElement.prototype.getChildElement = function <T>(selector: string): T {
	let element = this.getElement();
	return element.querySelector(selector);
}

HTMLElement.prototype.getChildElements = function <T>(selector: string): T[] {
	let element = this.getElement();
	return Array.prototype.slice.call(element.querySelectorAll(selector));
}

HTMLElement.prototype.hasChildElement = function (childElement: HTMLElement): boolean {
	let found = false;
	let element = this.getElement();
	Array.prototype.slice.call(element.children).forEach(child => {
		if (child === childElement) {
			found = true;
		}
	});
	return found;
}

HTMLElement.prototype.appendChildElement = function (child: HTMLElement): void {
	let element = this.getElement();
	element.appendChild(child);
}

HTMLElement.prototype.removeChildElement = function (child: HTMLElement): void {
	let element = this.getElement();
	return element.removeChild(child);
}
