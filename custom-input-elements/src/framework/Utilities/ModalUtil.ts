import ArrayUtil from "./ArrayUtil";
import DomUtil from "./DomUtil";

export default class ModalUtil {
	private Elements: Element[];
	private Modals: Modal[];
	private Triggers: Element[];
	public execute(): void {
		this.Elements = ArrayUtil.FromNodeList(document.querySelectorAll(".modal"));
		this.Triggers = ArrayUtil.FromNodeList(document.querySelectorAll("[data-toggle='modal']"));
		this.Triggers.forEach((trigger) => {
			const domUtil = new DomUtil(trigger);
			const targetSelector = domUtil.getDataAttr("target");
			const targetModal = document.querySelector(targetSelector);
			trigger.addEventListener("click", this.toggleModal.bind(this, targetModal));
		});
		this.Modals = this.Elements.map((modal) => new Modal(modal as HTMLElement));
	}
	private toggleModal(element: HTMLElement): void {
		const modal = new Modal(element);
		if (element.style.display === "block") {
			modal.hide();
		} else {
			modal.show();
		}
	}
}

// tslint:disable-next-line: max-classes-per-file
class Modal {
	private Modal: HTMLElement;
	constructor(element: HTMLElement) {
		this.Modal = element;
		this.bindClick();
		this.bindClose();
		this.bindSubmit();
		this.bindEscape();
	}
	public show(): void {
		this.Modal.style.display = "block";
		this.Modal.classList.add("show");
	}
	public hide(): void {
		this.Modal.style.display = "none";
		this.Modal.classList.remove("show");
	}
	private bindClick(): void {
		this.Modal.addEventListener("click", (event: Event) => {
			if (event.target !== this.Modal) {
				return;
			} else {
				new Modal(this.Modal).hide();
			}
		});
	}
	private bindClose(): void {
		const dismiss = ArrayUtil.FromNodeList(this.Modal.querySelectorAll("[data-dismiss]"));
		dismiss.forEach((element) => {
			element.addEventListener("click", this.hide.bind(this));
		});
	}
	private bindSubmit(): void {
		const submit = ArrayUtil.FromNodeList(this.Modal.querySelectorAll("[data-submit]"));
		submit.forEach((element) => {
			const domUtil = new DomUtil(element);
			const value = domUtil.getDataAttr("submit-value");
			const targetselector = domUtil.getDataAttr("submit");
			element.addEventListener("click", () => {
				this.hide();
				document.querySelector(targetselector).scrollIntoView();
				const positionInput = (document.getElementById("position") as HTMLFormElement);
				positionInput.value = value;
			});
		});
	}
	private bindEscape(): void {
		document.addEventListener("keydown", (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				this.hide();
			}
		});
	}
}
