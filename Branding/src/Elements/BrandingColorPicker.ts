import CustomElement from '../Framework/custom-element.decorator';
import CustomHTMLBaseElement from './CustomHTMLBaseElement';
import SVGs from '../Framework/Constants/SVGs';
import Colors from '../Framework/Constants/Colors';
import Color from '../Framework/Models/Color';
import { BomUtility } from '../Framework/Utilities/BomUtility';
import ColorInputPolyfill from '../Framework/Polyfills/ColorInputPolyfill';

@CustomElement({
	selector: 'esignatur-branding-color-picker',
	template: `
		<div class="color-picker-types">
			<div class="color-picker-type color-picker-type-solid">
				<div class="color-picker-type-text">Solid farve</div>
				<div class="color-picker-type-button color-picker-type-button-solid active">${SVGs.colorFill}	</div>
			</div>
			<div class="color-picker-type color-picker-type-gradient">
				<div class="color-picker-type-text">Gradient farve</div>
				<div class="color-picker-type-button color-picker-type-button-gradient">${SVGs.halfCircle}	</div>
			</div>
		</div>
		<div class="color-display-box">
			<div class="color-box-content-add">
				<div class="color-add-button">${SVGs.addButton}</div>
				<input type="color" class="color-picker-solid-color-input" id="solid-color-input">
				<div class="color-add-text">Tilføj baggrundsfarve</div>
			</div>
		</div>
		<div class="color-picker-solid-standard">
			<div class="color-picker-solid-standard-text">Standardfarver</div>
			<div class="color-picker-solid-standard-colors">
				<div class="color-picker-solid-standard-color" data-color="#000000"></div>
				<div class="color-picker-solid-standard-color" data-color="${Colors.primary}"></div>
				<div class="color-picker-solid-standard-color" data-color="${Colors.secondary}"></div>
				<div class="color-picker-solid-standard-color" data-color="${Colors.quinary}"></div>
				<div class="color-picker-solid-standard-color" data-color="transparent"><div></div></div>
			</div>
		</div>
		<div class="color-picker-gradient-controls">
			<div class="color-picker-gradient-colors">
				<div class="color-picker-gradient-color">
					<input type="color" class="color-picker-gradient-color-input1" value="${Colors.primary}" id="gradient-color-input-1">
					<div class="color-picker-gradient-select-color-button button1">Vælg farve</div>
				</div>
				<div class="color-picker-gradient-color">
					<input type="color" class="color-picker-gradient-color-input2" value="${Colors.secondary}" id="gradient-color-input-2">
					<div class="color-picker-gradient-select-color-button button2">Vælg farve</div>
				</div>
			</div>
			<div>
				<div class="color-picker-gradient-angle-text">Gradientretning</div>
				<div class="color-picker-gradient-angle-control">
					<input type="range" class="color-picker-gradient-angle-input" min="0" max="360" value="180">
					<div class="color-picker-gradient-angle-value">180deg</div>
				</div>
			</div>
		</div>
	`,
	style: `
		.color-picker-types {
			display: flex;
			margin-bottom: 13px;
		}
		.color-picker-type {
			flex-grow: 1;
		}
		.color-picker-type-gradient {
			margin-left: 10px;
		}
		.color-picker-type-text {
			color: ${Colors.secondary};
			font-size: 10px;
		}
		.color-picker-type-button {
			flex-grow: 1;
			height: 17px;
			cursor: pointer;
			background-color: ${Colors.quaternary};
			display: flex;
			align-items: center;
			justify-content: center;
			user-select: none;
		}
		.color-picker-type-button.active svg{
			color: ${Colors.primary};
		}
		.color-picker-type-button.active svg path{
			fill: ${Colors.primary};
		}
		.color-picker-type-button svg {
			width: 10px;
			color: ${Colors.secondary};
		}
		.color-picker-type-button svg path {
			fill: ${Colors.secondary};
		}
		.color-picker-type-button-gradient svg {
			transform: rotate(135deg);
		}
		.color-display-box {
			cursor: pointer;
			user-select: none;
			width: 100%;
			height: 80px;
			border: 1.5px dashed ${Colors.secondary};
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}
		.color-box-content-add {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}
		.color-add-button {
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.color-add-button svg path {
			fill: ${Colors.secondary};
		}
		.color-picker-solid-color-input {
			width: 0;
			height: 0;
			padding: 0;
			margin: 0;
			box-sizing: border-box;
			outline: none;
			-webkit-appearance: none;
			border: none;
			opacity: 0;
		}
		.color-add-text {
			color: ${Colors.secondary};
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 1px;
			margin-top: 5px;
		}
		.color-picker-solid-standard {
			display: flex;
			margin-top: 3px;
		}
		.color-picker-solid-standard-text {
			color: ${Colors.secondary};
			font-size: 10px;
			margin-right: 7px;
			display: flex;
			align-items: center;
		}
		.color-picker-solid-standard-colors {
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}
		.color-picker-solid-standard-color {
			cursor: pointer;
			width: 16px;
			height: 16px;
			border-radius: 8px;
			margin: 3px;
			box-sizing: border-box;
		}
		.color-picker-solid-standard-color:nth-child(1) {
			background-color: #000000;
		}
		.color-picker-solid-standard-color:nth-child(2) {
			background-color: ${Colors.primary};
		}
		.color-picker-solid-standard-color:nth-child(3) {
			background-color: ${Colors.secondary};
		}
		.color-picker-solid-standard-color:nth-child(4) {
			background-color: ${Colors.quinary};
		}
		.color-picker-solid-standard-color:last-child {
			border: 2px solid ${Colors.quinary};
		}
		.color-picker-solid-standard-color:last-child div {
			width: 14px;
			height: 16px;
			border-left: 2px solid red;
			transform: rotate(45deg);
			position: relative;
			left: 3px;
			top: 3px;
			border-radius: 1px;
		}
		.color-picker-gradient-controls {
			margin-top: 13px;
		}
		.color-picker-gradient-colors {
			display: flex;
			justify-content: space-between;
		}
		.color-picker-gradient-color {
			cursor: pointer;
			display: flex;
			width: 100%;
		}
		.color-picker-gradient-color:last-child {
			margin-left: 10px;
		}
		.color-picker-gradient-color input {
			cursor: pointer;
			width: 20px;
			height: 17px;
			padding: 0;
			margin: 0 3px 0 0;
			box-sizing: border-box;
			outline: none;
			-webkit-appearance: none;
			border: none;
		}
		.color-picker-gradient-color input::-webkit-color-swatch-wrapper {
			padding: 0;
		}
		.color-picker-gradient-color input::-webkit-color-swatch {
			border: none;
		}
		.color-picker-gradient-select-color-button {
			color: ${Colors.primary};
			background-color: ${Colors.quaternary};
			font-size: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			font-weight: 700;
			height: 17px;
			letter-spacing: 0.5px;
			user-select: none;
		}
		.color-picker-gradient-angle-text {
			font-size: 12px;
			height: 15px;
			margin: 10px 0 3px 0;
			color: ${Colors.senary};
		}
		.color-picker-gradient-angle-control {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.color-picker-gradient-angle-input{
			-webkit-appearance: none;
			appearance: none;
			width: 55%;
			height: 5px;
			border-radius: 2px;
			background: ${Colors.quaternary};
			outline: none;
			padding: 0;
		}
		.color-picker-gradient-angle-input::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: ${Colors.primary};
			cursor: pointer;
		}
		
		.color-picker-gradient-angle-input::-moz-range-thumb {
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: ${Colors.primary};
			cursor: pointer;
		}
		.color-picker-gradient-angle-value {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 3.5px 0 2px 0;
			width: 40%;
			color: ${Colors.secondary};
			font-size: 10px;
			font-weight: 700;
			background-color: ${Colors.quaternary};
			letter-spacing: 0.5px;
			font-family: sans-serif;
			user-select: none;
		}
	`,
	useShadow: true,
})
export default class BrandingColorPicker extends CustomHTMLBaseElement {
	private change = new Event('change');
	private _allowGradient: boolean;
	private _isGradient: boolean;
	private isSolidTransparent: boolean = true;
	private gradientSelectorButton: HTMLElement;
	private solidSelectorButton: HTMLElement;
	private colorDisplayBox: HTMLElement;

