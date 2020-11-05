import Colors from "../../../Framework/Constants/Colors";
import CustomElement from "../../../Framework/custom-element.decorator";
import { FTPType } from "../../models/FTPType";
import IDeliveryProfile from "../../models/IDeliveryProfile";
import CustomDeliveryEventTableElement from "./CustomDeliveryEventTableElement";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";

@CustomElement({
	selector: 'delivery-profile-form',
	template: `<form>
	<!-- move this to a independent web component -->
	<label id="lblurl">Ftp Url</label>
	<input id="url" placeholder="Enter Url" autocomplete="off""></input>
	<label id="lblport">Port</label>
	<input id="port" placeholder="Enter Port" autocomplete="off" onblur=''></input>
	<label id="lbltype">Type</label>
	<select id="type" class="select">
		<option value="" disabled selected>Select Type</option>
		<option>FTP</option>
		<option>FTPS</option>
		<option>SFTP</option>
	</select>
	<label id="lblFileTemplate">File Name (template)</label>
	<input id="fileTemplate" placeholder="Enter file name" autocomplete="off" onblur=''>
	<label id="lblpath">Path</label>
	<input id="path" placeholder="Enter Path" autocomplete="off" onblur=''></input>
	<input name="pathResult" readonly placeholder="/..."></input>
	<label id="lblFileTemplate">Contact Person</label>
	<input id="username" placeholder="Enter Email" autocomplete="off" onblur=''></input>
</form>
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
	.label {
		font-size: 14px;
	}
	.form-control.success  {
		border-color: #28BECE
	}
	.form-control.error  {
		border-color: #CE2828
	}
	`,
	useShadow: false,
})

export default class CustomDeliveryProfileFormElement extends CustomHTMLBaseElement {
	private ftpUrlInput: HTMLInputElement;
	private ftpPortInput: HTMLInputElement;
	private typeElement: HTMLSelectElement;
	private filenameInput: HTMLInputElement;
	private pathInput: HTMLInputElement;
	private contactInput: HTMLInputElement;

	deliveryEventTableElement = new CustomDeliveryEventTableElement();

