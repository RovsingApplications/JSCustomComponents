
export default class HtmlLoader {
    targetElement: HTMLElement;

    constructor(element: string | HTMLElement) {
        if (element instanceof HTMLElement) {
            this.targetElement = element;
        }
        else if (typeof element === 'string') {
            this.targetElement = document.querySelector(element);
        }
    }

    load(url: string, method: string = "get") {
        if (!this.targetElement) {
            throw new Error("missing target element");
        }

        const xmlHttpRequest = new XMLHttpRequest();

        xmlHttpRequest.onreadystatechange = () => {
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                this.targetElement.innerHTML = xmlHttpRequest.responseText;
            }
        };

        xmlHttpRequest.open(method, url, true);
        xmlHttpRequest.send();
    }
}