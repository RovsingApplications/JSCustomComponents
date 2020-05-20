export class ScrollPosition {
    element: HTMLElement | Window;

    constructor(element: HTMLElement | Window = window) {
        this.element = element;
    }

    get() {
        if (this.element instanceof Window) {
            return {
                x: this.element.pageXOffset,
                y: this.element.pageYOffset
            }
        }

        return {
            x: this.element.scrollLeft,
            y: this.element.scrollTop
        }
    }
}
