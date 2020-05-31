import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import * as intlTelInput from 'intl-tel-input';
import { Plugin } from 'intl-tel-input';
import { MakeRequest } from '@luftborn/utilities';

@CustomElement({
	selector: 'int-phone-element',
	template: `
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.0/css/intlTelInput.css" >
			<div class="wrapper">
				<input type="tel" id="phone-field"  />
			</div>`,
	style: `
    :host{
            width:100%;
    }
    .wrapper{
            display:flex;
    }
    .iti {
        width: 100% !important;
    }
    input{
            box-sizing: border-box;
            width: 100% !important;
            border: none;
            background-color: #f1f4ff;
            margin: 2px;
            resize: none;
    }
           `,
	useShadow: true,
})
export class IntPhoneFieldElement extends CustomInputElement {
	phone: HTMLInputElement;
	fullPhone: HTMLInputElement;
	intlTelInput: Plugin;
	constructor() {
		super();
	}

	get value(): string {
		return this.intlTelInput.getNumber();
	}

	set value(value: string) {
		this.phone.value = value;
	}

	get valid(): boolean {
		const patternValid =
			!this.intlTelInput.getNumber() || this.intlTelInput.isValidNumber();
		return patternValid && this.phone.validity.valid;
	}

	connectedCallback(): void {
		this.setIntlTelInput();
		super.connectedCallback();
	}

	initChildInputs() {
		this.phone.addEventListener('change', this.change.bind(this));
		if (this.required) {
			this.phone.setAttribute('required', '');
		}
	}
	setIntlTelInput() {
		this.phone = super.getChildInput('#phone-field');
		this.intlTelInput = intlTelInput(this.phone, {
			geoIpLookup: (success, failure) => {
				return new MakeRequest(
					'https://ipinfo.io/json?token=8226138217a68a',
					'get',
					{ 'content-type': 'application/json' },
				)
					.send()
					.then((request: any) => {
						const res = JSON.parse(request);
						return success(res.country);
					})
					.catch(err => {
						return success('DK');
					});
			},
			hiddenInput: 'fullphone',
			initialCountry: 'auto',
			nationalMode: true,
			utilsScript:
				'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/utils.js',
		} as any);
		this.intlTelInput.promise.then(e => {
			setTimeout(() => {
				this.fullPhone = super.getChildInput('[name="fullphone"]');
			}, 1000);
		});
	}
	// events
	public change($event): void {
		this.touched = true;
		this.onChange.emit(new CustomElementEventArgs(this.value, 'change'));
	}

	public validate(): void {
		this.valid;
		this.onValidate.emit(
			new CustomElementEventArgs(this.value, 'validate'),
		);
	}
}
