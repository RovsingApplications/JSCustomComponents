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

	static fillContent(parent: Element, children: Element[]) {
		DomUtility.removeAllChildren(parent);
		children.forEach(child => {
			parent.appendChild(child);
		});
	}
}