	private nativeSolidInput: HTMLInputElement;

	private nativeGradientInput1: HTMLInputElement;
	private nativeGradientInput2: HTMLInputElement;
	private gradientInputbutton1: HTMLInputElement;
	private gradientInputbutton2: HTMLInputElement;

	private gradientAngleInput: HTMLInputElement;
	private gradientAngleValueElement: HTMLElement;

	private colorPickerTypesElement: HTMLElement;
	private colorPickerButtonTypeSolid: HTMLElement;

	private gradientControlsElement: HTMLElement;
	private solidStandardColorsElement: HTMLElement;

	name: string;

	constructor() {
		super();
	}

	get isGradient() {
		return this._isGradient;
	}
	set isGradient(val: boolean) {
		if (val === this._isGradient) {
			return;
		}
		this._isGradient = val;
		if (val) {
			this.activateGradient();
		} else {
			this.activateSolid();
		}
		this.dispatchEvent(this.change);
	}

	get allowGradient() {
		return this._allowGradient;
	}
	set allowGradient(val: boolean) {
		if (val === this._allowGradient) {
			return;
		}
		this._allowGradient = val;
	}

	get value(): Color | string {
		if (!this.allowGradient) {
			if (!this.isSolidTransparent) {
				return this.nativeSolidInput.value;
			} else {
				return 'transparent';
			}
		}

		if (this.isGradient) {
			return new Color({
				isGradient: true,
				gradientColor1: this.nativeGradientInput1.value,
				gradientColor2: this.nativeGradientInput2.value,
				gradientAngle: parseInt(this.gradientAngleInput.value)
			});
		}
		if (!this.isSolidTransparent) {
			return new Color(this.nativeSolidInput.value);
		}
		return new Color({
			isGradient: false,
			solidColor: 'transparent'
		});
	}

