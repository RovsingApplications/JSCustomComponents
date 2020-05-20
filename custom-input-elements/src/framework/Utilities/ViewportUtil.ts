export class ViewportUtil {
    private element?: HTMLElement;
    constructor(element: HTMLElement = null) {
        this.element = element;
    }

    public IsVisible(): boolean {
        const bounds = this.element.getBoundingClientRect();
        return (
            ((bounds.top > 0 && bounds.top < innerHeight) ||
                (bounds.bottom > 0 && bounds.bottom < innerHeight)) &&
            ((bounds.left > 0 && bounds.left < innerWidth) ||
                (bounds.right > 0 && bounds.right < innerWidth))
        );
    }

    public IsPartiallyVisible() {
        const bounds = this.element.getBoundingClientRect();
        return (
            bounds.top >= 0 ||
            bounds.left >= 0 ||
            bounds.bottom <= innerHeight ||
            bounds.right <= innerWidth
        );
    }

    public IsOffsetVisible(offset: number = 300) {
        const bounds = this.element.getBoundingClientRect();
        // tslint:disable-next-line: max-line-length
        return (
            bounds.top + offset >= 0 ||
            bounds.left + offset >= 0 ||
            bounds.bottom - offset <= innerHeight ||
            bounds.right - offset <= innerWidth
        );
    }

    public WindowTop(offset: number = 0) {
        const YOffset =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        return offset <= YOffset;
    }
}
