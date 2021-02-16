import CustomElement from "../framework/custom-element.decorator";
import MakeRequest from '../framework/Utilities/MakeRequest';
import Branding from '../framework/Models/Branding';
import Constants from '../framework/Constants/Constants';
import Parameters from '../framework/Parameters/Parameters';
import { FloatingLabelInputElement, FloatingLabelSelectElement } from "../elements/Elements";
import '../framework/Utilities/DomManipulationExtensionMethods';
import ElementsCreator from '../framework/Utilities/ElementsCreator';
import ChildOnboardingRequest from "../framework/Models/ChildOnboardingRequest";
import ChildCompany from "../framework/Models/ChildCompany";
import { infoSVG15px } from "../framework/Constants/svgs";

@CustomElement({
	selector: 'collaborator-onboarding-form',
	template: `
		<form id="company-form">
			<input hidden id="id-field" />
			<div class="row">
				<div class="col col-spacing">
					<floating-label-input error="Du skal indtaste et gyldigt Kundenavn" id="name-field" label="Kundenavn*" required="true"></floating-label-input>
				</div>
				<div class="col col-spacing">
					<floating-label-input id="customer-number-field" label="Kundenr."></floating-label-input>
				</div>
				<div class="col col-spacing">
					<floating-label-input error="Du skal indtaste et gyldigt cvr nummer" number-input="true" id="cvr-field" label="CVR*" validator="cvr" required="true"></floating-label-input>
				</div>
				<div class="col col-spacing">
					<floating-label-input error="Du skal indtaste et gyldigt email" id="email-field" label="Email*" validator="email" required="true"></floating-label-input>
				</div>
				<div class="col col-spacing">
					<floating-label-input error="Du skal indtaste et gyldigt Afdeling" id="department-field" label="Afdeling">
						<style>
							onboarding-tooltip-element {
								background-color: #FFFFFF;
								padding: 2px 0 0 2px;
							}
						</style>
						<onboarding-tooltip-element slot="postfix" position="right">
							<span slot="handle">${infoSVG15px}</span>
							<span slot="title" style="display:none;">Unikt virksomhedsnavn</span>
							<span slot="content" style="display:none;">
								<div>
									Hvis virksomhedsnavnet ikke er unikt, skal feltet "Afdeling" udfyldes.
								</div>
								<br>
								<div>
									Eksempel 1:
									<div>
										<b>Unikt</b> virksomhedsnavn - <b>RealMæglerne Sorø</b>
									</div>
								</div>
								<br>
								<div>
									Eksempel 2:
									<div>
										<b>Ikke unikt</b> virksomhedsnavn - <b>Advodan</b>
									</div>
								</div>
							</span>
						</onboarding-tooltip-element>
					</floating-label-input>
				</div>
				<div class="col col-spacing" id="branding-field-wrapper">
					<floating-label-select-element error="Du skal indtaste et gyldigt Branding" id="branding-field" label="Branding*" required="true"></floating-label-select-element>
				</div>
				
			</div>
			<div class="button-wrapper">
				<button class="add-btn">
					<span>Opret</span>
				</button>
			</div>
		</form>
	`,
	style: `
		@import url('https://fonts.googleapis.com/css?family=Roboto');

		.button-wrapper {
			display: flex;
			justify-content: space-around;
			padding: 0 10px;
		}
		button {
			flex: 0 1 100%;
			font-family: Roboto, sans-serif;
			font-size: 14px;
			padding: 0 30px;
			border-radius: 5px;
			color: white;
			background-color: #de9d4d;
			outline: none;
			height: 47px;
			border: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: transform .2s;
		}
		button:hover {
			transform: scale(1.05);
		}

		.col-spacing {
			padding: 10px;
		}
		.row {
			display: flex;
			flex-wrap: wrap;
		}
		.col {
			flex-basis: 0;
			flex-grow: 1;
			max-width: 100%;
			box-sizing: border-box;
		}
		@media only screen and (max-width: 668px) {
			.col {
				flex-basis: unset;
			}
			button {
				width: 100%;
			}
		}
	`,
	useShadow: true,
})
export default class CollaboratorOnboardingFormComponent extends HTMLElement {

	private apiKey: string;
	private apiUrl: string;
	private formElement: HTMLFormElement;
	private idElement: HTMLInputElement;
	private nameElement: FloatingLabelInputElement;
	private customerNumberElement: FloatingLabelInputElement;
	private cvrElement: FloatingLabelInputElement;
	private emailElement: FloatingLabelInputElement;
	private departmentElement: FloatingLabelInputElement;
	private brandingElement: FloatingLabelSelectElement;
	private brandingElementWrapper: HTMLDivElement;
	private formSubmitEvent = new Event('submitted');
	private _submitResult: ChildCompany;
	private brandingFieldExists: boolean;

	id: string;
	name: string;
	customerNumber: string;
	cvr: string;
	email: string;
	department: string;
	branding: Branding;
	brandings: Branding[];

	constructor() {
		super();
	}

	get submitResult(): ChildCompany {
		return this._submitResult;
	}
	set submitResult(val: ChildCompany) {
		this._submitResult = val;
	}

