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
	<p>
	</p>
</div>
	`,
	style: `

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


	private paragrapghElement: HTMLParagraphElement;
	private change = new Event('change');

	constructor() {
		super();
	}

	componentDidMount() {
		this.paragrapghElement = this.getChildElement('.result-box p');
		this.InitialResultText();
		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
	}

	eventListener() {
		this.addEventListener('show-result', this.showResut.bind(this));
	}

	showResut(event: CustomEvent): void {
		this.paragrapghElement.textContent = "";
		var deliveryResult = event.detail as DeliveryResult;
		var preElement = new HTMLPreElement();
		preElement.innerHTML = `$ ${deliveryResult.eventLog.join('$ \n')}`;
		this.paragrapghElement.appendChild(preElement);
	}

	InitialResultText() {
		this.paragrapghElement.innerHTML = `<p> <b>Awaiting test</b> </br>
		Please enter your credential and test your connection to product delivery</p> `
	}

	AddEvents(log: any): void {
		//console.log(typeof log);
		this.paragrapghElement.textContent = "";
		log.forEach(event => {
			this.paragrapghElement.innerHTML += `$ ${event} <br/>`;
		});
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