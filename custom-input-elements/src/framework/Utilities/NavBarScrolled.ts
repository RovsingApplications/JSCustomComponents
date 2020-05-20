import DomUtil from "./DomUtil";
import { ViewportUtil } from "./ViewportUtil";

export default class NavBarScrolled {
	private navBar: HTMLElement;
	private domUtil: DomUtil;
	private scrolledClass: string = "scrolled";
	constructor() {
		this.navBar = document.querySelector("nav");
		this.domUtil = new DomUtil(this.navBar);
	}

	public execute(): void {
		document.addEventListener("scroll", this.scrollEvent.bind(this), true);
		this.scrollEvent();
	}

	private scrollEvent() {
		if (new ViewportUtil().WindowTop(40)) {
			this.domUtil.appendClass(this.scrolledClass);
		} else {
			this.domUtil.removeClass(this.scrolledClass);
		}
	}
}
