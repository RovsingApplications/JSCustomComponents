import ArrayUtil from "./ArrayUtil";
import DomUtil from "./DomUtil";
import { ViewportUtil } from "./ViewportUtil";

export default class HeaderAnimation {
	private header: HTMLElement;
	private brand: HTMLElement;
	private domUtil: DomUtil;
	private screenWidth: number;
	private readonly minScreenWidth = 768;
	constructor() {
		this.screenWidth = document.documentElement.offsetWidth;
		this.header = document.querySelector("header") as HTMLElement;
		this.brand = document.querySelector(".navbar-brand") as HTMLElement;
		this.domUtil = new DomUtil(this.header);
		const animationContainers = ArrayUtil.FromNodeList(document.querySelectorAll(".animation-container"));
		const delayedElements = ArrayUtil.FromNodeList(document.querySelectorAll(".delayed"));
		this.scrollEvent();
		// display elements after page load and new position is taken.
		delayedElements.forEach((element) => { (element as HTMLElement).style.opacity = "1"; });
		// add transition delay after first scroll Event
		this.setAnimationDelay(animationContainers);
	}
	public execute(): void {
		const animationEvent = this.domUtil.getDataAttr("animation-event");
		if (animationEvent === "load") {
			window.addEventListener("load", this.lyingPosition.bind(this), true);
		} else if (animationEvent === "scroll" && this.screenWidth >= this.minScreenWidth) {
			window.addEventListener("scroll", this.scrollEvent.bind(this), true);
		} else if (animationEvent === "scroll" && this.screenWidth < this.minScreenWidth) {
			this.lyingPosition();
		}
	}

	private lyingPosition(): void {
		if (this.header !== null) {
			this.header.classList.add("animated");
			this.brand.style.opacity = "1";
		}
	}
	private defaultPosition(): void {
		if (this.header !== null) {
			this.header.classList.remove("animated");
			this.brand.style.opacity = "0";
		}
	}

	private scrollEvent() {
		if (new ViewportUtil().WindowTop(40)) {
			this.lyingPosition();
		} else {
			this.defaultPosition();
		}
	}
	private setAnimationDelay(animationContainers: Element[]): void {
		const animatioDelay = this.domUtil.getDataAttr("animation-delay");
		const addtransitionedClass =
			(elements: Element[]) => elements.forEach((element: Element) => { element.classList.add("transitioned"); });

		if (animatioDelay === 0 || animatioDelay === "0") {
			addtransitionedClass(animationContainers);
		} else {
			setTimeout(() => {
				addtransitionedClass(animationContainers);
			}, animatioDelay);
		}

	}
}
