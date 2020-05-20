import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';

@CustomElement({
    selector: 'numeric-element',
    template: `
			<div class="wrapper">
				<input type="number" id='numeric-field'/>
			</div>`,
    style: `
    :host{
            width:100%;
    }
    .wrapper{
            display:flex;
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
export class NumericFieldElement extends CustomInputElement {
    number: HTMLInputElement;

    constructor() {
        super();
    }

    get value(): any {
        if (isNaN(this.number.valueAsNumber)) {
            return '';
        }
        return this.number.valueAsNumber;
    }

    set value(value: any) {
        this.number.valueAsNumber = value;
    }

    get valid(): boolean {
        return this.number.validity.valid;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    initChildInputs() {
        this.number = super.getChildInput('#numeric-field');
        this.number.addEventListener('change', this.change.bind(this));
        if (this.required) {
            this.number.setAttribute('required', '');
        }
        if (this.max) {
            this.number.setAttribute('max', this.max);
        }
        if (this.min) {
            this.number.setAttribute('min', this.min);
        }
        if (this.step) {
            this.number.setAttribute('step', this.step);
        }
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
