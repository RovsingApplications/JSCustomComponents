import SVGs from '../Constants/SVGs';

export default class ElementsCreator {

	public static generateSpinner(height = 50, block = true, padding = '0') {
		const spinnerWrapper = document.createElement(block ? 'div' : 'span');
		spinnerWrapper.style.display = 'flex';
		spinnerWrapper.style.alignItems = 'center';
		spinnerWrapper.style.justifyContent = 'center';
		spinnerWrapper.innerHTML = SVGs.spinnerSVG;
		spinnerWrapper.style.textAlign = 'center';
		spinnerWrapper.style.padding = padding;
		spinnerWrapper.querySelector('svg').style.height = `${height}px`;
		return spinnerWrapper;
	}

	public static generateErrorBlock(errorText = 'Noget gik galt!') {
		const errorWrapper = document.createElement('div');
		errorWrapper.innerHTML = errorText;
		errorWrapper.style.padding = '5px 0';
		errorWrapper.style.display = 'flex';
		errorWrapper.style.alignItems = 'center';
		errorWrapper.style.justifyContent = 'center';
		errorWrapper.style.minHeight = '35px';
		errorWrapper.style.boxSizing = 'border-box';
		errorWrapper.style.margin = '0 20px';
		errorWrapper.style.textAlign = 'center';
		errorWrapper.style.color = 'grey';
		errorWrapper.style.fontSize = '14px';
		errorWrapper.style.border = '1px dashed lightgrey';
		errorWrapper.style.fontFamily = 'Roboto, sans-serif';

		errorWrapper.innerHTML = errorText;
		return errorWrapper;
	}

	public static generateOverlay() {
		const overlayElement = document.createElement('div');
		overlayElement.style.position = 'absolute';
		overlayElement.style.width = '100%';
		overlayElement.style.height = '100%';
		overlayElement.style.top = '0';
		overlayElement.style.left = '0';
		overlayElement.style.display = 'flex';
		overlayElement.style.alignItems = 'center';
		overlayElement.style.justifyContent = 'center';
		overlayElement.style.backgroundColor = 'rgba(0,0,0,0.3)';
		overlayElement.style.zIndex = '10';
		overlayElement.style.cursor = 'progress';

		return overlayElement;
	}
	static generateOverlayWithSpinner(height: number) {
		const overlay = ElementsCreator.generateOverlay();
		overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
		const spinner = ElementsCreator.generateSpinner(height);
		overlay.appendChild(spinner);
		return overlay;
	}

}
