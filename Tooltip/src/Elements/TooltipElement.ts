import Colors from '../Framework/Constants/Colors';
import CustomElement from '../framework/custom-element.decorator';
import DomUtility from '../Framework/Utilities/DomUtility';
import CustomHTMLBaseElement from './CustomHTMLBaseElement';

@CustomElement({
	selector: 'esignatur-tooltip-element',
	template: `
		<span class="esignatur-tooltip-element-wrapper">
			<span class="esignatur-tooltip-element-content-wrapper"></span>
		</span>
	`,
	style: `
		esignatur-tooltip-element>* {
			font-family: sans-serif;
			display: none;
		}
		.esignatur-tooltip-element-wrapper {
			position: relative;
			display: inline;
		}
		.esignatur-tooltip-element-content-wrapper {
			position: absolute;
			top: 20px;
			width: fit-content;
			color: #FFFFFF;
			background-color: ${Colors.primary};
			padding: 10px;
			font-size: 10px;
			font-weight: 700;
			letter-spacing: 0.5px;
			border-radius: 4px;
			white-space:nowrap;
			display: none;
		}
	`,
	useShadow: false,
})
export default class TooltipElement extends CustomHTMLBaseElement {
	private tooltipElementContentWrapper: HTMLElement;
	private tooltipHandlerElement: HTMLElement;

	private contentCopied = false;
	private isText = false;
	private text: string;
	private currentPosition = 'right';

	constructor() {
		super();
	}


	componentDidMount() {
		this.tooltipElementContentWrapper = this.getChildElement('.esignatur-tooltip-element-content-wrapper');
		this.tooltipHandlerElement = this.parentElement || (this.previousElementSibling as HTMLElement);

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.render();
	}

	private render() {
		if (this.tooltipHandlerElement) {
			this.addListeners();
		}
	}

	private addListeners() {
		this.tooltipHandlerElement.onmouseover = () => {
			if (!this.contentCopied) {
				this.copyContentToWrapper();
			}
			this.tooltipElementContentWrapper.style.display = 'inline';
			this.changePosition();
		};
		
		this.tooltipHandlerElement.onmouseout = () => {
			this.tooltipElementContentWrapper.style.display = 'none';
		};
	}

	private copyContentToWrapper() {
		if (this.isText) {
			this.tooltipElementContentWrapper.innerHTML = this.text;
			return;
		}
		const content = this.getChildElements<HTMLElement>('esignatur-tooltip-element > *:not(style):not(.esignatur-tooltip-element-wrapper):not(.esignatur-tooltip-element-content-wrapper)')
		DomUtility.fillContent(this.tooltipElementContentWrapper, content);
		this.contentCopied = true;
	}

	private changePosition() {
		const parentElementWidth = this.parentElement.offsetWidth;
		const currentElementWidth = this.tooltipElementContentWrapper.offsetWidth;

		if (this.currentPosition.toLowerCase() === 'left') {
			this.tooltipElementContentWrapper.style.left = `-${parentElementWidth + currentElementWidth - 15}px`;
		}
		if (this.currentPosition.toLowerCase() === 'center') {
			this.tooltipElementContentWrapper.style.left = `-${parentElementWidth / 2 + currentElementWidth / 2 - 7}px`;
		}
	}

	private useText(text: string) {
		this.isText = true;
		this.text = text;
	}

	private static get observedAttributes() {
		const arrtibutes = ['position', 'text'];
		return arrtibutes;
	}
	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'position':
				this.currentPosition = newVal;
				break;
			case 'text':
				this.useText(newVal);
				break;
		}
	}
}
