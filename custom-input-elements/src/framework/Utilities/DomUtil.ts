import { ViewportUtil } from './ViewportUtil';

export default class DomUtil {
    private viewPortUtil: ViewportUtil;
    public element: Element;
    constructor(element: Element) {
        this.element = element;
        this.viewPortUtil = new ViewportUtil(this.element as HTMLElement);
    }

    public getDataAttr(attr: string, defaultvalue?: string): any {
        if (!this.element) {
            return null;
        }
        const value = this.element.getAttribute(`data-${attr}`);

        return value !== undefined ? value : defaultvalue;
    }

    public setDataAttr(attr: string, value: string): any {
        if (!this.element) {
            return null;
        }
        return this.element.setAttribute(`data-${attr}`, value);
    }

    public getAttr(attr: string, defaultvalue?: string): any {
        if (!this.element) {
            return null;
        }
        const value = this.element.getAttribute(attr);
        return value !== undefined ? value : defaultvalue;
    }

    public setAttr(attr: string, value: string): void {
        if (!this.element) {
            return null;
        }
        this.element.setAttribute(attr, value);
    }

    public removeAttr(attr: string): void {
        if (!this.element) {
            return null;
        }
        this.element.removeAttribute(attr);
    }

    public removeDataAttr(attr: string): void {
        if (!this.element) {
            return null;
        }
        this.element.removeAttribute(`data-${attr}`);
    }

    public hasAttr(attr: string): boolean {
        if (!this.element) {
            return null;
        }
        return this.element.hasAttribute(attr);
    }

    public shake(): void {
        this.appendClass('shake');
        setTimeout(() => {
            this.removeClass('shake');
            (this.element as HTMLInputElement).readOnly = false;
        }, 600);
    }

    public error(): void {
        this.appendClass('error');
        setTimeout(() => {
            this.removeClass('error');
            (this.element as HTMLInputElement).readOnly = false;
        }, 5000);
    }

    public focus(): void {
        if (!this.viewPortUtil.IsVisible()) {
            this.element.scrollIntoView();
        }
    }

    public removeClass(classname): void {
        this.element.classList.remove(classname);
    }

    public appendClass(classname): void {
        this.element.classList.add(classname);
    }

    public deleteElement(): void {
        if (!this.element) {
            return null;
        }
        this.element.remove();
    }

    public setChildElementByAttrName(name: string, value: string): void {
        const firstLetter = name.replace(/^\w/, c => c.toUpperCase());
        const SubElement = this.element.querySelector(
            `[name="${firstLetter}"]`,
        ) as HTMLInputElement;
        if (SubElement) {
            SubElement.value = value;
        }
    }

    public hasClass(className: string): boolean {
        return this.element.classList.contains(className);
    }

    public getStyle(ruleName: string) {
        return getComputedStyle(this.element)[ruleName];
    }
}
