import CustomElement from "../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../../Elements/CustomHTMLBaseElement";
import SVGs from "../../Framework/Constants/SVGs";
import Colors from "../../Framework/Constants/Colors";

@CustomElement({
	selector: 'esignatur-branding-admin-search-icon-element',
	template: `
		<span class="lens-search-icon">${SVGs.lensSVG}</span>
	`,
	style: `
		.lens-search-icon {
			cursor: pointer;
			background-color: #FFFFFF;
			padding: 2px 0 0 2px;
			opacity: 0.5;
		}
		.lens-search-icon svg {
			width: 20px;
			height: 20px;
			opacity: 0.5;
		}
		.lens-search-icon svg:hover {
			opacity: 1;
			color: ${Colors.primary};
		}
	`,
	useShadow: true,
})
export default class SearchIconElement extends CustomHTMLBaseElement {

	constructor() {
		super();
	}

}