import { throttle } from "./throttle";
import DomUtil from "./DomUtil";

export default class NavBar {
	private mainNavLinks: HTMLLinkElement[];
	private mainSections: HTMLElement[];
	private togglerButton: DomUtil;
	constructor() {
		const mainNavLinks = document.querySelectorAll("nav ul li a");
		const mainSections = document.querySelectorAll("main section");
		this.togglerButton = new DomUtil(document.querySelector("nav button.navbar-toggler"));
		this.mainNavLinks = [].slice
			.call(mainNavLinks);
		this.mainSections = [].slice
			.call(mainSections);
	}

	public execute(): void {
		document.addEventListener("scroll", () => {
			throttle(this.scrollEvent, 100).bind(this)
		});
		this.togglerButton.element.addEventListener("click", () => {
			document.querySelector(this.togglerButton.getDataAttr("target")).classList.toggle("collapse");
		});
	}

	public scrollEvent() {
		const fromTop = window.scrollY;

		this.mainNavLinks.forEach((link: HTMLLinkElement) => {
			const section = document.querySelector(link.href) as HTMLElement;

			if (
				section.offsetTop <= fromTop &&
				section.offsetTop + section.offsetHeight > fromTop
			) {
				link.classList.add("current");
			} else {
				link.classList.remove("current");
			}
		});
	}
}

