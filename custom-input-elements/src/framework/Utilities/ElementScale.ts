import ArrayUtil from "./ArrayUtil";

export default class ElementScale {
	private documentWdthOffset: number;
	private scaleRightElements: HTMLElement[];
	public Execute() {
		this.scaleRightElements =  ArrayUtil.FromNodeList(document.querySelectorAll("[class*='scale-']"));
		this.Init();
		this.ScaleRight();
	}
	private Init(): void {
		this.documentWdthOffset = document.documentElement.getBoundingClientRect().right;
	}
	private ScaleRight(): void {
		this.scaleRightElements.forEach((element) => {
			const elementRight = element.getBoundingClientRect().right;
			const spaceToEdge = this.documentWdthOffset - elementRight;
			const ratio = (spaceToEdge / element.offsetWidth) + 1;
			element.style.transform = "scaleX(" + ratio + ")";
		});
	}

}