	componentDidMount() {

		this.formElement = this.getChildElement('#company-form');
		this.idElement = this.getChildElement('#id-field');
		this.nameElement = this.getChildElement('#name-field');
		this.customerNumberElement = this.getChildElement('#customer-number-field');
		this.cvrElement = this.getChildElement('#cvr-field');
		this.emailElement = this.getChildElement('#email-field');
		this.departmentElement = this.getChildElement('#department-field');
		this.brandingElement = this.getChildElement('#branding-field');
		this.brandingElementWrapper = this.getChildElement("#branding-field-wrapper");

		this.apiKey = Parameters.apiKey;
		this.apiUrl = Parameters.apiUrl;

		this.bindEvents();
	}

	private bindEvents(): void {
		this.formElement.onsubmit = (event) => {
			event.preventDefault();
			this.submitForm();
		};
		this.nameElement.onblur = () => {
			this.nameElement.value = this.nameElement.value.trim();
			this.nameElement.validate();
		};
		this.customerNumberElement.onblur = () => {
			this.customerNumberElement.value = this.customerNumberElement.value.trim();
		};
		this.cvrElement.onblur = () => {
			this.cvrElement.value = this.cvrElement.value.trim();
			this.cvrElement.validate();
		};
		this.emailElement.onblur = () => {
			this.emailElement.value = this.emailElement.value.trim();
			this.emailElement.validate();
		};
		this.departmentElement.onblur = () => {
			this.departmentElement.value = this.departmentElement.value.trim();
			this.departmentElement.validate();
		};
		this.brandingElement.onblur = () => { this.brandingElement.validate(); };
	}
	private formValid(): boolean {
		const allElementsValid = this.nameElement.valid &&
			this.cvrElement.valid &&
			this.emailElement.valid &&
			this.departmentElement.valid &&
			(this.brandingElement.valid || !this.brandingFieldExists);
		return allElementsValid;
	}
	private validateForm(): void {
		this.nameElement.validate();
		this.cvrElement.validate();
		this.emailElement.validate();
		this.departmentElement.validate();
		if (this.brandingFieldExists) {
			this.brandingElement.validate();
		}
	}

	private submitForm() {
		if (!this.formValid()) {
			this.validateForm();
			return;
		}
		const overlay = ElementsCreator.generateOverlay();
		this.appendChildElement(overlay);

		const addCompanySpinner = ElementsCreator.generateSpinner(20, false, '0 0 0 10px');
		const addButton = this.getChildElement('.add-btn') as HTMLButtonElement;
		addButton.appendChildElement(addCompanySpinner);

		const headerName = Constants.collaboratorOnboardingApiKeyHeaderName;
		new MakeRequest(`${this.apiUrl}api/CollaboratorOnboarding/CreateChildCompany`, 'post', {
			[headerName]: this.apiKey,
			'Content-Type': 'application/json'
		})
			.send(JSON.stringify(this.extractData()))
			.then(res => {
				this.removeChildElement(overlay);

				addButton.removeChildElement(addCompanySpinner);
				this.submitResult = JSON.parse(res as string);
				this.dispatchEvent(this.formSubmitEvent);
			}).catch((exception) => {
				console.log(exception);
				this.removeChildElement(overlay);
				addButton.removeChildElement(addCompanySpinner);

				const errorSnackbar = ElementsCreator.generateSnackbar();
				this.appendChildElement(errorSnackbar);
				setTimeout(() => {
					this.removeChildElement(errorSnackbar);
				}, 3000);
			});
	}

	private extractData(): ChildOnboardingRequest {
		this.id = this.idElement.value;
		this.name = this.nameElement.value;
		this.customerNumber = this.customerNumberElement.value;
		this.cvr = this.cvrElement.value;
		this.email = this.emailElement.value;
		this.department = this.departmentElement.value;
		this.branding = null;
		if (this.brandingElement.value && this.brandingElement.value != null && this.brandingElement.value != 'null') {
			this.branding = new Branding({
				id: this.brandingElement.value
			});
		}
		return new ChildOnboardingRequest({
			id: this.id,
			name: this.name,
			customerNumber: this.customerNumber,
			cvr: this.cvr,
			email: this.email,
			department: this.department,
			branding: this.branding,
		});
	}

	setFieldsValues(companyData: ChildOnboardingRequest, brandings: Branding[]) {
		if (!companyData) {
			return;
		}
		this.idElement.value = companyData.id;
		this.nameElement.value = companyData.name;
		this.customerNumberElement.value = companyData.customerNumber;
		this.cvrElement.value = companyData.cvr;
		this.emailElement.value = companyData.email;
		this.departmentElement.value = companyData.department;

		if (!brandings || brandings.length === 0) {
			this.brandingElementWrapper.remove();
			this.brandingFieldExists = false;
			return;
		}
		this.brandingFieldExists = true;
		this.brandings = brandings;
		this.brandingElement.removeAllOptions();
		this.brandingElement.addOption('Ingen branding', null);
		brandings.forEach(branding => {
			this.brandingElement.addOption(branding.key, branding.id);
		});
		if (!companyData.branding || !companyData.branding.id) {
			this.brandingElement.value = null;
			return;
		}
		this.brandingElement.value = companyData.branding.id;
	}

}
