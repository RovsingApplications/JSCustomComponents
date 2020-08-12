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

	// https://stackoverflow.com/questions/1230445/javascript-regex-how-to-bold-specific-words-with-regex
	static boldenText(inputText: string, matchindTextToBolden: string) {
		return inputText.replace(new RegExp('(^|)(' + matchindTextToBolden + ')(|$)', 'ig'), '$1<b>$2</b>$3');
	}
}