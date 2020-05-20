import { SpinnerSVG, TimesSVG, LoadingDotsSVG, infoSVG, downloadSVG } from '../Constants/svgs';
import Colors from '../Constants/Colors';

export default class ElementsCreator {

	public static generateSpinner(height = 50, block = true, padding = '0') {
		const spinnerWrapper = document.createElement(block ? 'div' : 'span');
		spinnerWrapper.innerHTML = SpinnerSVG;
		spinnerWrapper.style.textAlign = 'center';
		spinnerWrapper.style.padding = padding;
		spinnerWrapper.querySelector('svg').style.height = `${height}px`;
		return spinnerWrapper;
	}
	public static generateLoadingDots(width = 300) {
		const loadingDotsWrapper = document.createElement('span');
		loadingDotsWrapper.innerHTML = LoadingDotsSVG;
		loadingDotsWrapper.style.textAlign = 'center';
		loadingDotsWrapper.querySelector('svg').style.width = `${width}px`;
		return loadingDotsWrapper;
	}

	public static generateErrorBlock(errorText = 'Noget gik galt !') {
		const errorWrapper = document.createElement('div');
		errorWrapper.classList.add('overlay');
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


	public static generateSnackbar(snackText = 'Noget gik galt !') {
		const snackbarWrapper = document.createElement('div');
		snackbarWrapper.style.width = '250px';
		snackbarWrapper.style.maxWidth = '300px';
		snackbarWrapper.style.position = 'absolute';
		snackbarWrapper.style.top = '20px';
		snackbarWrapper.style.right = '20px';
		snackbarWrapper.style.borderLeft = `6px solid ${Colors.secondary}`;
		snackbarWrapper.style.borderRadius = '2px';
		snackbarWrapper.style.padding = '20px 20px 20px 30px';
		snackbarWrapper.style.boxShadow = '5px 5px 5px lightgrey';
		snackbarWrapper.style.color = 'white';
		snackbarWrapper.style.backgroundColor = Colors.primary;
		snackbarWrapper.style.opacity = '0.9';
		snackbarWrapper.style.fontFamily = 'Roboto, sans-serif';
		snackbarWrapper.style.fontSize = '16px';
		snackbarWrapper.style.zIndex = '2';
		snackbarWrapper.style.display = 'flex';
		snackbarWrapper.style.justifyContent = 'space-between';
		snackbarWrapper.style.transition = '0.5s';

		snackbarWrapper.innerHTML = `<span>${snackText}</span>`;
		const closeButton = ElementsCreator.generateTimesSVG();
		snackbarWrapper.appendChildElement(closeButton);
		closeButton.onclick = () => {
			if (snackbarWrapper.parentNode) {
				snackbarWrapper.parentNode.removeChild(snackbarWrapper);
			}
			if (snackbarWrapper.parentElement) {
				snackbarWrapper.parentElement.removeChildElement(snackbarWrapper);
			}
		};
		return snackbarWrapper;
	}

	public static generateModal(
		modalContent: string | HTMLElement,
		modalTitle?: string | HTMLElement,
		escapeToExit = true,
		pressOutsideToExit = true
	) {
		const modaloverlay = ElementsCreator.generateOverlay();;
		modaloverlay.style.cursor = 'auto';

		const modalWrapper = document.createElement('div');
		modalWrapper.style.width = '50vw';
		modalWrapper.style.minWidth = '300px';
		modalWrapper.style.maxWidth = '1000px';
		modalWrapper.style.minHeight = '100px';
		modalWrapper.style.maxHeight = '800px';
		modalWrapper.style.fontFamily = 'Roboto, sans-serif';
		modalWrapper.style.display = 'flex';
		modalWrapper.style.flexDirection = 'column';

		const modalHeadingWrapper = document.createElement('div');
		modalHeadingWrapper.style.backgroundColor = Colors.primary;
		modalHeadingWrapper.style.color = 'white';
		modalHeadingWrapper.style.padding = '15px';
		modalHeadingWrapper.style.display = 'flex';
		modalHeadingWrapper.style.borderRadius = '5px 5px 0 0';

		const modalTitleWrapper = document.createElement('div');
		modalTitleWrapper.style.flexGrow = '1';

		if (modalTitle) {
			if (typeof modalTitle === "string") {
				modalTitleWrapper.innerHTML = modalTitle;
			} else {
				modalTitleWrapper.appendChildElement(modalTitle);
			}
		}

		const modalCloseWrapper = document.createElement('div');
		modalCloseWrapper.addEventListener('click', () => {
			modaloverlay.remove();
		});

		const modalContentWrapper = document.createElement('div');
		modalContentWrapper.style.color = Colors.primary;
		modalContentWrapper.style.backgroundColor = 'white';
		modalContentWrapper.style.flexGrow = '1';
		modalContentWrapper.style.padding = '20px';
		modalContentWrapper.style.borderRadius = '0 0 5px 5px';

		if (typeof modalContent === "string") {
			modalContentWrapper.innerHTML = modalContent;
		} else {
			modalContentWrapper.appendChildElement(modalContent);
		}

		modalCloseWrapper.appendChildElement(ElementsCreator.generateTimesSVG());
		modalHeadingWrapper.appendChildElement(modalTitleWrapper);
		modalHeadingWrapper.appendChildElement(modalCloseWrapper);
		modalWrapper.appendChildElement(modalHeadingWrapper);
		modalWrapper.appendChildElement(modalContentWrapper);
		modaloverlay.appendChildElement(modalWrapper);

		if (pressOutsideToExit) {
			modaloverlay.addEventListener('click', (event) => {
				if (event.target === modaloverlay) {
					modaloverlay.remove();
				}
			});
		}
		if (escapeToExit) {
			document.addEventListener('keydown', (event) => {
				if (event.keyCode === 27) {
					modaloverlay.remove();
				}
			});
		}

		return modaloverlay;
	}

	public static generateTimesSVG(height = 10, color = 'white') {
		const svgWrapper = document.createElement('div');
		svgWrapper.innerHTML = TimesSVG;
		svgWrapper.style.width = `${height}px`;
		svgWrapper.style.height = `${height}px`;
		svgWrapper.style.cursor = 'pointer';
		const svgPath = svgWrapper.querySelector('svg path') as HTMLElement;
		svgPath.style.fill = color;
		return svgWrapper;
	}
	public static generateInfoSVG(color = 'grey') {
		const svgWrapper = document.createElement('span');
		svgWrapper.innerHTML = infoSVG;
		svgWrapper.style.cursor = 'pointer';
		svgWrapper.style.width = 'fit-content';
		svgWrapper.style.height = 'fit-content';
		svgWrapper.style.display = 'flex';
		svgWrapper.style.alignItems = 'center';
		const svg = svgWrapper.querySelector('svg') as SVGSVGElement;
		const svgPath = svgWrapper.querySelector('svg path') as HTMLElement;
		svgPath.style.fill = color;
		return svgWrapper;
	}
	public static generateDownloadSVG(height = 20) {
		const svgWrapper = document.createElement('span');
		svgWrapper.innerHTML = downloadSVG;
		svgWrapper.style.width = `${height}px`;
		svgWrapper.style.height = `${height}px`;
		svgWrapper.style.cursor = 'pointer';
		return svgWrapper;
	}
}
