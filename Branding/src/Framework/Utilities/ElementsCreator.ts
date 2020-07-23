import SVGs from '../Constants/SVGs';
import Colors from '../Constants/Colors';

export default class ElementsCreator {

	public static generateSpinner(height = 50, block = true, padding = '0') {
		const spinnerWrapper = document.createElement(block ? 'div' : 'span');
		spinnerWrapper.innerHTML = SVGs.spinnerSVG;
		spinnerWrapper.style.textAlign = 'center';
		spinnerWrapper.style.padding = padding;
		spinnerWrapper.querySelector('svg').style.height = `${height}px`;
		return spinnerWrapper;
	}
	public static generateLoadingDots(width = 300) {
		const loadingDotsWrapper = document.createElement('span');
		loadingDotsWrapper.innerHTML = SVGs.loadingDotsSVG;
		loadingDotsWrapper.style.textAlign = 'center';
		loadingDotsWrapper.querySelector('svg').style.width = `${width}px`;
		return loadingDotsWrapper;
	}

	public static generateErrorBlock(errorText = 'Noget gik galt !') {
		const errorWrapper = document.createElement('div');
		errorWrapper.innerHTML = errorText;
		errorWrapper.style.padding = '20px 0';
		errorWrapper.style.margin = '0 20px';
		errorWrapper.style.textAlign = 'center';
		errorWrapper.style.color = 'grey';
		errorWrapper.style.fontSize = '20px';
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
	static generateOverlayWithLoadingDots(width: number) {
		const overlay = ElementsCreator.generateOverlay();
		overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
		const loadingDots = ElementsCreator.generateLoadingDots(width);
		overlay.appendChild(loadingDots);
		return overlay;
	}

}
