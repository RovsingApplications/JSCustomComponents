import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';

@CustomElement({
    selector: 'text-area-element',
    template: `
			<div class="wrapper">
				<textarea rows=5 id='text-area-field'></textarea>
			</div>`,
    style: `
    :host{
            width:100%;
    }
    .wrapper{
            display:flex;
    }
    textarea{
            box-sizing: border-box;
            width: 100% !important;
            
            border: "solid 1px orange";
            background-color: #f1f4ff;
            margin: 2px;
            resize: none;
    }
           `,
    useShadow: true,
})
export class TextAreaElement extends CustomInputElement {
    text: HTMLInputElement;

    constructor() {
        super();
    }

    get value(): string {
        return `${this.text.value}`;
    }

    set value(value: string) {
        this.text.value = value;
    }

    get valid(): boolean {
        return this.text.validity.valid;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    initChildInputs() {
        this.text = super.getChildInput('#text-area-field');
        this.text.addEventListener('change', this.change.bind(this));
        if (this.required) {
            this.text.setAttribute('required', '');
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
