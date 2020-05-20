import ArrayUtil from './framework/Utilities/ArrayUtil';
import { CustomInputElement } from './framework/CustomInputElement';
import MakeRequest from './framework/Utilities/MakeRequest';
import { FileFieldElement } from './elements/FileField/FileFieldElement';

export class CustomForm {
    action: string;
    method: string;
    _nativeInputs: HTMLInputElement[];

    public onsubmit: ((this: CustomForm, promise: Promise<any>) => any) | null;

    constructor(private form: HTMLFormElement) {
        this.action = form.action || '';
        this.method = form.method || 'get';
        this.attachForm();
        this.binGroupsToDependency();
    }

    get inputs(): CustomInputElement[] {
        return ArrayUtil.FromNodeList(this.form.querySelectorAll('.group-container:not([hidden]) [custom-input]:not([hidden])'));
    }
    get nativeInputs(): HTMLInputElement[] {
        this._nativeInputs =
            this._nativeInputs ||
            ArrayUtil.FromNodeList(this.form.querySelectorAll('input'));
        return this._nativeInputs;
    }

    get hasFiles(): boolean {
        return this.inputs.some(input => input instanceof FileFieldElement);
    }

    attachForm() {
        this.form.onsubmit = event => {
            event.preventDefault();
            let valid = this.validate();
            if (valid) {
                if (this.onsubmit) {
                    this.onsubmit(this.submit());
                }
            }
        };
    }

    validate(): boolean {
        this.inputs.forEach(input => (<CustomInputElement>input).validate());
        return this.inputs.every(input => (<CustomInputElement>input).valid);
    }

    submit(): Promise<any> {
        let formData = {};
        const headers: any = {};
        this.inputs.map(i => (formData[i.name] = i.value));
        formData = this.extractData();
        return new MakeRequest(this.action, this.method, headers).send(
            formData,
        );
    }
    private extractData(): FormData {
        const formData: FormData = new FormData();
        for (const input of this.inputs) {
            if (input instanceof FileFieldElement) {
                for (let index = 0; index < input.value.length; index++) {
                    const file = input.value[index];
                    formData.append(input.name, file, file.name);
                }
            } else {
                formData.append(`Values[${input.name}]`, input.value);
            }
        }
        for (const input of this.nativeInputs) {
            if (input.name) {
                formData.append(input.name, input.value);
            }
        }
        return formData;
    }

    private binGroupsToDependency() {
        let groupContainers = this.form.querySelectorAll('div.group-container:not([data-depends-on=""])',
        );
        groupContainers.forEach((element: HTMLElement) => {
            let dependentField = element.getAttribute('data-depends-on');
            let dependentValue = element.getAttribute('data-dependent-value');
            let customElement: CustomInputElement = document.forms[0].querySelector(`[name="${dependentField}"]`) as CustomInputElement;
            element.setAttribute("hidden", "");
            customElement.onChange.on(event => {
                if (event.value === dependentValue || event.value.indexOf(dependentValue)>=0) {
                    this.showGroupAndItsDependencies(element);
                } else {
                    this.hideGroupAndItsDependencies(element);
                }
            });
        });
    }

    private hideGroupAndItsDependencies(group: Element) {
        const inputElementsInsideGroup = this.inputs.filter(input => this.isDescendant(group, input));
        group.setAttribute("hidden", "");
        let groupContainers = this.form.querySelectorAll('div.group-container:not([data-depends-on=""])');
        groupContainers.forEach(otherGroup => {
            if(otherGroup !== group){
                let groupDependsOnField = otherGroup.getAttribute('data-depends-on');
                inputElementsInsideGroup.forEach(input => {
                    if(input.name === groupDependsOnField){
                        this.hideGroupAndItsDependencies(otherGroup);
                    }
                });
            }
        });
    }
    private showGroupAndItsDependencies(group: Element) {
        group.removeAttribute("hidden");
        const inputElementsInsideGroup = this.inputs.filter(input => this.isDescendant(group, input));
        let groupContainers = this.form.querySelectorAll('div.group-container:not([data-depends-on=""])');
        groupContainers.forEach(otherGroup => {
            if(otherGroup !== group){
                let groupDependsOnField = otherGroup.getAttribute('data-depends-on');
                let dependentValue = otherGroup.getAttribute('data-dependent-value');
                inputElementsInsideGroup.forEach(input => {
                    if(input.name === groupDependsOnField && (input.value === dependentValue || input.value.indexOf(dependentValue)>=0)){
                        this.showGroupAndItsDependencies(otherGroup);
                    }
                });
            }
        });
	}
    private isDescendant(parent: Element, child: Element) {
		var node = child.parentNode;
		while (node != null) {
			if (node === parent) {
				return true;
			}	
			node = node.parentElement;
		}
		return false;
	}

}
