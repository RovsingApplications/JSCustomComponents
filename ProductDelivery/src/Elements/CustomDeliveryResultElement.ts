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

	.loader {
    border: 10px solid white;
    border-top: 10px solid #003E64;
	border-right: 10px solid #003E64;
	border-bottom: 10px solid #003E64;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 3s linear infinite;
	}

	@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }}
	
	.hide-loader{
	display:none;
	}
	.center {
		position: relative;
		width: 400px;
  		height: 50px;
  		background-color: white;
  		/* Center vertically and horizontally */
  
  		top: 40%;
  		left: 50%;
  		margin: -25px 0 0 -25px
	}
	.firstText {
		font-family: Mulish;
		font-style: normal;
		font-weight: normal;
		font-size: 20px;
		line-height: 25px;
		text-align: center;
		color: #000000;
		margin-left: -150px;
	}
	.secondText {
		background: #FFFFFF;
		box-sizing: border-box;
		border-radius: 4px;
		height: 34.53px;
		text-align: center;
		margin-left: -150px;
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
		this.initialResultText();
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

	}

	addWaitingSpinner() {
		this.clearContent();
		var outerDivElement = document.createElement("div");
		outerDivElement.classList.add("center");
		var innerDivElement = document.createElement("div");
		innerDivElement.classList.add("loader");
		var firstText = document.createElement('p');
		firstText.innerText = 'Connecting';
		firstText.classList.add('firstText');
		var secondText = document.createElement('p');
		secondText.innerHTML = 'Connecting to product delivery <br> is in progress...';
		secondText.classList.add('secondText');
		outerDivElement.appendChild(innerDivElement);
		outerDivElement.appendChild(firstText);
		outerDivElement.appendChild(secondText);
		this.mainDivElement.appendChild(outerDivElement);
	}

	removeBusyWaiting() {
		this.clearContent()
	}

	initialResultText() {
		var outerDivElement = document.createElement("div");
		outerDivElement.classList.add("center");
		var firstText = document.createElement('p');
		firstText.innerText = 'Awaiting test';
		firstText.classList.add('firstText');
		var secondText = document.createElement('p');
		secondText.innerHTML = 'Please enter your credentials and test your <br> connection to product delivery';
		secondText.classList.add('secondText');
		outerDivElement.appendChild(firstText);
		outerDivElement.appendChild(secondText);
		this.mainDivElement.appendChild(outerDivElement);
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
		if (deliveryResult.eventLog != null) {
			this.clearContent();
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