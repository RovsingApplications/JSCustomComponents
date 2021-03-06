import CustomElement from "../Framework/custom-element.decorator";
import { FTPType } from "../models/FTPType";
import IDeliveryProfile from "../models/IDeliveryProfile";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Interpolation from "../models/Interpolation";
import Colors from "../../src/Framework/Constants/Colors"
import MakeRequest from "../Framework/Utilities/MakeRequest";
import Globals from "../Globals/Globals";
import Constants from "../Framework/Constants/Constants";

@CustomElement({
	selector: 'delivery-profile-form',
	template: `
		<form class="from" id="from">
			<!-- move this to a independent web component -->
			<label id="lbl-url">FTP url</label>
			<input id="url" placeholder="Url" autocomplete="off"">
			<div class="row">
				<div class="column column-50" >
					<label id="lbl-port">Port</label>
					<input id="port" type="number" placeholder="Port" autocomplete="off">
					<label id="lbl-username">Brugernavn</label>
					<input id="username" placeholder="Brugernavn" autocomplete="off"">
				</div>
				<div class="column column-50">
					<label id="lbl-type">Type</label>
					<select id="type" class="select-element">
						<option value="" disabled selected>Vælg Type</option>
						<option value="${FTPType.FTP}">FTP</option>
						<option value="${FTPType.FTPS}">FTPS</option>
					</select>
					<label id="lbl-password">Kodeord</label>
					<input id="password" type="password" placeholder="Kodeord" autocomplete="off">
				</div>
			</div>
			<div class="divplaceholder-wrapper">
				<div class="divplaceholder-wrapper__divselectplaceholder">
					<label>Vælg placeholder</label>
					<select id="placeholder" class="divplaceholder-wrapper-select">
						<option value="" disabled selected>Vælg placeholder</option>
					</select>
					<button id="btn-add" class="divplaceholder-wrapper-button button">Tilføj</button>
				</div>	
				<div>
					<label id="lbl-filename">Dokumentnavn (skabelon)</label>
					<input id="file-template" placeholder="Tilføj Filnavn" autocomplete="off">
					<label id="lbl-path">Filsti på serveren</label>
					<input id="path" placeholder="Tilføj Filsti på serveren" autocomplete="off" >
				</div>
			</div>
			<div>
				<label id="lbl-filetemplate">Kontakt navn</label>
				<input id="contact-name" placeholder="Kontakt navn" autocomplete="off">
			</div>
			

			<label id="lbl-filetemplate">Kontakt e-mail</label>
			<input id="contact-email" placeholder="Kontakt e-mail" autocomplete="off">
		</form>
	`,
	style: `
	* {
		color: ${Colors.font};
	}
	.pad-10 {
		padding: 10px;
	}
	.color-primary
	{
		color: ${Colors.primary};
	}
	.color-error
	{
		color: ${Colors.error};
	}
	.color-success
	{
		color: ${Colors.success};
	}
	.label {
		font-size: 14px;
	}
	.divplaceholder-wrapper{
		margin-top:13px;
	}
	.divplaceholder-wrapper-select {
		width: calc(100% - 79px);
		height: 34px;
		border-radius: 4px 0 0 4px;
		box-sizing: border-box;
		border: 1px solid ${Colors.tertiary};
		background: ${Colors.senary};
		margin-bottom: 15px;
		display:inline-block;
	}
	.divplaceholder-wrapper-button {
		display:inline-block;
		height: 34px;
		margin: 0px;
		width: 79px;
		border-radius: 0 4px 4px 0;
	}
	.select-element {
		width: 100%;
		height: 34px;
		border-radius: 4px;
		box-sizing: border-box;
		border: 1px solid ${Colors.tertiary};
		background: ${Colors.senary};
		margin-bottom: 15px;
	}
	/* Create two equal columns that floats next to each other */
	.column {
		float: left;
		width: 50%;
		box-sizing: border-box;
	}
	/* Clear floats after the columns */
	.row:after {
		content: "";
		display: table;
		clear: both;
	}
	.column-50 {
		width: 50%;
	}
	.column:not(:first-of-type) {
		padding-left: 10px
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
	private contactEmail: HTMLInputElement;
	private contactName: HTMLInputElement;
	private passwordInput: HTMLInputElement;
	private usernameInput: HTMLInputElement;

	// placeholder fields
	private placeholderSelect: HTMLSelectElement;
	private placeholderAddbtn: HTMLButtonElement;
	private placeholderType: string = null;
	private filePlaceholderType: string = 'file';
	private pathPlaceholderType: string = 'path';
	private errorColor: string = Colors.error;
	private successColor: string = Colors.success;
	private nativeInput: HTMLInputElement;
	ftpUrlRexExp: RegExp = /^(ftp:\/\/|ftps:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
	ftpPortRexExp: RegExp = /^[0-9\s]*$/;
	contactEmailExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	private change = new Event('change');

	constructor() {
		super();
	}

	componentDidMount() {

		this.nativeInput = this.getChildElement('.custom-input');
		this.ftpUrlInput = (this.getChildElement('#url') as HTMLInputElement);
		this.ftpPortInput = (this.getChildElement('#port') as HTMLInputElement);
		this.typeElement = (this.getChildElement('#type') as HTMLSelectElement);
		this.filenameInput = (this.getChildElement('#file-template') as HTMLInputElement);
		this.pathInput = (this.getChildElement('#path') as HTMLInputElement);
		this.contactEmail = (this.getChildElement('#contact-email') as HTMLInputElement);
		this.contactName = (this.getChildElement('#contact-name') as HTMLInputElement);
		this.usernameInput = (this.getChildElement('#username') as HTMLInputElement);
		this.passwordInput = (this.getChildElement('#password') as HTMLInputElement);
		this.placeholderSelect = (this.getChildElement('#placeholder') as HTMLSelectElement);
		this.placeholderAddbtn = (this.getChildElement('#btn-add') as HTMLButtonElement);

		this.initializeInterpolation();
		this.fillWithCurrentCustomerData();
		this.addListeners();
	}

	private initializeInterpolation() {
		Interpolation.InperpolationList.forEach(item => {
			var option = document.createElement("option");
			option.textContent = item;
			option.value = `{${item}}`;
			this.placeholderSelect.appendChild(option);
		})
	}

	private addListeners() {
		this.ftpUrlInput.addEventListener("blur", this.validateFtpUrl.bind(this));
		this.ftpPortInput.addEventListener("blur", this.validateFtpPort.bind(this));
		this.filenameInput.addEventListener("blur", this.lostFocusEvent.bind(this));
		this.pathInput.addEventListener("blur", this.lostFocusEvent.bind(this));
		this.contactEmail.addEventListener("blur", this.validateEmailField.bind(this));
		this.usernameInput.addEventListener("blur", this.validateEmptyField.bind(this));
		this.passwordInput.addEventListener("blur", this.validateEmptyField.bind(this));
		this.typeElement.addEventListener("change", this.validateSelectField.bind(this));
		this.placeholderAddbtn.addEventListener("click", this.addPlaceholderValue.bind(this));
		this.placeholderSelect.addEventListener("change", this.validateSelectField.bind(this));

	}

	addPlaceholderValue(event: Event): void {
		event.preventDefault();
		if (this.placeholderSelect.selectedIndex === 0) {
			this.placeholderSelect.style.borderColor = this.errorColor;
			return;
		}
		if (this.placeholderType === this.filePlaceholderType) {
			this.addPlaceHolderValueIntoInput(this.filenameInput);
		}
		else if (this.placeholderType === this.pathPlaceholderType) {
			this.addPlaceHolderValueIntoInput(this.pathInput);
		}
		this.placeholderType = null;
	}

	private addPlaceHolderValueIntoInput(input: HTMLInputElement): void {
		var selectedValue = this.placeholderSelect.selectedOptions[0].value;
		let existingValue = input.value;
		existingValue += selectedValue + ' ';
		input.value = existingValue;
		input.style.borderColor = this.successColor;
	}

	validateSelectField(event: Event): void {
		event.preventDefault();
		const selectElement = event.currentTarget as HTMLSelectElement;
		this.validateSelectElement(selectElement);
	}

	lostFocusEvent(event: Event): void {
		event.preventDefault();
		const element = event.currentTarget as HTMLInputElement;
		if (element.id === 'file-template') {
			this.placeholderType = this.filePlaceholderType;
		}
		else {
			this.placeholderType = this.pathPlaceholderType;
		}
		if (element.value === '') {
			element.style.borderColor = this.errorColor;
		}
		else {
			element.style.borderColor = this.successColor;
		}
	}

	validateEmptyField(event: Event): void {
		event.preventDefault();
		const inputField = event.currentTarget as HTMLInputElement;
		this.VallidateEmptyInput(inputField);
	}

	validateEmailField(event: Event): void {
		event.preventDefault();
		this.validateEmailInput();
	}

	validateFtpPort(event: Event): void {
		event.preventDefault();
		this.validateFTPPortInput()
	}

	validateFtpUrl(event: Event): void {
		event.preventDefault();
		this.validateFTPInput();
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

	fillWithCurrentCustomerData() {
		const apiKeyHeaderName = Constants.apiKeyHeaderName;
		new MakeRequest(
			`${Globals.apiUrl}profile/get`,
			'get', {
				[apiKeyHeaderName]: Globals.apiKey,
				'Content-Type': 'application/json'
		}
		).send().then(response => {
			var deliveryProfile = (JSON.parse(response as string)) as IDeliveryProfile;
			this.setProfile(deliveryProfile);
		}).catch(exception => {
			console.log(exception);
		});
	}

	getProfile(): IDeliveryProfile {
		var profile =
			{
				url: this.ftpUrlInput.value.trim(),
				//url: "ftp://waws-prod-am2-331.ftp.azurewebsites.windows.net/",
				port: Number(this.ftpPortInput.value.trim()),
				connectionMode: "Implicit",
				protocol: this.getSelectedFTPType(),
				fileTemplate: this.filenameInput.value.trim(),
				folderTemplate: this.pathInput.value.trim(),
				userName: this.usernameInput.value.trim(),
				password: this.passwordInput.value.trim(),
				contactEmail: this.contactEmail.value.trim(),
				contactName: this.contactName.value.trim()
			} as IDeliveryProfile;
		return profile;
	}

	setProfile(deliveryProfile: IDeliveryProfile): void {
			this.ftpUrlInput.value = deliveryProfile.url;
			this.ftpPortInput.value = deliveryProfile.port.toString();
			this.setSelectedFTPType(deliveryProfile.protocol);
			this.filenameInput.value = deliveryProfile.fileTemplate;
			this.pathInput.value = deliveryProfile.folderTemplate;
			this.usernameInput.value = deliveryProfile.userName;
			this.contactEmail.value = deliveryProfile.contactEmail;
			this.contactName.value = deliveryProfile.contactName;
			this.passwordInput.value = deliveryProfile.password;
	}


	validateFTPInput(): Boolean {
		const url = this.ftpUrlInput.value.trim();
		if (this.ftpUrlRexExp.test(url)) {
			this.ftpUrlInput.style.borderColor = this.successColor;
			return true;
		}
		else {
			this.ftpUrlInput.style.borderColor = this.errorColor;
			return false;
		}
	}

	validateFTPPortInput(): Boolean {
		const port = this.ftpPortInput.value.trim();
		if (this.ftpPortRexExp.test(port) && port.length != 0) {
			this.ftpPortInput.style.borderColor = this.successColor;
			return true;
		}
		else {
			this.ftpPortInput.style.borderColor = this.errorColor;
			return false;
		}
	}

	validateSelectElement(selectElement: HTMLSelectElement): Boolean {
		if (selectElement.selectedIndex != 0) {
			selectElement.style.borderColor = this.successColor;
			return true;
		}
		else {
			selectElement.style.borderColor = this.errorColor;
			return false;
		}
	}

	validateEmailInput(): Boolean {
		const value = this.contactEmail.value.trim();
		if (this.contactEmailExp.test(value)) {
			this.contactEmail.style.borderColor = this.successColor;
			return true;
		}
		else {
			this.contactEmail.style.borderColor = this.errorColor;
			return false;
		}
	}

	VallidateEmptyInput(inputField: HTMLInputElement): Boolean {
		if (inputField.value.trim() == '') {
			inputField.style.borderColor = this.errorColor;
			return false;
		}
		else {
			inputField.style.borderColor = this.successColor;
			return true;
		}
	}

	public checkInputs(): Boolean {

		let hasValidData = true;

		// validate url
		if (!this.validateFTPInput()) {
			hasValidData = false;
		}
		// validate port
		if (!this.validateFTPPortInput()) {
			hasValidData = false;
		}
		// validate type
		if (!this.validateSelectElement(this.typeElement)) {
			hasValidData = false;
		}
		// validate filename
		if (!this.VallidateEmptyInput(this.filenameInput)) {
			hasValidData = false;
		}

		// validate path
		if (!this.VallidateEmptyInput(this.pathInput)) {
			hasValidData = false;
		}

		// validate contact Name
		if (!this.validateEmailInput()) {
			hasValidData = false;
		}

		// validate username
		if (!this.VallidateEmptyInput(this.usernameInput)) {
			hasValidData = false;
		}

		// validate password
		if (!this.VallidateEmptyInput(this.passwordInput)) {
			hasValidData = false;
		}

		return hasValidData;
	}

	private setErrorfor(input: HTMLElement) {
		input.className = 'form-control error';
	}


	private setSucessFor(input: HTMLElement) {
		input.className = 'form-control success';
	}
	/*
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
	}*/

	private getSelectedFTPType(): FTPType {
		var selectedValue = this.typeElement.options[this.typeElement.selectedIndex].value
		return (<any>FTPType)[selectedValue];
	}

	private setSelectedFTPType(ftpType: FTPType) {
		const options = Array.prototype.slice.call(this.typeElement.options);
		const optionIndex = options.findIndex(option => option.innerHTML === ftpType.toString());
		this.typeElement.selectedIndex = optionIndex;
	}

	resetFields() {
		this.ftpUrlInput.value = '';
		this.ftpPortInput.value = '';
		this.typeElement.selectedIndex = 0;
		this.placeholderSelect.selectedIndex = 0;
		this.filenameInput.value = '';
		this.pathInput.value = '';
		this.contactEmail.value = '';
		this.usernameInput.value = '';
		this.passwordInput.value = '';
	}
}