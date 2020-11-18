import Colors from "../../../Framework/Constants/Colors";
import CustomElement from "../../../Framework/custom-element.decorator";
import DeliveryResult from "../../models/DeliveryResult";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";

@CustomElement({
	selector: 'delivery-result',
	template: `
<!-- move this to a independent web component -->
<label>Delivery result</label>
<div class="result-box pad-10">
</div>
	`,
	style: `

	/* result-box */
	.result-box {
		position: relative;
		width: 100%;
		background: #FFFFFF;
		border: 1px solid #DFDFDF;
		box-sizing: border-box;
		border-radius: 4px;
		height: 457px;
		margin-top: 10px;
		overflow: auto;
	}
	* {
		font-family: "Mulish", sans-serif;
		color: #000;
	}
	.pad-10 {
		padding: 10px;
	}
	
	.color-primary
	{
		color: #003E64;
	}
	
	.color-secondary
	{
		color: #28BECE;
	}

	.label {
		font-size: 14px;
	}
	`,
	useShadow: false,
})
export default class CustomDeliveryResultElement extends CustomHTMLBaseElement {

	private mainDivElement: HTMLParagraphElement;
	private change = new Event('change');

	constructor() {
		super();
	}

	componentDidMount() {
		this.mainDivElement = this.getChildElement('.result-box');
		this.InitialResultText();
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
	}

	InitialResultText() {
		var paraElement = document.createElement("p");
		paraElement.innerHTML = `<b>Awaiting test</b> </br>
		Please enter your credential and test your connection to product delivery`;
		this.mainDivElement.appendChild(paraElement);
	}

	AddEventsForDeliveryResults(deliveryResults: DeliveryResult[]) {
		this.clearContent();
		deliveryResults.forEach(item => {
			this.AddEvents(item);
		});
	}

	clearContent() {
		this.mainDivElement.innerHTML = "";
	}

	AddEvents(deliveryResult: DeliveryResult): void {
		console.log(deliveryResult.eventLog);
		if (deliveryResult.eventLog != null) {
			var divElement = document.createElement("div");
			var labelText = document.createElement("label");
			labelText.innerText = `${deliveryResult.id}`
			var unOrderedList = document.createElement("ul");
			var eventList = (deliveryResult.eventLog as string[]);
			eventList.forEach(eve => {
				var node = document.createElement("LI");
				var textnode = document.createTextNode(`$ ${eve}`);
				node.appendChild(textnode);
				unOrderedList.appendChild(node);
			});
			divElement.appendChild(labelText);
			divElement.appendChild(unOrderedList);
			this.mainDivElement.appendChild(divElement);
		}
	}

	private static get observedAttributes() {
		return ['name', 'required'];
	}

	private attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {

		}
	}
}