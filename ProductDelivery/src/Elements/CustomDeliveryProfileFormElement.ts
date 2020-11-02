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
	<input id="url" placeholder="Enter Url" autocomplete="off"></input>
	<label id="lblport">Port</label>
	<input id="port" placeholder="Enter Port" autocomplete="off"></input>
	<label id="lbltype">Type</label>
	<select class="select">
		<option value="" disabled selected>Select Type</option>
		<option>FTP</option>
		<option>FTPS</option>
		<option>SFTP</option>
	</select>
	<label id="lblUsername">Username</label>
	<input id="username" placeholder="Enter Username" autocomplete="off">
	<label id="lblPassword">Password</label>
	<input id="password" type="password" placeholder="Enter Password" autocomplete="off"></input>
	<label id="lblFileTemplate">File Name (template)</label>
	<input id="fileTemplate" placeholder="Enter file name" autocomplete="off">
	<label id="lblpath">Path</label>
	<input id="path" placeholder="Enter Path" autocomplete="off"></input>
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

	public getProfile(): IDeliveryProfile {
		var profile =
			{
				//url: (this.getChildElement('#url') as HTMLInputElement).value,
				url: "ftp://waws-prod-am2-331.ftp.azurewebsites.windows.net/",
				//port: Number((this.getChildElement('#port') as HTMLInputElement).value),
				port: 21,
				connectionMode: "Implicit",
				//protocol: this.GetSelectedFTPType((this.getChildElement('.select'))),
				protocol: FTPType.FTP,
				fileTemplate: (this.getChildElement('#fileTemplate') as HTMLInputElement).value,
				folderTemplate: (this.getChildElement('#path') as HTMLInputElement).value,
				userName: "esignatur-ftp-test\\$esignatur-ftp-test",
				Password: "3bhBzGj8mkQEYpnbFNpHKNpaQnWA8nEGa6AcWnrCc0iYSvJTqayMtkuqkXuP"
				//userName: (this.getChildElement('#username') as HTMLInputElement).value,
				//Password: (this.getChildElement('#password') as HTMLInputElement).value

			} as IDeliveryProfile;
		return profile;
	}

	getTestProfile(): IDeliveryProfile {
		var profile =
			{
				url: "ftp://waws-prod-am2-331.ftp.azurewebsites.windows.net/",
				port: 21,
				connectionMode: "Explicit",
				protocol: FTPType.FTP,
				fileTemplate: "{Document.FileName}",
				folderTemplate: "{SenderName}/{Signer.Name}",
				userName: "esignatur-ftp-test\\$esignatur-ftp-test",
				Password: "3bhBzGj8mkQEYpnbFNpHKNpaQnWA8nEGa6AcWnrCc0iYSvJTqayMtkuqkXuP"

			} as IDeliveryProfile;
		return profile;
	}


	private GetSelectedFTPType(select): FTPType {
		var selectedValue = select.options[select.selectedIndex].value
		return (<any>FTPType)[selectedValue];
	}

	private resetFields() {
		(this.getChildElement('#url') as HTMLInputElement).value = "";
		(this.getChildElement('#port') as HTMLInputElement).value = "";
		(this.getChildElement('#fileTemplate') as HTMLInputElement).value = "";
		(this.getChildElement('#path') as HTMLInputElement).value = "";
		(this.getChildElement('#username') as HTMLInputElement).value = "";
		(this.getChildElement('#password') as HTMLInputElement).value = "";
		(this.getChildElement('.select') as HTMLSelectElement).selectedIndex = 0;
	}

	componentDidMount() {
		this.nativeInput = this.getChildElement('.custom-input');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
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