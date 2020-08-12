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

	static generateModal(content: HTMLElement, title: string, width?: number) {
		const overlay = ElementsCreator.generateOverlay();
		overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
		overlay.style.flexDirection = 'column';
		overlay.style.cursor = null;
		const modalDiv = document.createElement('div');
		overlay.appendChild(modalDiv);
		modalDiv.style.width = width ? `${width}px` : '100%';
		modalDiv.style.backgroundColor = Colors.septenary;
		modalDiv.style.position = 'relative';
		modalDiv.style.height = '100%';
		const headerElement = document.createElement('div');
		modalDiv.appendChild(headerElement);
		headerElement.style.display = 'flex';
		headerElement.style.justifyContent = 'space-between';
		const titleElement = document.createElement('div');
		headerElement.appendChild(titleElement);
		titleElement.innerHTML = title;
		titleElement.style.fontSize = '14px';
		titleElement.style.fontFamily = 'sans-serif';
		titleElement.style.padding = '10px 0 5px 10px';
		titleElement.style.fontWeight = '700';
		titleElement.style.letterSpacing = '1px';
		titleElement.style.color = '#FFFFFF';
		const closeWrapper = document.createElement('div');
		headerElement.appendChild(closeWrapper);
		closeWrapper.innerHTML = SVGs.timesSVG;
		closeWrapper.style.textAlign = 'right';
		closeWrapper.style.padding = '10px 10px 5px 0';
		const closeSvg = closeWrapper.querySelector('svg');
		closeSvg.style.width = '15px';
		closeSvg.style.height = '15px';
		closeSvg.style.fill = '#FFFFFF';
		closeSvg.style.cursor = 'pointer';
		const contentWrapper = document.createElement('div');
		contentWrapper.style.height = 'calc(100% - 34px)';
		modalDiv.appendChild(contentWrapper);
		contentWrapper.appendChild(content);
		closeSvg.onclick = () => {
			overlay.remove();
		};
		return overlay;
	}

}
