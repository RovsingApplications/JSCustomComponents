import DomUtil from "./DomUtil";
import HtmlLoader from "./HtmlLoader";

export class ReplaceOnClick {
    elements: HTMLElement[];

    constructor(selector: string = '.content-replace') {
        const elements = document.querySelectorAll(selector);
        if (elements) {
            this.elements = [].slice
                .call(elements);
        }
    }

    execute() {
        this.elements.forEach(this.replace);
    }

    private replace(element) {
        const elementUtil = new DomUtil(element);
        const targetUrl = elementUtil.getDataAttr('url');
        if (!targetUrl) return;
        const targetSelector = elementUtil.getDataAttr('target');
        if (!targetSelector) return;
        const target = document.querySelector(targetSelector);
        if (!target) return;
        element.addEventListener('click', (event: Event) => new HtmlLoader(target).load(targetUrl));
    }
}