import { CustomElementEvent, CustomElementEventArgs } from "./CustomEvents";
import { DomUtil, ArrayUtil } from "@luftborn/utilities";
import OptionWithDescription from "./Models/OptionWithDescription";

class IDictionary<TValue> {
	[index: string]: TValue;
}
export abstract class CustomInputElement extends HTMLElement {
	private dependentOnList = new IDictionary<boolean>();
	private visibilityState = true;

	protected touched = false;
	protected domUtil: DomUtil;

	protected hasValueDependency: any;
	protected noValueDependency: any;
	protected dependencies: any[];

	public onChange = new CustomElementEvent<CustomElementEventArgs>();
	public onValidate = new CustomElementEvent<CustomElementEventArgs>();
	public onVisibilityChanged = new CustomElementEvent<CustomElementEventArgs>();

	public name: string;
	public options: any[];
	public optionsWithDescriptions: OptionWithDescription[];
	public required: boolean;
	public customValue: string;
	public allDependenciesMustBeMet: boolean = false;
	public multi: boolean = false;
	public max: any;
	public min: any;
	public step: any;

	constructor() {
		super();
	}

	abstract get value(): any;
	abstract set value(value);
	abstract get valid(): boolean;

	abstract initChildInputs(): void;
	abstract validate(): void;
	abstract change($event): void;

	connectedCallback(): void {
		this.init();
		this.setAttributes();
	}

	init(): void {
		this.style.width = "100%";
		this.domUtil = new DomUtil(this);
		this.parseData();
		this.initChildInputs();
		this.bindEvents();
		this.setAttributes();

		window.addEventListener("load", () => {
			this.bindDependencies();
		});
	}

	private parseData(): void {
		try {
			if (!(this.children[0] instanceof HTMLScriptElement)) {
				return;
			}
			let data = JSON.parse(this.children[0].innerHTML);
			this.removeChild(this.children[0]);
			this.options = data.options;
			this.optionsWithDescriptions = data.optionsWithDescriptions;
			this.hasValueDependency = data.hasValueDependency;
			this.noValueDependency = data.noValueDependency;
			this.dependencies = data.dependencies;
			this.required = data.required;
			this.name = data.name;
			this.allDependenciesMustBeMet = data.allDependenciesMustBeMet;
			this.multi = data.multi;
			this.max = data.max;
			this.min = data.min;
			this.step = data.step;
			this.customValue = data.value;
		} catch (ex) {
			console.error(ex);
		}
	}

	private bindEvents(): void {
		this.onValidate.on(e => {
			if (this.valid) {
				if (this.closest('.custom-validation-target')) {
					this.closest('.custom-validation-target').classList.remove("invalid");
					this.closest('.custom-validation-target').classList.add("valid");
				}
			} else {
				if (this.closest('.custom-validation-target')) {
					this.closest('.custom-validation-target').classList.add("invalid");
					this.closest('.custom-validation-target').classList.remove("valid");
				}
				this.domUtil.focus();
			}
		});
		this.onChange.on(e => {
			if (this.touched) {
				this.validate();
			}
		});
	}

	private setAttributes(): void {
		this.setAttribute("custom-input", "");
		this.setAttribute("name", this.name);
	}

	private bindDependencies(): void {
		if (this.hasValueDependency && this.hasValueDependency.items.length) {
			for (const fieldName of this.hasValueDependency.items) {
				this.bindDependency(fieldName, "has");
			}
		}

		if (this.noValueDependency && this.noValueDependency.items.length) {
			for (const fieldName of this.noValueDependency.items) {
				this.bindDependency(fieldName, "no");
			}
		}

		if (this.dependencies && this.dependencies.length) {
			for (const index in this.dependencies) {
				if (this.dependencies.hasOwnProperty(index)) {
					const dependency = this.dependencies[index];
					for (const fieldName of dependency.items) {
						this.bindDependency(
							fieldName,
							"custom",
							dependency.value,
							dependency.criteria,
						);
					}
				}
			}
		}
	}

	private bindDependency(elementName: string, type: string, value?: string, criteria?: string,): void {
		let element = document.querySelector(`[name="${elementName}"]`) as CustomInputElement;

		if (element instanceof CustomInputElement) {
			if (this.dependentOnList.hasOwnProperty(element.name)) {
				return;
			}
			let isVisibleByDefault = type === "no";
			element.RegisterDependentOn(this.name, isVisibleByDefault);
			this.onChange.on(e => {
				let IsConditionMatched = false;
				if (type === "has") {
					IsConditionMatched = !!e.value;
				}
				if (type === "no") {
					IsConditionMatched = !e.value;
				}
				if (type === "custom") {
					if (criteria === "Exact") {
						IsConditionMatched = e.value == value;
					} else if (criteria === "LessThan") {
						IsConditionMatched = e.value < value;
					} else if (criteria === "MoreThan") {
						IsConditionMatched = e.value > value;
					}
				}
				element.DependentOnStateChanged(this.name, IsConditionMatched);
			});
			this.onVisibilityChanged.on(e => {
				if (this.visibilityState) {
					this.onChange.emit(
						new CustomElementEventArgs(this.value, "change"),
					);
				} else {
					element.DependentOnStateChanged(this.name, false);
				}
			});
		}
	}

	private setVisibility() {
		if (this.allDependenciesMustBeMet) {
			this.visibilityState = Object.values(this.dependentOnList).every(state => state);
		} else {
			this.visibilityState = Object.values(this.dependentOnList).some(state => state);
		}

		if (this.visibilityState) {
			this.show();
		} else {
			this.hide();
		}
		this.onVisibilityChanged.emit(new CustomElementEventArgs(this.value, "VisibilityChanged"));
	}

	private hide() {
		this.setAttribute("hidden", "");
		if (this.closest('.custom-validation-target')) {
			this.closest('.custom-validation-target').setAttribute("hidden", "");
		}
	}

	private show() {
		this.removeAttribute("hidden");
		if (this.closest('.custom-validation-target')) {
			this.closest('.custom-validation-target').removeAttribute("hidden");
		}
	}

	protected getChildInput(selector: string): HTMLInputElement {
		let element: any = this;
		if (this.shadowRoot) {
			element = this.shadowRoot;
		}
		return element.querySelector(selector) as HTMLInputElement;
	}

	protected getChildInputs(selector: string): HTMLInputElement[] {
		let element: any = this;
		if (this.shadowRoot) {
			element = this.shadowRoot;
		}
		return ArrayUtil.FromNodeList(
			element.querySelectorAll(selector),
		) as HTMLInputElement[];
	}

	protected getChildElement(selector: string): HTMLElement {
		let element: any = this;
		if (this.shadowRoot) {
			element = this.shadowRoot;
		}
		return element.querySelector(selector) as HTMLElement;
	}

	protected getChildElements(selector: string): HTMLElement[] {
		let element: any = this;
		if (this.shadowRoot) {
			element = this.shadowRoot;
		}
		return element.querySelectorAll(selector) as HTMLElement[];
	}

	public RegisterDependentOn(name: string, initialValue: boolean = false) {
		this.dependentOnList[name] = initialValue;
		this.setVisibility();
	}

	public DependentOnStateChanged(name: string, state: boolean) {
		if (this.dependentOnList.hasOwnProperty(name)) {
			this.dependentOnList[name] = state;
		}
		this.setVisibility();
	}
}
