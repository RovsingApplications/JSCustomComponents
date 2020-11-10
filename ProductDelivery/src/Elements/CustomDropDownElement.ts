import CustomElement from "../../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";

@CustomElement({
	selector: 'delivery-result',
	template: `
	<div class='dropdown'>
		<div class='dropdown_value'></div>
		<div class='dropdown_arrow'>▾</div>
		<div class='dropdown_panel'>
		<div class='dropdown_items'></div>
		</div>
	</div>
	`,
	style: `
	/* step1 */
	body {
		background: #ccc;
	}

	/* step1 */
	.dropdown {
		text-align:left;
	color: #333;
		user-select: none;
		border-radius: 5px;
		background: white;
		cursor: pointer;
		width: 200px;
		height: 30px;
		line-height: 30px;
		display: inline-block;
		position: relative;
		font-size: 1.2em;
		font-family: Arial;
		background: white;
		box-shadow: 2px 2px 2px #999;
		border: 1px solid #aaa;
	}

	/* step1 */
	.dropdown_value {
		display: inline-block;
		padding-left: 5px;
	}

	/* step1 */
	.dropdown_arrow {
		transition: all 0.2s ease;
		position: absolute;
		right: 5px;
		top: 0px;
		color: #ccc;
		font-size: 25px;
	}

	/* step2 */
	.dropdown_panel {
		position: absolute;
		background: transparent;
		width: calc(100% + 11px);
		z-index: 9999;
		height: 203px;
		left: -1px;
		top: 26px;
		overflow: hidden;
		pointer-events: none;
	}

	/* step2 */
	.dropdown_items {
		position: absolute;
		pointer-events: all;
		z-index: 9999;
		top: 0px;
		width: calc(100% - 11px);
		max-height: 170px;
		background: white;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		box-shadow: 2px 2px 2px #999;
		transform: translate(0px, -200px);
		transition: 0.3s all ease-out;
		overflow-y: auto;
		border: 1px solid #aaa;
	}

	/* step2 */
	.dropdown_item {
		padding: 5px;
	}

	/* step2 */
	.dropdown_item:hover {
		background: #eee;
	}

	/* step2 */
	.dropdown ::-webkit-scrollbar {
		width: 8px;
	}

	/* step2 */
	.dropdown ::-webkit-scrollbar-thumb {
		background-color: #999;
	}
		
	`,
	useShadow: false,
})
export default class CustomDropDownElement extends CustomHTMLBaseElement {


	private paragrapghElement: HTMLParagraphElement;
	private change = new Event('change');

	constructor() {
		super();
	}

	componentDidMount() {

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
	}

	eventListener() {

	}

	private attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {

		}
	}
}