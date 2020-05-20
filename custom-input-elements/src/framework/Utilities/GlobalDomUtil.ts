export default class GlobalDomUtil {
    elements: HTMLElement[];
    constructor(elements: NodeListOf<HTMLElement> = null) {
        if (elements)
            this.elements = [].slice.call(elements);
    }
    show() {
        this.elements.forEach(element => (element.style.display = ''));
    }
    hide() {
        this.elements.forEach(e => (e.style.display = 'none'));
    }
}