	set value(color: Color | string) {
		if (color === null || color === undefined || (typeof color === 'string' && color.toLowerCase() === 'transparent')) {
			this.isSolidTransparent = true;
			this.isGradient = false;
			this.dispatchEvent(this.change);
			return;
		}
		if (typeof color === 'string') {
			this.isSolidTransparent = false;
			this.nativeSolidInput.value = color;
			this.isGradient = false;
		} else {
			if (color.isGradient) {
				this.nativeGradientInput1.value = color.gradientColor1;
				this.nativeGradientInput2.value = color.gradientColor2;
				this.gradientAngleInput.value = color.gradientAngle.toString();
				this.isGradient = true;
				this.dispatchEvent(this.change);
				return;
			}
			if (color.solidColor) {
				this.isSolidTransparent = color.solidColor.toLowerCase() === 'transparent';
				this.nativeSolidInput.value = color.solidColor;
			} else {
				this.isSolidTransparent = true;
			}
			this.isGradient = false;
		}

		this.dispatchEvent(this.change);
	}

	componentDidMount() {
		this.gradientSelectorButton = this.getChildElement('.color-picker-type-button-gradient');
		this.solidSelectorButton = this.getChildElement('.color-picker-type-button-solid');
		this.colorDisplayBox = this.getChildElement('.color-display-box');

		this.nativeSolidInput = this.getChildElement('.color-picker-solid-color-input');
		this.nativeGradientInput1 = this.getChildElement('.color-picker-gradient-color-input1');
		this.nativeGradientInput2 = this.getChildElement('.color-picker-gradient-color-input2');

		this.colorPickerTypesElement = this.getChildElement('.color-picker-types');
		this.gradientInputbutton1 = this.getChildElement('.color-picker-gradient-select-color-button.button1');
		this.gradientInputbutton2 = this.getChildElement('.color-picker-gradient-select-color-button.button2');

		this.gradientAngleInput = this.getChildElement('.color-picker-gradient-angle-input');
		this.gradientAngleValueElement = this.getChildElement('.color-picker-gradient-angle-value');

		this.gradientControlsElement = this.getChildElement('.color-picker-gradient-controls');
		this.solidStandardColorsElement = this.getChildElement('.color-picker-solid-standard');

		this.colorPickerButtonTypeSolid = this.getChildElement('.color-picker-type-button-solid');


		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.polyfillForIE();
		this.renderComponent();
		this.bindEvents();
	}

	private polyfillForIE() {
		if (BomUtility.isInternetExplorer()) {
			new ColorInputPolyfill(this).init('solid-color-input');
			new ColorInputPolyfill(this).init('gradient-color-input-1');
			new ColorInputPolyfill(this).init('gradient-color-input-2');
		}
	}
	renderComponent() {
		if (this.allowGradient) {
			this.colorPickerTypesElement.style.display = 'flex';
			if (this.isGradient) {
				this.activateGradient();
			} else {
				this.activateSolid();
			}
			return;
		}
		this.colorPickerTypesElement.style.display = 'none';
		this.colorPickerButtonTypeSolid.style.cursor = 'auto';
		this.activateSolid();
	}

