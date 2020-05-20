export default class Overlays {

	public static Spinner(target: Element): HTMLDivElement {

		const elem = (document.createElement("div")) as HTMLDivElement;
		elem.innerHTML = "<i class='fas fa-spinner'></i>";
		elem.classList.add("spinner");
		target.appendChild(elem);
		return elem;
	}
	public static CheckMark(target: Element): void {
		const elem = (document.createElement("div")) as HTMLDivElement;
		elem.classList.add("spinner");
		elem.innerHTML = "<i class='fas fa-check'></i>";
		target.appendChild(elem);
		setTimeout(() => {
			elem.remove();
		}, this.overlayTime);
	}
	public static CrossMark(target: Element): void {
		const elem = (document.createElement("div")) as HTMLDivElement;
		elem.classList.add("spinner");
		elem.innerHTML = "<i class='fa fa-times' aria-hidden='true'></i>";
		target.appendChild(elem);
		setTimeout(() => {
			elem.remove();
		}, this.overlayTime);
	}
	private static readonly overlayTime: number = 3000;
}
