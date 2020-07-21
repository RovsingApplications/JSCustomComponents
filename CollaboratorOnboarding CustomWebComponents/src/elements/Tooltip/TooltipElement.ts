import CustomElement from '../../framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import { infoSVG } from '../../framework/Constants/svgs';
import Colors from '../../framework/Constants/Colors';

@CustomElement({
	selector: 'onboarding-tooltip-element',
	template: `
		<span id="tooltip-element-wrapper">
			<span id="tooltip-handle-wrapper"></span>
			<div id="tooltip-body">
				<div id="tooltip-header">
					<div id="tooltip-arrow"></div>
					<div id="tooltip-title-wrapper"></div>
				</div>
				<div id="tooltip-content-wrapper"></div>
			</div>
		</span>
	`,
	style: `
		@import url('https://fonts.googleapis.com/css?family=Roboto');
	
		#tooltip-element-wrapper {
			font-family: Roboto, sans-serif;
			position: relative;
		}
		#tooltip-body {
			display: none;
			width: 445px;
			position: relative;
			left: -28px;
			top: 8px;
			z-index: 5;
			border-radius: 2px;
			box-shadow: 1px 1px 4px 0px rgba(0,0,0,0.75);
		}
		#tooltip-handle-wrapper {
			cursor: pointer;
		}
		#tooltip-handle-wrapper:hover + #tooltip-body ,
		#tooltip-body:hover {
			display: block;
		}
		#tooltip-arrow {
			width: 20px;
			height: 20px;
			position: absolute;
			top: -8px;
			left: 29px;
			z-index: -1;
			background-color: ${Colors.quaternary};
			transform: rotate(150deg) skew(30deg);
		}
		#tooltip-header {
			background-color: ${Colors.quaternary};
			color: #FFFFFF;
			padding: 20px;
			font-size: 16px;
			border-radius: 2px 2px 0 0;
		}
		#tooltip-content-wrapper {
			padding: 14px 25px;
			font-size: 14px;
			background-color: #FFFFFF;
			border-radius: 0 0 2px 2px;
		}
	`,
	useShadow: true,
})
export default class TooltipElement extends CustomHTMLBaseElement {

	private handlerWrapper: HTMLElement;
	private contentWrapper: HTMLElement;
	private titleWrapper: HTMLElement;
	private handlerElement: HTMLElement;
	private contentElement: HTMLElement;
	private titleElement: HTMLElement;
	private arrow: HTMLElement;
	private tooltipBody: HTMLElement;


	constructor() {
		super();
	}


	componentDidMount() {
		this.handlerWrapper = this.getChildElement('#tooltip-handle-wrapper');
		this.contentWrapper = this.getChildElement('#tooltip-content-wrapper');
		this.titleWrapper = this.getChildElement('#tooltip-title-wrapper');
		this.arrow = this.getChildElement('#tooltip-arrow ');
		this.tooltipBody = this.getChildElement('#tooltip-body');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.render();
	}

	private render() {
		this.handlerElement = this.querySelector('[slot="handle"]');
		this.contentElement = this.querySelector('[slot="content"]');
		this.titleElement = this.querySelector('[slot="title"]');
		if (this.handlerElement) {
			this.handlerWrapper.fillContent(this.handlerElement);
		}
		if (this.contentElement) {
			this.contentWrapper.fillContent(this.contentElement);
			this.contentElement.style.display = null;
		}
		if (this.titleElement) {
			this.titleWrapper.fillContent(this.titleElement);
			this.titleElement.style.display = null;
		}
	}

	changePosition(position: string) {
		if (!this.arrow || !this.tooltipBody) {
			return;
		}
		switch (position) {
			case 'right':
				this.arrow.style.left = '395px';
				this.tooltipBody.style.left = '-395px';
				break;
			case 'center':
				this.arrow.style.left = '212px';
				this.tooltipBody.style.left = '-210.5px';
				break;
			default:
				this.arrow.style.left = null;
				this.tooltipBody.style.left = null;
				break;
		}
	}

	private static get observedAttributes() {
		const arrtibutes = ['position'];
		return arrtibutes;
	}
	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'position':
				this.changePosition(newVal);
				break;
		}
	}
}
