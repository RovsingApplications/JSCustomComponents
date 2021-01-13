import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import SVGs from '../../Framework/Constants/SVGs';
import { NemIdImageDataUrl } from '../../Framework/Constants/images/nem-id';
import Branding from '../../Framework/Models/Branding';
import Conversions from '../../Framework/Utilities/Conversions';
import Globals from '../../Framework/Globals/Globals';
import { AlignmentPositionEnum } from '../../Framework/Models/AlignmentPositionEnum';
import ColorsUtility from '../../Framework/Utilities/ColorsUtility';
import Colors from '../../Framework/Constants/Colors';

@CustomElement({
	selector: 'esignatur-branding-sign-preview',
	template: `
		<div class="esignatur-branding-sign-preview-container-ie-border">
			<div class="esignatur-branding-sign-preview-container">
				<div class="sign-preview-nav">
					<div class="sign-preview-nav-content">
						<div class="logo-container">
							<span id="logo-image"></span>
						</div>
						<ul class="language-flags">
							<li>${SVGs.daSVG}</li>
							<li>${SVGs.gbSVG}</li>
							<li>${SVGs.noSVG}</li>
							<li>${SVGs.seSVG}</li>
						</ul>
					</div>
				</div>
				<!-- Step indicator navbar-fixed-top -->
				<div class="row">
					<ul class="stepindicator">
						<li class="box active">
							<span class="stepnumber">1</span>
							<span class="steptxt">Log ind</span>
							<div class="divider">&nbsp;</div>
						</li>
						<li class="box">
							<span class="stepnumber">2</span>
							<span class="steptxt">Læs</span>
							<div class="divider">&nbsp;</div>
						</li>
						<li class="box">
							<span class="stepnumber">3</span>
							<span class="steptxt">Underskriv</span>
							<div class="divider">&nbsp;</div>
						</li>
						<li class="box">
							<span class="stepnumber">4</span>
							<span class="steptxt">Kvittering</span>
							<div class="divider">&nbsp;</div>
						</li>
					</ul>
				</div>

				<!-- Body -->
				<div class	="sign-preview-content-header row">
					<h3>Log ind</h3>
					Du skal logge ind, før du kan læse og underskrive eller downloade et aftaledokument.
					<br><br>
					Bruger du NemID/BankID, og oplever du, at feltet er længe om at loade, kan du enten forsøge at skifte browser eller deaktivere din browsers plugins. Du har desuden mulighed for at underskrive fra din mobil eller tablet.
				</div>

				<div class="row border-box">
					<ul class="language-select">
						<li>
							<img src="https://sign.esignatur.dk/Content/img/lang/dk.svg">
							<span>Nøglekort</span>
						</li>
						<span class="dropdown-arrow-icon">${SVGs.triangle}</span>
					</ul>
				</div>
				<div class="row border-box">
					<img class="nem-id-img" src="${NemIdImageDataUrl}">
				</div>
				<div class="row sign-preview-footer">
						<img src="${Globals.esignaturSecuredbyLogoUrl}" alt="secured by eSignatur">
				</div>
			</div>
		</div>
	`,
	style: `
		@media (min-width: 1200px) {
			.sign-preview-nav-content.full-screen {
				width: 1170px;
			}
		}
		@media (min-width: 992px) {
			.sign-preview-nav-content.full-screen {
				width: 970px;
			}
		}
		@media (min-width: 768px) {
			.sign-preview-nav-content.full-screen {
				width: 750px;
			}
		}
	
		* {
			transition: 0.5s;
		}
		.row {
			width: 66.66667%;
			max-width: 650px;
			margin: auto;
			padding: 0 15px;
		}
		.esignatur-branding-sign-preview-container-ie-border {
			border-left-color: #FFFFFF;
			border-left-style: solid;
			border-left-width: 600px;
		}
		.esignatur-branding-sign-preview-container {
			font-family: 'Raleway', sans-serif;
			margin-left:-600px;
			background: #FFFFFF;
		}
		.sign-preview-nav {
			background: #B6B8BA;
			padding: 15px 20px;
			display: flex;
		}
		.sign-preview-nav-content {
			display: flex;
			margin: auto;
			width: 100%;
		}
		.logo-container {
			flex-grow: 1;
			display: flex;
			align-items: center;
		}
		#logo-image {
			background-position: left;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(${Globals.esignaturLogoUrl});
			height:30px;
			width:100%;
			padding-left: 100%;
		}
		.language-flags {
			display: flex;
			list-style: none;
			margin: 0;
		}
		.language-flags li {
			opacity: 0.3;
		}
		.language-flags li:first-child {
			opacity: 1;
		}
		.language-flags svg {
			width: 20px;
			height: 20px;
			margin: 10px;
		}
		.stepindicator {
			display: flex;
			list-style: none;
			padding: 5px 0 30px 0;
		}
		.stepindicator li {
			display: flex;
		}
		.stepindicator li.box {
			width: 22%;
			line-height: 34px;
			height: 34px;
			background: #D3D3D3;
		}
		.stepindicator li.box.active {
			width: 34%;
			background: #325d77;
		}
		.stepindicator li .stepnumber {
			color: ${Colors.denary};
			font-family: Verdana;
			font-size: 16px;
			text-align: center;
			width: 100%;
			font-size: 16px;
		}
		.stepindicator li.box.active .stepnumber {
			color: #FFFFFF;
		}
		.stepindicator li .steptxt {
			display: none;
		}
		.stepindicator li .divider {
			background: #FFFFFF;
			width: 1px;
		}
		.stepindicator li:last-child .divider {
			display: none;
		}
		.sign-preview-content-header {
			box-sizing: border-box;
			font-size: 14px;
			line-height: 1.42857;
			color: ${Colors.denary};
		}
		.sign-preview-content-header h3 {
			color: #325d77;
			font-size: 24px;
			margin-top: 20px;
			margin-bottom: 10px;
			font-weight: 400;
		}
		.border-box {
			box-sizing: border-box;
		}
		ul.language-select {
			display: inline-flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 20px;
			list-style: none;
			height: 49px;
			width: 220px;
			box-sizing: border-box;
			border: solid 1px #325d77;
			border-radius: 4px;
		}
		ul.language-select li {
			font-weight: 600px;
			font-size: 14px;
			line-height: 1.42857;
			color: ${Colors.denary};
		}
		.language-select img {
			margin-right: 10px;
			width: 24px;
			height: 24px;
			vertical-align: middle;
			display: inline-block;
		}
		.dropdown-arrow-icon svg {
			width: 12px;
		}
		.dropdown-arrow-icon svg polygon{
			fill: #325D77;
		}
		.nem-id-img {
			max-width: 100%;
		}
		.sign-preview-footer {
			text-align: center;
			padding: 50px 0 5px 0;
		}
		.sign-preview-footer img {
			width: 140px;
		}
	`,
	useShadow: true,
})
export default class BrandingSignPreview extends CustomHTMLBaseElement {

