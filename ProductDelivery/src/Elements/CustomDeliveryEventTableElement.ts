import Colors from "../../../Framework/Constants/Colors";
import CustomElement from "../../../Framework/custom-element.decorator";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";

@CustomElement({
	selector: 'delivery-event-table',
	template: `
<h3>Deliveries</h3>
<table class="rounded">
	<!-- move this to a independent web component -->
	<tbody>
		<tr class="active-row">
			<td>
				<i class="fas fa-unlink rotate-45 color-error"></i>
			</td>
			<td>ftps://localhost:8080</td>
			<td>System/Library/Path</td>
			<td>Failed</td>
			<td class="actions">
				<i class="fas fa-play color-primary"></i>
				<i class="fas fa-info-circle color-primary"></i>
			</td>
		</tr>
		<tr class="active-row">
			<td>
				<i class="fas fa-link rotate-45 color-secondary"></i>
			</td>
			<td>ftps://localhost:8080</td>
			<td>System/Library/Path</td>
			<td>Sucess</td>
			<td class="actions">
				<i class="fas fa-play color-primary"></i>
				<i class="fas fa-info-circle color-primary"></i>
			</td>
		</tr>
	</tbody>
</table>`,
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
export default class CustomDeliveryEventTableElement extends CustomHTMLBaseElement {

	private nativeInput: HTMLInputElement;
	private change = new Event('change');

	constructor() {
		super();
	}

	get value() {
		if (!this.nativeInput) {
			return null;
		}
		return this.nativeInput.value;
	}

	set value(val: string) {
		if (!this.nativeInput) {
			return;
		}
		this.nativeInput.value = val;
	}

	componentDidMount() {
		this.nativeInput = this.getChildElement('.custom-input');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
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
			case 'required':
				if (!this.nativeInput) {
					break;
				}
				if (newVal === 'true') {
					this.nativeInput.required = true;
					break;
				}
				this.nativeInput.required = false;
				break;
			case 'name':
				if (!this.nativeInput) {
					break;
				}
				this.nativeInput.name = newVal;
				break;
		}
	}
}