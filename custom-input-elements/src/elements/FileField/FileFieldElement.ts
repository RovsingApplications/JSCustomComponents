import CustomElement from '../../framework/custom-element.decorator';
import { CustomInputElement } from '../../framework/CustomInputElement';
import { CustomElementEventArgs } from '../../framework/CustomEvents';

@CustomElement({
    selector: 'file-element',
    template: `
			<div class="wrapper">
				<input type="file" id='file-field' accept="image/*,application/pdf"/>
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
export class FileFieldElement extends CustomInputElement {
    file: HTMLInputElement;

    constructor() {
        super();
    }

    get value(): FileList {
        return this.file.files;
    }

    set value(files: FileList) {
        this.file.files = files;
    }

    get valid(): boolean {
        return this.file.validity.valid;
    }

    connectedCallback(): void {
        this.initChildInputs();
        super.connectedCallback();
    }

    initChildInputs() {
        this.file = super.getChildInput('#file-field');
        this.file.addEventListener('change', this.change.bind(this));
        if (this.required) {
            this.file.setAttribute('required', '');
        }
        if (this.multi) {
            this.file.setAttribute('multiple', '');
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
