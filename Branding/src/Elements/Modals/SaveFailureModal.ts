import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import SVGs from '../../Framework/Constants/SVGs';
import Colors from '../../Framework/Constants/Colors';

@CustomElement({
	selector: 'esignatur-branding-save-failure-modal',
	template: `
		<div class="modal-overlay">
			<div class="modal-popup">
				<div class="close-icon-container">${SVGs.timesSVG}</div>
				<div class="text-center">
					<span class="uncheckmark-icon-container">${SVGs.timesSVG}</span>
				</div>
				<div class="modal-text">
					<p class="text-header text-center">Noget gik galt !</p>
				</div>
				<div class="text-center">
					<button class="modal-button">LUK</button>
				</div>
			</div>
		</div>
	`,
	style: `
		.text-center {
			text-align: center;
		}
		.modal-overlay {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(0,0,0,0.5);
			z-index: 10;
		}
		.modal-popup {
			background-color: #FFFFFF;
			width: 550px;
			border-radius: 1px;
		}
		.close-icon-container {
			display: flex;
			justify-content: flex-end;
			padding: 17px 20px;
		}
		.close-icon-container svg {
			width: 15px;
			height: 15px;
			cursor: pointer;
		}
		.close-icon-container svg path {
			fill: ${Colors.primary};
		}
		.uncheckmark-icon-container {
			background-color: ${Colors.nonary};
			border-radius: 50%;
			height: 65px;
			width: 65px;
			display: inline-flex !important;
			align-items: center;
			justify-content: center;
			display: inline-block;
			box-sizing: border-box;
		}
		.uncheckmark-icon-container svg {
			width: 40px;
			height: 40px;
		}
		.uncheckmark-icon-container svg path {
			fill: #FFFFFF;
		}
		.modal-text {
			font-family: 'Raleway', sans-serif;
			color: ${Colors.senary};
		}
		.text-header {
			font-size: 24px;
			font-weight: 700;
		}
		.modal-button {
			font-family: 'Raleway', sans-serif;
			width: 150px;
			height: 45px;
			background-color: ${Colors.octonary};
			color: #FFFFFF;
			font-size: 14px;
			font-weight: 700;
			outline: none;
			border: none;
			cursor: pointer;
			margin: 40px 0;
			letter-spacing: 2px;
			border-radius: 1px;
		}
		
	`,
	useShadow: true,
})
export default class SaveFailureModal extends CustomHTMLBaseElement {

	private modalButton: HTMLElement;
	private closeButton: HTMLElement;
	private overlay: HTMLElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.modalButton = this.getChildElement('.modal-button ');
		this.closeButton = this.getChildElement('.close-icon-container svg');
		this.overlay = this.getChildElement('.modal-overlay');

		this.bindEvents();
	}

	private bindEvents() {
		this.modalButton.addEventListener('click', () => {
			this.close();
		});
		this.closeButton.addEventListener('click', () => {
			this.close();
		});
		this.overlay.addEventListener('click', (event: Event) => {
			if (event.target === this.overlay) {
				this.close();
			}
		});
	}

	close() {
		this.remove();
	}

}
