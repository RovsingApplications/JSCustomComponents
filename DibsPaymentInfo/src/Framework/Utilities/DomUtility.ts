export default class DomUtility {
	static removeAllChildren(element: Element) {
		let children = Array.prototype.slice.call(element.childNodes);
		if (!children || children.length === 0) {
			return;
		}
		children.forEach(child => {
			child.remove();
		});
	}

	static fillContent(parent: Element, child: Element) {
		DomUtility.removeAllChildren(parent);
		parent.appendChild(child);
	}

}