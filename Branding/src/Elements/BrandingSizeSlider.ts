import CustomElement from '../Framework/custom-element.decorator';
import CustomHTMLBaseElement from './CustomHTMLBaseElement';
import Colors from '../Framework/Constants/Colors';

@CustomElement({
	selector: 'esignatur-branding-size-slider',
	template: `
		<input type="range" min="100" max="200" value="100" class="size-slider" id="myRange">
		<div class="size-slider-text">
			<div class="size-slider-text-item normal">Normal</div>
			<div class="size-slider-text-item medium">Medium</div>
			<div class="size-slider-text-item large">Stor</div>
		</div>
	`,
	style: `	
		.size-slider {
			-webkit-appearance: none;
			appearance: none;
			width: 100%;
			height: 5px;
			border-radius: 2px;
			background: ${Colors.quaternary};
			outline: none;
		}
		.size-slider::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: ${Colors.primary};
			cursor: pointer;
		}
		
		.size-slider::-moz-range-thumb {
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: ${Colors.primary};
			cursor: pointer;
		}
		.size-slider-text {
			display: flex;
			justify-content: space-between;
			color: ${Colors.secondary};
			font-size: 10px;
			text-align: center;
		}
		.size-slider-text-item {
			cursor: pointer;
			user-select: none;
			width: 33.33%;
		}
		.size-slider-text-item:first-child {
			text-align: left;
		}
		.size-slider-text-item:last-child {
			text-align: right;
		}
	`,
	useShadow: false,
})
export default class BrandingSizeSlider extends CustomHTMLBaseElement {

	private change = new Event('change');
	private nativeInput: HTMLInputElement;

	private minElement: HTMLElement;
	private middleElement: HTMLElement;
	private maxElement: HTMLElement;

	constructor() {
		super();
	}

	get value() {
		return this.nativeInput.value;
	}

	set value(val) {
		this.nativeInput.value = val;
		this.dispatchEvent(this.change);
	}

	componentDidMount() {
		this.nativeInput = this.getChildElement('input');
		this.minElement = this.getChildElement('.size-slider-text-item.normal');
		this.middleElement = this.getChildElement('.size-slider-text-item.medium');
		this.maxElement = this.getChildElement('.size-slider-text-item.large');

		this.bindEvents();
	}

	private bindEvents() {
		this.nativeInput.addEventListener('change', () => {
			this.dispatchEvent(this.change);
		});
		this.nativeInput.addEventListener('input', () => {
			this.dispatchEvent(this.change);
		});

		this.minElement.addEventListener('click', () => {
			this.nativeInput.value = this.nativeInput.min;
			this.dispatchEvent(this.change);
		});
		this.middleElement.addEventListener('click', () => {
			const min = parseInt(this.nativeInput.min);
			const max = parseInt(this.nativeInput.max);
			const mean = (min + max) / 2;
			this.nativeInput.value = mean.toString();
			this.dispatchEvent(this.change);
		});
		this.maxElement.addEventListener('click', () => {
			this.nativeInput.value = this.nativeInput.max;
			this.dispatchEvent(this.change);
		});

	}

	private static get observedAttributes() {
		return ['name', 'value', 'min', 'max'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'name':
				if (!this.nativeInput) {
					return;
				}
				this.nativeInput.name = newVal;
				break;
			case 'value':
				if (!this.nativeInput) {
					return;
				}
				this.value = newVal;
				break;
			case 'min':
				if (!this.nativeInput) {
					return;
				}
				this.nativeInput.min = newVal;
				return;
			case 'max':
				if (!this.nativeInput) {
					return;
				}
				this.nativeInput.max = newVal;
				return;
		}
	}
}
