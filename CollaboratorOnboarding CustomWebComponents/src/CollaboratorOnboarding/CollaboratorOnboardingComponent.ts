import CustomElement from "../framework/custom-element.decorator";
import Parameters from '../framework/Parameters/Parameters';
import MakeRequest from "../framework/Utilities/MakeRequest";
import Constants from "../framework/Constants/Constants";
import ParentCompany from "../framework/Models/ParentCompany";
import ElementsCreator from '../framework/Utilities/ElementsCreator';
import CollaboratorOnboardingFormComponent from "./CollaboratorOnboardingFormComponent";
import ChildOnboardingRequest from "../framework/Models/ChildOnboardingRequest";
import '../framework/Utilities/DomManipulationExtensionMethods';
import ChildCompaniesTable from "./ChildCompaniesTable";

@CustomElement({
	selector: 'esignatur-collaborator-onboarding',
	template: `
		<div id="main-container">
			<div id="form-wrapper">
				<collaborator-onboarding-form></collaborator-onboarding-form>
			</div>
			<div id="child-companies-table-wrapper"></div>
		</div>
	`,
	style: `
		@import url('https://fonts.googleapis.com/css?family=Roboto');

		collaborator-onboarding-form

		* {
			outline: none;
			font-family: Roboto, sans-serif;
		}

		collaborator-onboarding-form {
			display: block;
		}

		#main-container,
		#form-wrapper,
		#child-companies-table-wrapper {
			position: relative;
		}
		#form-wrapper {
			padding: 20px 20px 0 20px;
		}
		#child-companies-table-wrapper {
			padding: 20px;
		}

		.no-records {
			text-align: center;
			padding: 50px;
			font-size: 20px;
			color: grey;
		}
	`,
	useShadow: true,
})
export default class CollaboratorOnboardingComponent extends HTMLElement {

	private apiKey: string;
	private apiUrl: string;
	private parentCompany: ParentCompany;
	private brandingsExists: boolean;
	private mainContainer: HTMLElement;
	private formWrapper: HTMLElement;
	private childCompaniesTableWrapper: HTMLElement;
	private childCompaniesTable: ChildCompaniesTable;

	constructor() {
		super();
	}

	static get observedAttributes() {
		return ['api-key', 'api-url'];
	}

	componentDidMount() {
		this.mainContainer = this.getChildElement('#main-container');
		this.formWrapper = this.getChildElement('#form-wrapper');
		this.childCompaniesTableWrapper = this.getChildElement('#child-companies-table-wrapper');

		this.renderComponent();
	}

	private renderComponent() {
		const formSpinner = ElementsCreator.generateSpinner(100);
		this.formWrapper.fillContent(formSpinner);
		const headerName = Constants.collaboratorOnboardingApiKeyHeaderName;
		new MakeRequest(
			`${this.apiUrl}api/CollaboratorOnboarding/ParentCompany`,
			'get', { [headerName]: this.apiKey }
		).send().then(res => {
			this.parentCompany = new ParentCompany(JSON.parse(res as string));
			Parameters.parentCompany = this.parentCompany;
			if (this.parentCompany.brandings.length > 0) {
				this.brandingsExists = true;
			}

			const newCompanyForm = new CollaboratorOnboardingFormComponent();
			this.formWrapper.fillContent(newCompanyForm);

			this.childCompaniesTable = new ChildCompaniesTable();
			this.childCompaniesTable.addEventListener('error', () => { this.displayError() });

			newCompanyForm.setFieldsValues(new ChildOnboardingRequest({}), this.parentCompany.brandings);
			newCompanyForm.addEventListener('submitted', () => {
				if (!this.childCompaniesTable.numberOfRows) {
					this.childCompaniesTable.renderTable(this.childCompaniesTableWrapper, this.brandingsExists);
					return;
				}
				if (this.childCompaniesTable.currentPage !== 1) {
					this.childCompaniesTable.renderTable(this.childCompaniesTableWrapper, this.brandingsExists, 1)
						.then(() => {
							this.childCompaniesTable.animateFirstRow();
						}).catch((error) => { this.displayError(); });;
					return;
				}
				this.childCompaniesTable.addChildCompanyRow(newCompanyForm.submitResult, true, true, true, true);
				newCompanyForm.setFieldsValues(new ChildOnboardingRequest({}), this.parentCompany.brandings);
			});
			this.childCompaniesTable.renderTable(this.childCompaniesTableWrapper, this.brandingsExists);
		}).catch(exception => {
			console.log(exception);
			if (this.formWrapper.hasChildElement(formSpinner)) {
				this.formWrapper.removeChildElement(formSpinner);
			}
			this.displayError();
		});
	}

	private displayError() {
		const errorElement = ElementsCreator.generateErrorBlock();
		this.mainContainer.fillContent(errorElement);
	}

	attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}

	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'api-key':
				Parameters.apiKey = newVal;
				this.apiKey = newVal;
				break;
			case 'api-url':
				Parameters.apiUrl = newVal;
				this.apiUrl = newVal;
				break;
		}
	}

}