	bindEvents() {
		this.gradientSelectorButton.addEventListener('click', () => {
			this.isGradient = true;
		});
		this.solidSelectorButton.addEventListener('click', () => {
			this.isGradient = false;
		});

		this.colorDisplayBox.addEventListener('click', () => {
			if (this.isGradient) {
				return;
			}
			this.nativeSolidInput.click();
		});
		this.nativeSolidInput.addEventListener('change', () => {
			this.isSolidTransparent = false;
			this.setSolidPreview();
			this.dispatchEvent(this.change);
		});

		const solidStandardColorElements = this.getChildElements<HTMLElement>('.color-picker-solid-standard-color');
		solidStandardColorElements.forEach(colorElement => {
			colorElement.addEventListener('click', () => {
				const elementColor = colorElement.dataset['color'];
				if (!elementColor || elementColor.trim() === '' || elementColor.toLowerCase() === 'transparent') {
					this.isSolidTransparent = true;
					this.unsetSolidPreview()
				} else {
					this.isSolidTransparent = false;
					this.nativeSolidInput.value = elementColor;
					this.setSolidPreview();
				}
				this.dispatchEvent(this.change);
			});
		});


		this.gradientInputbutton1.addEventListener('click', () => {
			this.nativeGradientInput1.click();
		});
		this.gradientInputbutton2.addEventListener('click', () => {
			this.nativeGradientInput2.click();
		});
		this.gradientAngleInput.addEventListener('change', () => {
			this.setGradientAnglePreview();
			this.setGradientPreview();
			this.dispatchEvent(this.change);
		});
		this.gradientAngleInput.addEventListener('input', () => {
			this.setGradientAnglePreview();
			this.setGradientPreview();
			this.dispatchEvent(this.change);
		});
		this.nativeGradientInput1.addEventListener('change', () => {
			this.setGradientPreview();
			this.dispatchEvent(this.change);
		});
		this.nativeGradientInput2.addEventListener('change', () => {
			this.setGradientPreview();
			this.dispatchEvent(this.change);
		});

	}

	setGradientAnglePreview() {
		this.gradientAngleValueElement.innerHTML = `${this.gradientAngleInput.value}deg`;
	}

	activateSolid() {
		this.gradientSelectorButton.classList.remove('active');
		this.solidSelectorButton.classList.add('active');

		this.gradientControlsElement.style.display = 'none';
		this.solidStandardColorsElement.style.display = 'flex';

		this.colorDisplayBox.style.background = 'none';
		this.colorDisplayBox.style.cursor = 'pointer';

		if (this.isSolidTransparent) {
			this.unsetSolidPreview();
		} else {
			this.setSolidPreview();
		}
	}
	activateGradient() {
		if (!this.allowGradient) {
			return;
		}
		this.solidSelectorButton.classList.remove('active');
		this.gradientSelectorButton.classList.add('active');

		this.colorDisplayBox.style.cursor = 'auto';

		this.solidStandardColorsElement.style.display = 'none';
		this.gradientControlsElement.style.display = 'block';

		this.styleColorDisplayBox('filled');
		this.setGradientPreview();
	}

	setSolidPreview() {
		if (this.isGradient) {
			return;
		}
		this.colorDisplayBox.style.backgroundColor = this.nativeSolidInput.value;
		this.styleColorDisplayBox('filled');
	}
	unsetSolidPreview() {
		if (this.isGradient) {
			return;
		}
		this.colorDisplayBox.style.backgroundColor = 'unset';
		this.styleColorDisplayBox('empty');
	}

	setGradientPreview() {
		if (!this.isGradient) {
			return;
		}
		const color1 = this.nativeGradientInput1.value;
		const color2 = this.nativeGradientInput2.value;
		const angle = this.gradientAngleInput.value;
		this.setGradientAnglePreview();
		this.colorDisplayBox.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
	}

	private styleColorDisplayBox(style: 'filled' | 'empty') {
		const colorAddButton = this.colorDisplayBox.querySelector('.color-add-button') as HTMLElement;
		const colorAddText = this.colorDisplayBox.querySelector('.color-add-text') as HTMLElement;
		if (style === 'filled') {
			this.colorDisplayBox.style.border = 'none';
			colorAddButton.style.display = 'none';
			colorAddText.style.display = 'none';
		}
		if (style === 'empty') {
			this.colorDisplayBox.style.border = `1.5px dashed ${Colors.secondary}`;
			colorAddButton.style.display = 'flex';
			colorAddText.style.display = 'block';
		}
	}

	private static get observedAttributes() {
		return ['name', 'allow-gradient'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'name':
				this.name = newVal;
				break;
			case 'allow-gradient':
				this.allowGradient = newVal === 'true' ? true : false;
				break;
		}
	}
}
