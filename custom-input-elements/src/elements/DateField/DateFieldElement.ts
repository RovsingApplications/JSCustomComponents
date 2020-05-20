import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';

@CustomElement({
    selector: 'date-element',
    template: `
			<div class="wrapper">
				<input type="date" id='date-field'/>
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
export class DateFieldElement extends CustomInputElement {
    date: HTMLInputElement;

    constructor() {
        super();
    }

    get value(): string {
        return this.date.value;
    }

    set value(value: string) {
        this.date.value = value;
    }

    get valid(): boolean {
        return this.date.validity.valid;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    initChildInputs() {
        this.date = super.getChildInput('#date-field');
        this.date.addEventListener('change', this.change.bind(this));
        if (this.required) {
            this.date.setAttribute('required', '');
        }
        if (this.max) {
            this.date.setAttribute('max', this.max);
        }
        if (this.min) {
            this.date.setAttribute('min', this.min);
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
