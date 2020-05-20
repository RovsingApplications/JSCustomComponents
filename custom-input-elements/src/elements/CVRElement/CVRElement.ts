import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import CprValidator from '../../framework/Validation/Validators/CPR';
import CvrValidator from '../../framework/Validation/Validators/CVR';

@CustomElement({
    selector: 'cvr-element',
    template: `
			<div class="wrapper">
				<input type="text" id='cvr-field' placeholder='DDMMYY-SSSS'/>
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
export class CVRElement extends CustomInputElement {
    text: HTMLInputElement;
    validator: CvrValidator = new CvrValidator();

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
        return this.validator.isSatisfiedBy(this.value, !this.required);
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    initChildInputs() {
        this.text = super.getChildInput('#cvr-field');
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
