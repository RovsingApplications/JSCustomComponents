import ArrayUtil from "./ArrayUtil";
import BrowserType from "./BrowserType";
import DomUtil from "./DomUtil";
import { ViewportUtil } from "./ViewportUtil";

export default class ImageLazyLoader {
	private lazyImages: HTMLImageElement[];
	private browserType: BrowserType = new BrowserType();
	private active: boolean = false;
	constructor() {
		this.lazyImages = ArrayUtil.FromNodeList(document.querySelectorAll("img.lazy"));
		if (!Boolean(this.lazyImages)) {
			console.debug("no lazyload images... continueing");
			this.lazyImages = [];
			return;
		}
	}

	public execute() {
		this.lazyload();
		this.scrollObservable();
	}

	private scrollLazyLoad() {
		window.addEventListener("scroll", this.lazyload.bind(this), true);
		window.addEventListener("resize", this.lazyload.bind(this), true);
		window.addEventListener("orientationchange", this.lazyload.bind(this), true);
	}

	private scrollObservable() {
		/*
		if ("IntersectionObserver" in window) {
			const lazyObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.loadImage(entry.target as HTMLImageElement);
						lazyObserver.unobserve(entry.target);
					}
				});
			});
			this.lazyImages.forEach((lazyImage) => { lazyObserver.observe(lazyImage); });
		} else {
			this.scrollLazyLoad();
		}
		*/

		this.scrollLazyLoad();
	}

	private loadImage(image: HTMLImageElement) {
		const imageDomUtil = new DomUtil(image);
		let url = imageDomUtil.getDataAttr("src");
		if (!url) {
			return;
		}
		if (this.getExtension(url) !== "svg") {
			if (this.browserType.isChrome() || this.browserType.isOpera()) {
				url = this.replaceExtension(url, "webp");
			} else if (this.browserType.isSafari()) {
				url = this.replaceExtension(url, "jp2");
			} else if (this.browserType.isEdge() || this.browserType.isIE()) {
				url = this.replaceExtension(url, "jxr");
			} else if (this.browserType.isFirefox() && this.browserType.majorVersion >= 65) {
				url = this.replaceExtension(url, "webp");
			}
		}
		imageDomUtil.setAttr("src", url);
		imageDomUtil.removeDataAttr("src");
		if (imageDomUtil.hasClass("lazy")) {
			imageDomUtil.removeClass("lazy");
		}
		imageDomUtil.appendClass("image--loaded");

		const imageIndex = this.lazyImages.findIndex((img) => img === image);
		this.lazyImages.splice(imageIndex, 1);
	}

	private lazyload() {
		if(!this.lazyImages) return;

		for(let i = this.lazyImages.length -1; i >= 0; i--) {
			const lazyImage = this.lazyImages[i];
			this.active = true;
			const imageViewPort = new ViewportUtil(lazyImage);
			if (imageViewPort.IsOffsetVisible(300)) {
				this.loadImage(lazyImage);

				if (this.lazyImages.length === 0) {
					window.removeEventListener("scroll", this.lazyload.bind(this), true);
					window.removeEventListener("resize", this.lazyload.bind(this));
					window.removeEventListener("orientationchange", this.lazyload.bind(this));
				}
			}
		}
		this.active = false;
	}

	private getExtension(src: string) {
		return src.split(".").pop();
	}

	private replaceExtension(src: string, replacement: string) {
		return src.substr(0, src.lastIndexOf(".")) + "." + replacement;
	}
}