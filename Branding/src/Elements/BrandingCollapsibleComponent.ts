// https://www.w3schools.com/howto/howto_js_collapsible.asp

import CustomElement from '../Framework/custom-element.decorator';
import CustomHTMLBaseElement from './CustomHTMLBaseElement';
import DomUtility from '../Framework/Utilities/DomUtility';
import Colors from '../Framework/Constants/Colors';

@CustomElement({
	selector: 'esignatur-branding-collapsible',
	template: `
		<div class="collapsible">
			<span class="collapsible-title-wrapper"></span>
			<span class="collapsible-icon">&rsaquo;</span>
		</div>
		<div class="collapsible-content-wrapper"></div>
	`,
	style: `
		.collapsible {
			background-color: ${Colors.tertiary};
			color: #FFFFFF;
			cursor: pointer;
			padding: 18px 40px 18px 18px;
			width: 100%;
			border: none;
			text-align: left;
			outline: none;
			font-size: 15px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
		}
		.collapsible.active {
			background-color: #FFFFFF;
			color: ${Colors.primary};
			padding-bottom: 10px;
		}
		.collapsible-title-wrapper {
			font-size: 13px;
		}
		.collapsible.active .collapsible-title-wrapper {
			font-weight: 700;
		}
		.collapsible-content-wrapper {
			padding: 0 18px;
			overflow: hidden;
			background-color: #FFFFFF;
			max-height: 0;
			transition-property: max-height;
			transition-duration: .3s;
			transition-timing-function: ease-in-out;
		}
		.collapsible-icon {
			font-family: sans-serif;
			line-height: 0;
			font-size: 30px;
			display: inline-block;
			user-select: none;
			margin-right: 10px;
			position: static;
			right: 0;
			transform: rotate(90deg);
			transition-property: transform, margin-right, position, right;
			transition-duration: .3s;
			transition-timing-function: ease-in-out;
		}
		
		.collapsible.active .collapsible-icon {
			transform: rotate(-90deg);
			margin-right: 0;
			position: relative;
			right: -10px;
			color: ${Colors.primary};
		}
	`,
	useShadow: false,
})
export default class BrandingCollapsibleComponent extends CustomHTMLBaseElement {

	constructor() {
		super();
	}

	componentDidMount() {

		const collapsibleElement = this.getChildElement('.collapsible');
		const contentWrapperElement = this.getChildElement('.collapsible-content-wrapper');
		const titleWrapperElement = this.getChildElement('.collapsible-title-wrapper');

		const title = this.querySelector('.collapsible-title');
		const content = this.querySelector('.collapsible-content');
		if (title) {
			title.remove();
			titleWrapperElement.appendChild(title);
		}
		if (content) {
			DomUtility.removeAllChildren(contentWrapperElement);
			let clone = content.cloneNode(true);
			content.remove();
			contentWrapperElement.appendChild(clone);
		}

		collapsibleElement.addEventListener("click", () => {
			collapsibleElement.classList.toggle("active");
			if (contentWrapperElement.style.maxHeight) {
				contentWrapperElement.style.maxHeight = contentWrapperElement.scrollHeight + "px";
				setTimeout(() => {
					contentWrapperElement.style.maxHeight = null;
				});
			} else {
				contentWrapperElement.style.maxHeight = contentWrapperElement.scrollHeight + "px";
				setTimeout(() => {
					contentWrapperElement.style.maxHeight = 'fit-content';
				}, 300);

			}
		});
	}

}
