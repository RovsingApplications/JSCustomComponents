// https://www.inserthtml.com/2012/06/custom-form-radio-checkbox/

import CustomElement from "../../framework/custom-element.decorator";
import '../../framework/Utilities/DomManipulationExtensionMethods';
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Colors from "../../framework/Constants/Colors";

@CustomElement({
	selector: 'custom-checkbox',
	template: `
		<input type="checkbox" />
	`,
	style: `
		:host {
			display: flex;
			align-items: center;
		}

		input {
			-webkit-appearance: none;
			background-color: #FFFFFF;
			border: 1px solid ${Colors.primary};
			width: 18px;
			height: 18px;
			border-radius: 4px;
			display: inline-block;
			position: relative;
			outline: unset;
		}

		input:checked {
			background-color: ${Colors.secondary};
			border: none;
		}

		input:checked:after {
			content: '\\2714';
			font-size: 12px;
			position: absolute;
			top: 0.7px;
			left: 4.3px;
			color: #FFFFFF;
		}
	`,
	useShadow: true,
})
export default class CustomCheckbox extends CustomHTMLBaseElement {

	private nativeCheckbox: HTMLInputElement;
	private change = new Event('change');

	constructor() {
		super();
	}

	get checked() {
		return this.nativeCheckbox.checked;
	}

	set checked(val) {
		this.nativeCheckbox.checked = val;
	}

	componentDidMount() {
		this.nativeCheckbox = this.getChildElement('input');
		const customStyle = this.querySelector('style');
		this.applyCustomStyle(customStyle);

		this.nativeCheckbox.onchange = () => {
			this.dispatchEvent(this.change);
		};
	}

	private static get observedAttributes() {
		const arrtibutes = ['checked'];
		return arrtibutes;
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		if (!this.nativeCheckbox) {
			return;
		}
		switch (name) {
			case 'checked':
				this.checked = newVal === 'false' ? false : true;
				break;
		}
	}

}
