import CustomElement from "../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import SVGs from "../Framework/Constants/SVGs";

@CustomElement({
	selector: 'custom-dropdown-element',
	template: `
	<div class="divWrapper">
		<div class='dropdown'>
			<div class='dropdown_value'></div>
			<div class='dropdown_arrow'>▾</div>
			<div class='dropdown_panel'>
				<div class='dropdown_items'></div>
			</div>
		</div>
		<input class="readOnlyOption" readonly>
	</div>	
	`,
	style: `
	.divWrapper {
		width: 100%;
		height: 48px;
	}
	.dropdown {
		text-align:left;
		font-family: "Mulish", sans-serif;
		color: #000;
		user-select: none;
		border-radius: 4px;
		cursor: pointer;
		width: 100%;
		height: 34px;
		line-height: 20px;
		display: inline-block;
		position: relative;
		box-sizing: border-box;
		border: 1px solid #DFDFDF;
		background: #fff;
		margin-bottom: 15px;
	}

	.readOnlyOption {
		width: 97%;
		height: 32px;
		margin-bottom: 1px;
		margin-left: 1px;
		position: relative;
		top: -53px;
		border: 0;
		padding-left: 5px;
		text-align:left;
		font-family: "Mulish", sans-serif;
		outline: none;
	}

	.dropdown_value {
		display: inline-block;
		padding-left: 5px;
	}

	.add-custom-button{
		float:left;
		background-color: Transparent;
		border: none;
		cursor:pointer;
		overflow: hidden;
		outline:none;
	}

	.dropdown_arrow {
		transition: all 0.2s ease;
		position: absolute;
		right: 0px;
		top: 8.3px;
		height: 7.41px
		color: #000000 54%;
		font-size: 25px;
	}

	.dropdown_panel {
		position: absolute;
		background: transparent;
		width: calc(100% + 11px);
		z-index: 9999;
		height: 203px;
		left: -1px;
		top: 26px;
		overflow: hidden;
		pointer-events: none;
	}

	.dropdown_items {
		position: absolute;
		pointer-events: all;
		z-index: 9999;
		top: 0px;
		width: calc(100% - 11px);
		max-height: 170px;
		background: white;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		box-shadow: 2px 2px 2px #999;
		transform: translate(0px, -200px);
		transition: 0.3s all ease-out;
		overflow-y: auto;
		border: 1px solid #aaa;
	}

	.dropdown_item {
		padding-left: 25px;
		height:25px;
	}

	.addplaceholder_item {
		background: #FFFFFF;
	}

	.dropdown_item:hover {
		background: #eee;
	}

	.dropdown ::-webkit-scrollbar {
		width: 8px;
	}

	.dropdown ::-webkit-scrollbar-thumb {
		background-color: #999;
	}
	
	.fa-plus-circle{
	 color :darkblue;
	 width :13.33px;
	 height:13.33px;
	 top :1px;
	 left:1px;
	}

	.add-custom-text
	{
		font-family: "Mulish", sans-serif;
		font-size: 12px;
		margin-top:5px;
	 	margin-bottom:5px;
	}

	.div-buttons{
		float:right; 
	}

	button, input[type="submit"], input[type="reset"] {
		background: none;
		color: inherit;
		border: none;
		padding: 20;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
	`,
	useShadow: false,
})
export default class CustomDropDownElement extends CustomHTMLBaseElement {


	private divDropDownItems: HTMLDivElement;
	private divDropDownParent: HTMLDivElement;
	private divArrow: HTMLDivElement;
	private divValue: HTMLDivElement;
	private readonlyInput: HTMLInputElement;
	private addPlaceholderButton: HTMLButtonElement;
	private isVisible: boolean;



	constructor() {
		super();
	}

	componentDidMount() {
		this.divDropDownItems = this.getChildElement('.dropdown_items');
		this.divDropDownParent = this.getChildElement('.dropdown');
		this.divArrow = this.getChildElement('.dropdown_arrow');
		this.divValue = this.getChildElement('.dropdown_value');
		this.readonlyInput = this.getChildElement('.readOnlyOption');


		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.addListeners();
	}

