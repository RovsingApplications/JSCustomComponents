import Colors from "../../../Framework/Constants/Colors";
import CustomElement from "../../../Framework/custom-element.decorator";
import { FTPType } from "../../models/FTPType";
import IDeliveryProfile from "../../models/IDeliveryProfile";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";

@CustomElement({
	selector: 'delivery-profile-form',
	template: `
<div class="wrapper">
	<!-- move this to a independent web component -->
	<label id="lblurl">FTP address</label>
	<input id="url" placeholder="Enter Url"></input>
	<label id="lblport">Port</label>
	<input id="port" placeholder="Enter Port"></input>
	<label id="lbltype">Type</label>
	<select class="select">
		<option value="" disabled selected>Select Type</option>
		<option>FTP</option>
		<option>FTPS</option>
	</select>
	<label id="lblFileTemplate">File Name (template)</label>
	<input id="fileTemplate" placeholder="Enter file name">
	<label id="lblpath">Path</label>
	<input id="path" placeholder="Enter Path"></input>
	<input name="pathResult" readonly placeholder="/..."></input>
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
export default class CustomDeliveryProfileFormElement extends CustomHTMLBaseElement {

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

	public getProfile(): IDeliveryProfile
	{
		var profile = 
		{
			customerApiKey:"",
			url: (this.getChildElement('#url') as HTMLInputElement).value,
			port: Number((this.getChildElement('#port') as HTMLInputElement).value),
			type: FTPType.FTP,
			FileTemplate:(this.getChildElement('#fileTemplate') as HTMLInputElement).value,
			PathTemplate:(this.getChildElement('#fileTemplate') as HTMLInputElement).value,
			Username:"testUser",
			Password:"Password"
		} as IDeliveryProfile;
		return profile;
	}

	componentDidMount() {
		this.nativeInput = this.getChildElement('.custom-input');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

		this.bindEvents();
	}

	private bindEvents() {
		this.nativeInput.onchange = () => {
			this.dispatchEvent(this.change);
		};
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