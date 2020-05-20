import ArrayUtil from "./ArrayUtil";
import UrlUtil from "./UrlUtil";

export default class AnalyticsClickEvents {
	private readonly selector: string = "[ga-track]";
	private elements: HTMLElement[];
	private pageUrl: string = new UrlUtil().pathArray().join("-");

	constructor() {
		this.elements = ArrayUtil.FromNodeList(document.querySelectorAll(this.selector));
		if (!this.pageUrl) {
			this.pageUrl = "FrontPage";
		}
	}

	public execute() {
		this.elements.forEach((element) => {
			element.addEventListener("click", () => {
				ga("send", {
					eventAction: element.getAttribute("ga-action"),
					eventCategory: this.pageUrl,
					eventLabel: element.getAttribute("ga-label"),
					hitType: "event",
				});
			});
		});
	}
}
