
export default class FormUtils {
	element: HTMLFormElement;
	constructor(element: HTMLFormElement) {
		this.element = element;
	}
	getFormDataOject() {
		const values = {};
		const inputs = this.element.elements;
		for (let i = 0; i < inputs.length; i++) {
			if (values[inputs[i]['name']] != '')
				values[inputs[i]['name']] = inputs[i]['value'];
		}
		return values;
	}
	getFormDataString() {
		let values = "";
		const inputs = this.element.elements;
		for (let i = 0; i < inputs.length; i++) {
			if (values[inputs[i]['name']])
				values += `${[inputs[i]['name']]}=${inputs[i]['value']}&`;
		}
		return values;
	}
	reset() {
		this.element.reset();
	}
}