	constructor() {
		super();
	}

	componentDidMount() {

	}

	styleComponent(branding: Branding) {
		this.styleColoring(branding);
		this.styleLogo(branding);
	}

	private styleLogo(branding: Branding) {
		const logoElement = this.getChildElement<HTMLImageElement>('#logo-image');

		const logoScale = branding.logoScale ? branding.logoScale / 100 : 1;
		const logoHeight = parseInt((logoScale * 30).toString());
		logoElement.style.height = `${logoHeight}px`;

		const logoSrc = branding.logoDataUrl ? branding.logoDataUrl : Globals.esignaturLogoUrl;
		logoElement.style.backgroundImage = `url(${logoSrc})`;

		const logoAlignment = branding.logoAlignment ? Conversions.alignmentEnumToStyle(branding.logoAlignment) : Conversions.alignmentEnumToStyle(AlignmentPositionEnum.left);
		logoElement.style.backgroundPosition = logoAlignment;
	}

	private styleColoring(branding: Branding) {
		const navElement = this.getChildElement('.sign-preview-nav');
		const stepIndicatorBoxes = this.getChildElements<HTMLElement>('.stepindicator li.box');
		const stepIndicatorActiveBox = this.getChildElement('.stepindicator li.box.active');
		const stepIndicatorsStepNumber = this.getChildElements<HTMLElement>('.stepindicator li .stepnumber');
		const contentPreview = this.getChildElement('.sign-preview-content-header');
		const contentPreviewH3 = this.getChildElement('.sign-preview-content-header h3');
		const languageSelectLi = this.getChildElement('ul.language-select li');
		const languageArrow = this.getChildElement('.dropdown-arrow-icon svg polygon');

		navElement.style.background = Conversions.colorToStyle(branding.backgroundColor);
		stepIndicatorBoxes.forEach(box => {
			box.style.background = Conversions.nullColorToTransparent(branding.secondaryColor);
		});
		stepIndicatorActiveBox.style.background = Conversions.nullColorToTransparent(branding.primaryColor);
		stepIndicatorsStepNumber.forEach(stepIndicatorStepNumber => {
			stepIndicatorStepNumber.style.color = Conversions.nullColorToTransparent(branding.textColor);
		});
		contentPreview.style.color = Conversions.nullColorToTransparent(branding.textColor);
		contentPreviewH3.style.color = Conversions.nullColorToTransparent(branding.primaryColor);
		languageSelectLi.style.color = Conversions.nullColorToTransparent(branding.textColor);
		languageArrow.style.fill = Conversions.nullColorToTransparent(branding.primaryColor);

		this.setStepsTextColor(branding);
	}

	private setStepsTextColor(branding: Branding) {
		const activeStep = this.getChildElement('.box.active .stepnumber');
		const nonActiveSteps = this.getChildElements<HTMLElement>('.box:not(.active) .stepnumber');

		const primaryColorToWhiteContrastRatio = ColorsUtility.getContrastRatio(branding.primaryColor, '#FFFFFF');
		const primaryColorToBlackContrastRatio = ColorsUtility.getContrastRatio(branding.primaryColor, '#000000');

		const secondaryColorToWhiteContrastRatio = ColorsUtility.getContrastRatio(branding.secondaryColor, '#FFFFFF');
		const secondaryColorToBlackContrastRatio = ColorsUtility.getContrastRatio(branding.secondaryColor, '#000000');
		
		if (primaryColorToBlackContrastRatio > primaryColorToWhiteContrastRatio) {
			activeStep.style.color = Colors.denary;
		} else {
			activeStep.style.color = '#FFFFFF';
		}

		if (secondaryColorToBlackContrastRatio > secondaryColorToWhiteContrastRatio) {
			nonActiveSteps.forEach(step => {
				step.style.color = Colors.denary;
			});
		} else {
			nonActiveSteps.forEach(step => {
				step.style.color = '#FFFFFF';
			});
		}
	}

	magnifyPreview() {
		const navContent = this.getChildElement('.sign-preview-nav-content');
		navContent.classList.add('full-screen');
	}
	unmagnifyPreview() {
		const navContent = this.getChildElement('.sign-preview-nav-content');
		navContent.classList.remove('full-screen');
	}
}
