import CustomElement from '../Framework/custom-element.decorator';
import CustomHTMLBaseElement from './CustomHTMLBaseElement';
import Colors from '../Framework/Constants/Colors';
import { AlignmentPositionEnum } from '../Framework/Models/AlignmentPositionEnum';

@CustomElement({
	selector: 'esignatur-branding-allignment-radio-input',
	template: `
		<div class="allignment-radio-group">
			<span class="allignment-radio-container allignment-radio-container-left">
				<input type="radio" value="${AlignmentPositionEnum.left}">
				<span class="allignment-radio-checkmark allignment-radio-checkmark-left">
					<span class="icon">&larr;</span>
				</span>
			</span>

			<span class="allignment-radio-container allignment-radio-container-center">
				<input type="radio" value="${AlignmentPositionEnum.center}">
				<span class="allignment-radio-checkmark allignment-radio-checkmark-center">
					<span class="icon">&#8597;</span>
				</span>
			</span>

			<span class="allignment-radio-container allignment-radio-container-right">
				<input type="radio" value="${AlignmentPositionEnum.right}">
				<span class="allignment-radio-checkmark allignment-radio-checkmark-right">
					<span class="icon">&rarr;</span>
				</span>
			</span>
		</div>
	`,
	style: `
	.allignment-radio-group {
		display: flex;
		justify-content: space-between;
	}
	.allignment-radio-container {
		width: 109px;
		height: 17px;
		cursor: pointer;
		background-color: ${Colors.quaternary};
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		color: ${Colors.secondary};
		font-weight: 700;
	}
	.allignment-radio-container input {
		display: none;
	}
	.allignment-radio-container-center {
		margin: 0 8px;
	}
	.allignment-radio-checkmark .icon {
		font-size: 12px;
		position: relative;
		top: -2.5px;
	}
	.allignment-radio-checkmark-left {
		border-left-width: 1.5px;
		border-left-style: dotted;
		border-left-color: ${Colors.secondary};
		line-height: 0.7;
		padding-left: 1px;
	}
	.allignment-radio-checkmark-right {
		border-right-width: 1.5px;
		border-right-style: dotted;
		border-right-color: ${Colors.secondary};
		line-height: 0.7;
		padding-right: 1px;
	}
	.allignment-radio-checkmark-center {
		border-left-width: 1.5px;
		border-left-style: dotted;
		border-left-color: ${Colors.secondary};
		border-right-width: 1.5px;
		border-right-style: dotted;
		border-right-color: ${Colors.secondary};
		line-height: 0.7;
		padding: 0 3px;
	}
	.allignment-radio-container input:checked ~ .allignment-radio-checkmark {
		color: ${Colors.primary};
	}
	.allignment-radio-container input:checked ~ .allignment-radio-checkmark-left {
		border-left-color: ${Colors.primary};
	}
	.allignment-radio-container input:checked ~ .allignment-radio-checkmark-right {
		border-right-color: ${Colors.primary};
	}
	.allignment-radio-container input:checked ~ .allignment-radio-checkmark-center {
		border-left-color: ${Colors.primary};
		border-right-color: ${Colors.primary};
	}
	`,
	useShadow: false,
})
export default class BrandingAllignmentRadioInput extends CustomHTMLBaseElement {

	private change = new Event('change');
	private buttonLeft: HTMLElement;
	private buttonRight: HTMLElement;
	private buttonCenter: HTMLElement;
	private nativeButtonLeft: HTMLInputElement;
	private nativeButtonRight: HTMLInputElement;
	private nativeButtonCenter: HTMLInputElement;

	constructor() {
		super();
	}

	get value() {
		if (this.nativeButtonLeft.checked) {
			return this.nativeButtonLeft.value;
		}
		if (this.nativeButtonRight.checked) {
			return this.nativeButtonRight.value;
		}
		if (this.nativeButtonCenter.checked) {
			return this.nativeButtonCenter.value;
		}
	}

	set value(val) {
		if (this.nativeButtonLeft.value === val) {
			this.checkLeft();
		}
		if (this.nativeButtonRight.value === val) {
			this.checkRight();
		}
		if (this.nativeButtonCenter.value === val) {
			this.checkCenter();
		}
	}

	private checkLeft() {
		this.nativeButtonLeft.checked = true;
		this.nativeButtonRight.checked = false;
		this.nativeButtonCenter.checked = false;
		this.dispatchEvent(this.change);
	}
	private checkRight() {
		this.nativeButtonLeft.checked = false;
		this.nativeButtonRight.checked = true;
		this.nativeButtonCenter.checked = false;
		this.dispatchEvent(this.change);
	}
	private checkCenter() {
		this.nativeButtonLeft.checked = false;
		this.nativeButtonRight.checked = false;
		this.nativeButtonCenter.checked = true;
		this.dispatchEvent(this.change);
	}

	componentDidMount() {
		this.buttonLeft = this.getChildElement('.allignment-radio-container-left');
		this.nativeButtonLeft = this.buttonLeft.querySelector('input');
		this.buttonRight = this.getChildElement('.allignment-radio-container-right');
		this.nativeButtonRight = this.buttonRight.querySelector('input');
		this.buttonCenter = this.getChildElement('.allignment-radio-container-center');
		this.nativeButtonCenter = this.buttonCenter.querySelector('input');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.bindEvents();
	}

	private bindEvents() {
		this.buttonLeft.addEventListener('click', () => {
			this.checkLeft();
		});
		this.buttonRight.addEventListener('click', () => {
			this.checkRight();
		});
		this.buttonCenter.addEventListener('click', () => {
			this.checkCenter();
		});
	}

	private static get observedAttributes() {
		return ['name', 'value'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'name':
				if (!this.buttonLeft || !this.buttonRight || !this.buttonCenter) {
					return;
				}
				this.nativeButtonLeft.name = newVal;
				this.nativeButtonRight.name = newVal;
				this.nativeButtonCenter.name = newVal;
				break;
			case 'value':
				if (!this.buttonLeft || !this.buttonRight || !this.buttonCenter) {
					return;
				}
				this.value = newVal;
				break;
		}
	}
}