	private nativeInput: HTMLInputElement;
	ftpUrlRexExp: RegExp = /^(?:(?:ftps?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
	ftpPortRexExp: RegExp = /^[0-9\s]*$/;
	ftpPathRexExp: RegExp = /^([A-Za-z]:|[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*)((\/[A-Za-z0-9_.-]+)+)$/;
	contactEmailExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	fileNameExp: RegExp = /^[\w,\s-]+\.[A-Za-z]{3}$/;

	private change = new Event('change');

	constructor() {
		super();
	}

	componentDidMount() {

		this.nativeInput = this.getChildElement('.custom-input');
		this.ftpUrlInput = (this.getChildElement('#url') as HTMLInputElement);
		this.ftpPortInput = (this.getChildElement('#port') as HTMLInputElement);
		this.typeElement = (this.getChildElement('#type') as HTMLSelectElement);
		this.filenameInput = (this.getChildElement('#fileTemplate') as HTMLInputElement);
		this.pathInput = (this.getChildElement('#path') as HTMLInputElement);
		this.contactInput = (this.getChildElement('#username') as HTMLInputElement);


		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});
		this.addListeners();
	}

	private addListeners() {
		this.ftpUrlInput.addEventListener("blur", this.validateFtpUrl.bind(this));
		this.ftpPortInput.addEventListener("blur", this.validateFtpPort.bind(this));
		this.filenameInput.addEventListener("blur", this.validateFileField.bind(this));
		this.pathInput.addEventListener("blur", this.validatePathField.bind(this));
		this.contactInput.addEventListener("blur", this.validateEmailField.bind(this));
	}

	validateFileField(event: Event): void {
		event.preventDefault();
		const inputField = event.currentTarget as HTMLInputElement;
		if (this.fileNameExp.test(inputField.value)) {
			inputField.style.borderColor = '#28BECE'
		}
		else {
			inputField.style.borderColor = '#CE2828'
		}
	}


	validateEmailField(event: Event): void {
		event.preventDefault();
		const inputField = event.currentTarget as HTMLInputElement;
		if (this.contactEmailExp.test(inputField.value)) {
			inputField.style.borderColor = '#28BECE'
		}
		else {
			inputField.style.borderColor = '#CE2828'
		}
	}

	validatePathField(event: Event): void {
		event.preventDefault();
		const inputField = event.currentTarget as HTMLInputElement;
		if (this.ftpPathRexExp.test(inputField.value)) {
			inputField.style.borderColor = '#28BECE'
		}
		else {
			inputField.style.borderColor = '#CE2828'
		}
	}

	validateRequiredField(event: Event): void {
		event.preventDefault();
		const inputField = event.currentTarget as HTMLInputElement;
		if (inputField.value.length != 0) {
			inputField.style.borderColor = '#28BECE'
		}
		else {
			inputField.style.borderColor = '#CE2828'
		}
	}

	validateFtpPort(event: Event): void {
		event.preventDefault();
		const inputField = event.currentTarget as HTMLInputElement;
		if (this.ftpPortRexExp.test(inputField.value) && inputField.value.length != 0) {
			inputField.style.borderColor = '#28BECE'
		}
		else {
			inputField.style.borderColor = '#CE2828'
		}
	}

	validateFtpUrl(event: Event): void {
		event.preventDefault();
		const inputField = event.currentTarget as HTMLInputElement;
		if (this.ftpUrlRexExp.test(inputField.value)) {
			inputField.style.borderColor = '#28BECE'
		}
		else {
			inputField.style.borderColor = '#CE2828'
		}
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
				url: this.ftpUrlInput.value.trim(),
				//url: "ftp://waws-prod-am2-331.ftp.azurewebsites.windows.net/",
				port: Number(this.ftpPortInput.value.trim()),
				connectionMode: "Implicit",
				protocol: this.GetSelectedFTPType(this.typeElement),
				fileTemplate: this.filenameInput.value.trim(),
				folderTemplate: this.pathInput.value.trim(),
				userName: this.contactInput.value.trim(),
			} as IDeliveryProfile;
		return profile;
	}


	public checkInputs(): Boolean {

		let hasValidData = true;
		const url = this.ftpUrlInput.value.trim();
		const port = this.ftpPortInput.value.trim();
		const protocol = this.typeElement.selectedIndex;
		const fileTemplate = this.filenameInput.value.trim();
		const folderTemplate = this.pathInput.value.trim();
		const userName = this.contactInput.value.trim();

		// validate url
		if (!this.ftpUrlRexExp.test(url)) {
			this.setErrorfor(this.ftpUrlInput, 'Invalid Value');
			hasValidData = false;
		}
		else {
			this.setSucessFor(this.ftpUrlInput)
		}
		// validate port
		if (this.ftpPortRexExp.test(port)) {
			this.setErrorfor(this.ftpPortInput, 'Invalid Value');
			hasValidData = false;
		}
		else {
			this.setSucessFor(this.ftpPortInput);
		}
		// validate type
		if (protocol === 0) {
			this.setErrorfor(this.typeElement, 'Invalid Value');
			hasValidData = false;
		}
		else {
			this.setSucessFor(this.typeElement);
		}

		hasValidData = this.HasEmptyField(fileTemplate, this.filenameInput);

		hasValidData = this.HasEmptyField(folderTemplate, this.pathInput);

		hasValidData = this.HasEmptyField(userName, this.contactInput);

		return hasValidData;
	}

	HasEmptyField(fieldvalue: string, fieldInput: HTMLInputElement): boolean {
		let hasValidData = true;
		if (fieldvalue === '') {

			this.setErrorfor(fieldInput, 'Invalid Value');
			hasValidData = false;
		}
		else {
			this.setSucessFor(fieldInput);
		}
		return hasValidData;
	}

	private setErrorfor(input: HTMLElement, message: string) {
		input.className = 'form-control error';
	}


	private setSucessFor(input: HTMLElement) {
		input.className = 'form-control success';
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