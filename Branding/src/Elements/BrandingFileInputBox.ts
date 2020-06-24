import CustomElement from '../Framework/custom-element.decorator';
import CustomHTMLBaseElement from './CustomHTMLBaseElement';
import Colors from '../Framework/Constants/Colors';
import SVGs from '../Framework/Constants/SVGs';

@CustomElement({
	selector: 'esignatur-branding-file-input-box',
	template: `
		<input type="file" hidden />
		<div class="file-input-info-actions">
			<div class="file-input-info">
				Billedformat: 
				<span class="file-input-info-format">PNG</span>
			</div>
			<div class="file-input-actions">${SVGs.trashSVG}</div>
		</div>
		<div class="file-input-box">
			<div class="file-input-box-content">
				<div class="file-input-add-button">${SVGs.addButton}</div>
				<div class="file-input-add-text"></div>
			</div>
		</div>
	`,
	style: `
	.file-input-info-actions {
		display: none;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2px;
	}
	.file-input-info {
		font-size: 12px;
		color: ${Colors.senary};
		font-weight: 500;
	}
	.file-input-actions svg {
		width: 15px;
		height: 15px;
		cursor: pointer;
	}
	.file-input-actions svg path {
		fill: ${Colors.secondary};
	}
	.file-input-actions svg:hover path {
		fill: ${Colors.primary};
	}
	.file-input-box {
		user-select: none;
		cursor: pointer;
		width: 100%;
		height: 80px;
		border: 1.5px dashed ${Colors.secondary};
		display: flex;
		align-items: center;
		justify-content: center;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	.file-input-box-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.file-input-add-button {
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.file-input-add-button svg path {
		fill: ${Colors.secondary};
	}
	.file-input-add-text {
		color: ${Colors.secondary};
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 1px;
		margin-top: 5px;
	}
	`,
	useShadow: false,
})
export default class BrandingFileInputBox extends CustomHTMLBaseElement {

	private change = new Event('change');
	private nativeInputElement: HTMLInputElement;
	private fileInputBox: HTMLElement;
	private addTextElement: HTMLElement;
	private fileInputBoxContentElement: HTMLElement;
	private infoActionsBar: HTMLElement;
	private removeButton: HTMLElement;
	private fileFormatElement: HTMLElement;
	private _value: string;

	constructor() {
		super();
	}

	get files() {
		return this.nativeInputElement.files;
	}

	get value() {
		return this._value;
	}
	set value(val: string) {
		if (!val || val.trim() === '') {
			this.removePreview();
			this.nativeInputElement.value = null;
			this._value = null;
		} else {
			this._value = val;
			this.displayPreview();
		}
		this.dispatchEvent(this.change);
	}


	componentDidMount() {
		this.nativeInputElement = this.getChildElement('input');
		this.fileInputBox = this.getChildElement('.file-input-box');
		this.addTextElement = this.getChildElement('.file-input-add-text');
		this.fileInputBoxContentElement = this.getChildElement('.file-input-box-content');
		this.infoActionsBar = this.getChildElement('.file-input-info-actions');
		this.removeButton = this.getChildElement('.file-input-actions svg');
		this.fileFormatElement = this.getChildElement('.file-input-info-format');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.bindEvents();
	}

	private bindEvents() {
		this.nativeInputElement.addEventListener('change', () => {
			this.nativeInputChange();
		});
		this.fileInputBox.addEventListener('click', () => {
			this.nativeInputElement.click();
		});
		this.removeButton.addEventListener('click', () => {
			this.value = null;
		});
	}

	nativeInputChange(): void {
		if (!this.files || !this.files.length) {
			return;
		}
		const file = this.files[0];
		if (!file.type.startsWith('image')) {
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			this.value = reader.result as string;
			this.fileFormatElement.innerHTML = this.files[0].type.split('/')[1].toUpperCase();
			this.dispatchEvent(this.change);
		};
	}

	private displayPreview() {
		this.fileInputBoxContentElement.style.display = 'none';
		this.fileInputBox.style.backgroundImage = `url(${this.value})`;
		this.infoActionsBar.style.display = 'flex';
	}
	private removePreview() {
		this.fileInputBoxContentElement.style.display = 'flex';
		this.fileInputBox.style.backgroundImage = null;
		this.infoActionsBar.style.display = 'none';
	}

	private static get observedAttributes() {
		return ['name', 'text'];
	}

	protected attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	protected attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'name':
				if (!this.nativeInputElement) {
					return;
				}
				this.nativeInputElement.name = newVal;
				break;
			case 'text':
				if (!this.addTextElement) {
					return;
				}
				this.addTextElement.innerHTML = newVal;
				break;
		}
	}
}
