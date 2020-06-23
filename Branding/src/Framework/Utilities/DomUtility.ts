export default class DomUtility {
	static removeAllChildren(element: Element) {
		let children = Array.prototype.slice.call(element.childNodes);
		if (!children || children.length === 0) {
			return;
		}
		children.foreach(child => {
			child.remove();
		});
	}
}