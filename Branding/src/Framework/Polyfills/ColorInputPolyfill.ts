// https://github.com/dciccale/nativeColorPicker

import CustomHTMLBaseElement from "../../Elements/CustomHTMLBaseElement";

export default class ColorInputPolyfill {

	private elem: CustomHTMLBaseElement;
	private started: boolean;
	private color: string;
	private inputs: any;
	private hasNativeColorSupport: boolean;
	private input: HTMLInputElement;

	constructor(_elem: CustomHTMLBaseElement) {
		this.elem = _elem;
		this.started = false;
		this.color = '#000000';
		this.inputs = {};
		this.hasNativeColorSupport = false;
	}

	init(inputId) {
		this.start();

		if (this.hasNativeColorSupport) {
			return;
		}

		if (typeof inputId !== 'string') {
			throw 'inputId have to be a string id selector';
		}

		// set the input
		this.input = (this.inputs[inputId] = (this.inputs[inputId]) || this.elem.getChildElement(`#${inputId}`));

		if (!this.input) {
			throw 'There was no input found with id: "' + inputId + '"';
		}

		// input defaults
		if (this.input.value) {
			this.color = this.input.value;
		}
		this.input.value = this.color;
		(this.input as any).unselectable = 'on';
		this.css(this.input, {
			backgroundColor: this.color,
			borderWidth: '0.4em 0.3em',
			width: '3em',
			cursor: 'default',
			color: this.color
		});

		// register input event
		this.input.onclick = () => {
			this.onClick(this.input.id);
		};
	}

	// initialize once
	start() {
		// is already started
		if (this.started) {
			return;
		}

		// test if browser has native support for color input
		try { this.hasNativeColorSupport = !!(document.createElement('input').type = 'color'); } catch (e) { };

		// no native support...
		if (!this.hasNativeColorSupport) {
			// create object element
			var object_element: any = document.createElement('object');
			object_element.classid = 'clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b';
			// set attributes
			object_element.id = 'colorHelperObj';
			this.css(object_element, {
				width: '0',
				height: '0'
			});
			this.elem.appendChildElement(object_element);
		}
		// mark as started
		this.started = true;
	}

	// destroys the plugin
	destroy(inputId) {
		var i;
		// destroy one input or all the plugin if no input id
		if (typeof inputId === 'string') {
			this.off(this.inputs[inputId]);
		} else {
			// remove helper object
			this.elem.removeChildElement(this.elem.getChildElement('#colorHelperObj'));
			// remove input events and styles
			for (i in this.inputs) {
				this.off(this.inputs[i]);
			}
			// mark not started
			this.started = false;
		}
	}

	off(input) {
		input.onclick = null;
		this.css(input, {
			backgroundColor: '',
			borderWidth: '',
			width: '',
			cursor: ''
		});
	}

	// input focus function
	onClick(inputId) {
		this.input = this.inputs[inputId];
		this.color = this.getColor();
		this.input.value = this.color;
		this.css(this.input, {
			backgroundColor: this.color,
			color: this.color
		});

		var event = document.createEvent('Event');
		event.initEvent('change', true, true);
		this.input.dispatchEvent(event);
	}

	// gets the color from the object
	// and normalize it
	getColor() {
		// get decimal color, (passing the previous one)
		// and change to hex
		try {
			var hex = (this.elem.getChildElement('#colorHelperObj') as any).ChooseColorDlg(this.color.replace(/#/, '')).toString(16);
		} catch (e) {
			alert('Sørg for, at du kører Internet Explorer som administrator');
		}

		// add extra zeroes if hex number is less than 6 digits
		if (hex.length < 6) {
			var tmpstr = '000000'.substring(0, 6 - hex.length);
			hex = tmpstr.concat(hex);
		}

		return '#' + hex;
	}

	// set css properties
	css(el, props) {
		for (var prop in props) {
			el.style[prop] = props[prop];
		}
	}
}
