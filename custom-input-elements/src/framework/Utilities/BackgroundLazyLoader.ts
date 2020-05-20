import BrowserType from "./BrowserType";
import DomUtil from "./DomUtil";
import { ViewportUtil } from "./ViewportUtil";

export default class BackgroundLazyLoader {
	private lazyBackgrounds: HTMLElement[];
	private browserType: BrowserType = new BrowserType();
	private active: boolean = false;

	constructor() {
		const lazyBackgrounds = document.querySelectorAll(".lazy-background");
		if (!lazyBackgrounds) {
			this.lazyBackgrounds = [];
			console.debug("no lazyload images... continueing");
			return;
		}
		this.lazyBackgrounds = [].slice.call(lazyBackgrounds);
	}

	public execute() {
		this.lazyloadBackgrounds();
		if ("IntersectionObserver" in window) {
			this.scrollObservable();
		} else {
			this.scrollLazyLoad();
		}
	}

	private scrollLazyLoad() {
		/*if ("IntersectionObserver" in window) {
			this.scrollObservable();
		} else {
			window.addEventListener("scroll", this.lazyloadBackgrounds.bind(this), true)
		}*/
		window.addEventListener("scroll", this.lazyloadBackgrounds.bind(this), true)
		window.addEventListener("resize", this.lazyloadBackgrounds.bind(this));
		window.addEventListener("orientationchange", this.lazyloadBackgrounds.bind(this));
	}

	private scrollObservable() {
		if ("IntersectionObserver" in window) {
			const lazyObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
						lazyObserver.unobserve(entry.target);
					}
				});
			});

			this.lazyBackgrounds.forEach((lazyImage) => lazyObserver.observe(lazyImage));
		}
	}

	private lazyloadBackgrounds() {
		this.lazyBackgrounds.forEach((lazyImage) => {
			this.active = true;
			const imageViewPort = new ViewportUtil(lazyImage);
			const imageDomUtil = new DomUtil(lazyImage);
			if (imageViewPort.IsOffsetVisible(300)) {
				imageDomUtil.appendClass("visible");

				this.lazyBackgrounds = this.lazyBackgrounds.filter((image) => image !== lazyImage);

				if (this.lazyBackgrounds.length === 0) {
					document.removeEventListener("scroll", this.lazyloadBackgrounds.bind(this));
					window.removeEventListener("resize", this.lazyloadBackgrounds.bind(this));
					window.removeEventListener("orientationchange", this.lazyloadBackgrounds.bind(this));
				}
			}
		});

		this.active = false;
	}
}