	addListeners() {
		this.divDropDownParent.addEventListener('mousedown', this.handleVisibility.bind(this));
		//this.readonlyInput.addEventListener('click', this.handleVisibility.bind(this));
		//this.addEventListener("divItemClick", this.clickedItem.bind(this));
	}

	handleVisibility() {
		/*if (this.isVisible) {
			this.hideData();
		}
		else {
			this.showData();
		}*/
		this.showData();
	}

	showData() {
		this.isVisible = true;
		this.divDropDownItems.style.transform = 'translate(0px,0px)';
		this.divArrow.style.transform = 'rotate(180deg)';
	}

	hideData() {
		this.isVisible = false;
		this.divDropDownItems.style.transform = 'translate(0px,-255px)';
		this.divArrow.style.transform = 'rotate(0deg)';
	}


	addElement(item): void {
		var divButtons = document.createElement('div');
		var editButton = document.createElement('button');
		editButton.innerHTML = `${SVGs.editPenSVG}`;
		editButton.classList.add("edit-button");
		editButton.addEventListener('click', this.editAction.bind(item));

		var deleteButton = document.createElement('button');
		deleteButton.innerHTML = `${SVGs.trashSVG}`;
		deleteButton.classList.add("delete-button");
		deleteButton.addEventListener('click', this.deleteAction.bind(item))

		divButtons.classList.add("div-buttons");
		divButtons.appendChild(editButton);
		divButtons.appendChild(deleteButton);

		/*var textContent = document.createElement("input") as HTMLInputElement;
		textContent.readOnly = true;
		textContent.innerText = `${item}`*/
		var textContent = document.createTextNode(`${item}`);
		textContent.addEventListener('click', this.selectItem.bind(item));

		var divDropDownItem = document.createElement('div');
		divDropDownItem.appendChild(textContent);
		divDropDownItem.appendChild(divButtons);

		divDropDownItem.classList.add("dropdown_item");
		/*divDropDownItem.addEventListener('click', e => {

			const customDivClick = new CustomEvent('divItemClick', { bubbles: true, composed: true, detail: { item: item } });
			this.dispatchEvent(customDivClick);
		});*/
		this.divDropDownItems.appendChild(divDropDownItem);
	}


	deleteAction(event: Event): void {
		event.preventDefault();
		console.log("perfrom Delete operation");
	}

	editAction(event: Event): void {
		event.preventDefault();
		console.log("perfrom Update operation");
	}

	selectItem(event: Event): void {
		event.preventDefault();
		console.log("perfrom select operation");
	}

	getValue(): string {
		var value = this.readonlyInput.innerText;
		return value;
	}

	/*initializePathPlaceholders() {
		let placeholderList: string[] = ['System/Library/Core', 'User/Projects/Product/Delivery', 'D:/Projects/User/PD/CustomFields', 'D:/Projects/User/PD/CustomFields'];
		placeholderList.forEach(item => this.divDropDownItems.appendChild(this.addElement(item)));
	}

	initializeFileNamePlaceholders() {
		let placeholderList: string[] = ['{Placeholder 1}', '{Placeholder 2}', '{Placeholder 3}', '{Placeholder 4}', '{Placeholder 5}', '{Placeholder 6}', '{Placeholder 7}', '{Placeholder 8}'];
		placeholderList.forEach(item => this.divDropDownItems.appendChild(this.addElement(item)));
	}*/
	/*clicked(event: Event): void {
			event.stopPropagation();
			//this.hideData();
			alert('you click here');
		}*/

	private attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'placeholder':
				this.changePlaceholderValue(newVal)
				break;
		}
	}
	changePlaceholderValue(placeholderValue: string) {
		this.readonlyInput.placeholder = placeholderValue;
	}
}