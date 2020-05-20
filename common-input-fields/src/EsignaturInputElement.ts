import "@webcomponents/webcomponentsjs/webcomponents-bundle";
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';

import CaseConverter from "./Translations/CaseConverter";
import IFieldModel from "./models/IFieldModel";
import IOptionsItem from "./models/IOptionsItem";

export default class EsignaturInputElement extends HTMLElement {
	fieldData: IFieldModel = {} as IFieldModel;
	dependencyElements: HTMLElement[];
	reportUrl: string;

	constructor() {
		super();
	}

	saveChanges(): void {
		if (!this.reportUrl) return;
		const xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('post', this.reportUrl);
		const prefix = `${this.id}: `;

		xmlHttpRequest.onloadend = () => {
			console.log(`${prefix}SAVED`);
		};

		xmlHttpRequest.onerror = (error) => {
			console.log(`${prefix}Save failed`);
			console.log(xmlHttpRequest.statusText);
		};

		const data = {
			id: parseInt(this.id, 10),
			value: this.value
		}

		xmlHttpRequest.setRequestHeader('content-type', 'application/json');
		xmlHttpRequest.send(JSON.stringify(data));
	}

	b64EncodeUnicode(str) {
		return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode(parseInt(p1, 16))
		}))
	}

	b64DecodeUnicode(str) {
		return decodeURIComponent(Array.prototype.map.call(atob(str), c => {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
		}).join(''))
	}

	getElementData(): void {
		this.fieldData.fieldId = parseInt(this.getAttribute('esig-fieldid'), 10);
		this.fieldData.value = this.getAttribute('esig-value');

		this.fieldData.mandatory = !!this.getAttribute('esig-mandatory');
		this.fieldData.customErrorMessage = this.getAttribute('esig-errortext');
		this.fieldData.dependentOn = parseInt(this.getAttribute('esig-dependenton'), 10);
		this.fieldData.dependentValue = this.getAttribute('esig-dependencyvalue');
		this.fieldData.title = this.getAttribute('esig-title');
		this.fieldData.description = this.getAttribute('esig-description');
		this.fieldData.fieldName = this.getAttribute('esig-fieldName');
		this.reportUrl = this.getAttribute('esig-reporturl');
		this.parseData();
	}

	getBase64Data(): void {
		const base64Options = this.getAttribute('esig-options');
		if (!base64Options) {
			return;
		}
		const jsonOptions = this.b64DecodeUnicode(base64Options);
		const options = JSON.parse(jsonOptions);
		this.fieldData.options = options.map(x => new CaseConverter(x).camel()) as IOptionsItem[];
	}

	parseData(): void {
		try {
			const rawOptions = JSON.parse(this.children[0].innerHTML);
			const camelCasedOptions = rawOptions.map(x => new CaseConverter(x).camel()) as IOptionsItem[];
			this.fieldData.options = camelCasedOptions;
			this.removeChild(this.children[0]);
		} catch (ex) {
			console.error(ex);
			this.getBase64Data();
		}
	}
	get value() {
		return this.getValue;
	}

	set value(value) {
		return;
	}

	get valid() {
		return this.isValid;
	}

	get name() {
		return this.getName;
	}

	get id(): string {
		return this.getId;
	}

	get required(): boolean {
		return this.fieldData.mandatory;
	}

	get getId(): string {
		return this.fieldData.fieldId.toString(10);
	}

	get getValue(): string {
		return;
	}

	get getName() {
		if (!this.fieldData.fieldName) return null;
		return this.fieldData.fieldName;
	}

	get isValid(): boolean {
		return true;
	}

	validate(): boolean {
		return true;
	}

	static get observedAttributes() {
		return ['value', 'valid'];
	}

	disconnectedCallback(): void {
	}

	adoptedCallback(): void {
	}

	attributeChangedCallback(attrName, oldVal, newVal) { }

	getDependencyElements(): HTMLElement[] {
		if (this.dependencyElements) {
			return this.dependencyElements;
		}

		this.dependencyElements = [].slice.call(document.querySelectorAll(`[data-dependency="${this.fieldData.fieldId}"]`));

		return this.dependencyElements;
	}

	changeEvent() {
		setInterval(() => {
			this.dispatchEvent(new CustomEvent('change', {
				detail: {
					value: this.value
				},
				composed: true,
				bubbles: false
			})
			);
		}, 50);
	}

	setDependency(): void {
		this.getDependencyElements().forEach(element => {
			if (element.getAttribute('data-dependencyvalue') !== this.value) {
				element.style.display = 'none';
				if (element instanceof EsignaturInputElement) {
					element.setDependency();
					return;
				}
				return;
			}

			element.style.display = 'block';
		})
	}
}