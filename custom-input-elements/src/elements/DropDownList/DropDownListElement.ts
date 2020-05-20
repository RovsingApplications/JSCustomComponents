import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';
import { StringUtil } from '../../framework/Utilities/StringUtil';

@CustomElement({
    selector: 'drop-down-element',
    template: `
			<div class="wrapper">
               <select id='select-list'>
               </select>
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
            select{
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
export class DropDownListElement extends CustomInputElement {
    select: HTMLInputElement;
    optionTemplate = `
    <option value='{0}'>
       {1}
    </option>`;

    constructor() {
        super();
    }

    get value(): string {
        return `${this.select.value}`;
    }

    set value(value: string) {
        this.select.value = value;
    }

    get valid(): boolean {
        return this.select.validity.valid;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    initChildInputs() {
        this.select = super.getChildInput(`#select-list`);
        this.addOptions();
        if (this.required) {
            this.select.setAttribute('required', '');
        }
        if (this.multi) {
            this.select.setAttribute('multiple', '');
        }
        this.select.addEventListener('change', this.change.bind(this));
    }

    private addOptions() {
        this.options.forEach((element, index) => {
            this.select.insertAdjacentHTML(
                'beforeend',
                StringUtil.StringFormat(this.optionTemplate, element, element),
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
