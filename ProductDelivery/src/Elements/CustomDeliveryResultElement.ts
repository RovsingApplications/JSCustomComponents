import Colors from "../../../Framework/Constants/Colors";
import CustomElement from "../../../Framework/custom-element.decorator";
import DeliveryResult from "../../models/DeliveryResult";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";

@CustomElement({
	selector: 'delivery-result',
	template: `
<!-- move this to a independent web component -->
<h3>Delivery result</h3>
<div class="result-box pad-10">
	<p>
		Here shows current status of FTP Connection.
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

	.color-error
	{
		color: #CE2828;
	}

	.color-success
	{
		color: #28BECE;
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

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
	}

	AddEvents(log: any) {
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