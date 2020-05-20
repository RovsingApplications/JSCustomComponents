export default class CustomInputs {

	private customInputs: Element[];
	constructor() {
		this.customInputs =  Array.prototype.concat.apply([], document.querySelectorAll(".custom-input") as any);
	}
	public execute(): void {
		this.customInputs.forEach((customInput) => {
			customInput.addEventListener("click", () => {
				this.radioClick(customInput);
			});
		});
	}
	private radioClick(customInput: Element): void {
		const radioElement = customInput.previousElementSibling as HTMLFormElement;
		radioElement.checked  = true;
	}
}
