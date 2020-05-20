import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import { StringUtil } from '../../framework/Utilities/StringUtil';

@CustomElement({
    selector: 'radio-group-element',
    template: `
			<div class="wrapper">
               
			</div>`,
    style: `
            :host{
                width:100%;
            }
            .wrapper{
                display:flex;
                justify-content: center;
            }
            .radio-button {
                width: auto;
                margin: auto 3px;
                display: flex;
                flex-grow: 0.1;
                justify-content: space-around;
            }
            input{
                box-sizing: border-box;
                width: auto !important;
                border: none;
                background-color: #f1f4ff;
                margin: 2px;
                resize: none;
            }
           `,
    useShadow: true,
})
export class RadioButtonGroupElement extends CustomInputElement {
    radioButton: HTMLInputElement[];
    radioButtonTemplate = `
    <div class='radio-button'>
        <label for="{2}">{1}</label>
        <input type='radio' name='{0}' value="{1}" id="{2}" {3}/>
    </div>`;

    constructor() {
        super();
    }

    get value(): string {
        return this.radioButton.filter(c => c.checked).map(c => c.value)[0];
    }

    set value(value: string) {
        let matchedRadio = this.radioButton.filter(c => c.value === value)[0];
        if (matchedRadio) {
            matchedRadio.setAttribute('checked', '');
        }
    }

    get valid(): boolean {
        if (this.required) {
            return this.radioButton.filter(c => c.checked).length > 0;
        } else {
            return true;
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    initChildInputs() {
        this.addRadioButtons();
        this.radioButton = super.getChildInputs(`[name=${this.name}]`);
        this.radioButton.forEach(radio =>
            radio.addEventListener('change', this.change.bind(this)),
        );
    }

    private addRadioButtons() {
        const wrapper = super.getChildElement('.wrapper');
        this.options.forEach((element, index) => {
            wrapper.insertAdjacentHTML(
                'beforeend',
                StringUtil.StringFormat(
                    this.radioButtonTemplate,
                    this.name,
                    element,
                    `${this.name}-${index}`,
                    `${this.required ? 'required' : ''}`,
                ),
            );
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
