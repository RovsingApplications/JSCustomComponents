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

	public static generateErrorBlock(errorText = 'Noget gik galt!') {
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

	public static generateTimesSVG(height = 10, color = 'white') {
		const svgWrapper = document.createElement('div');
		svgWrapper.innerHTML = SVGs.timesSVG;
		svgWrapper.style.cursor = 'pointer';
		const svg = svgWrapper.querySelector('svg') as SVGSVGElement;
		svg.style.width = `${height}px`;
		svg.style.height = `${height}px`;
		const svgPath = svgWrapper.querySelector('svg path') as HTMLElement;
		svgPath.style.fill = color;
		return svgWrapper;
	}

	public static generateSnackbar(snackText = 'Noget gik galt!', color = Colors.nonary) {
		const snackbarWrapper = document.createElement('div');
		snackbarWrapper.style.width = '250px';
		snackbarWrapper.style.maxWidth = '300px';
		snackbarWrapper.style.position = 'absolute';
		snackbarWrapper.style.top = '20px';
		snackbarWrapper.style.right = '20px';
		snackbarWrapper.style.borderLeft = `6px solid ${color}`;
		snackbarWrapper.style.borderRadius = '2px';
		snackbarWrapper.style.padding = '20px 20px 20px 30px';
		snackbarWrapper.style.boxShadow = '5px 5px 5px lightgrey';
		snackbarWrapper.style.color = Colors.senary;
		snackbarWrapper.style.backgroundColor = '#FFFFFF';
		snackbarWrapper.style.fontFamily = 'Roboto, sans-serif';
		snackbarWrapper.style.fontSize = '16px';
		snackbarWrapper.style.zIndex = '2';
		snackbarWrapper.style.display = 'flex';
		snackbarWrapper.style.justifyContent = 'space-between';
		snackbarWrapper.style.transition = '0.5s';

		const snackbarWrapperTextElement = document.createElement('span');
		snackbarWrapperTextElement.innerHTML = snackText;
		snackbarWrapperTextElement.style.flexGrow = '1';
		snackbarWrapper.appendChild(snackbarWrapperTextElement);
		const closeButton = ElementsCreator.generateTimesSVG(10, Colors.senary);
		closeButton.style.flexGrow = '0';
		snackbarWrapper.appendChild(closeButton);
		closeButton.onclick = () => {
			snackbarWrapper.remove();
		};
		return snackbarWrapper;
	}


}
