import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';
import SVGs from '../../Framework/Constants/SVGs';
import { NemIdImageDataUrl } from '../../Framework/Constants/images/nem-id';
import Branding from '../../Framework/Models/Branding';
import Conversions from '../../Framework/Utilities/Conversions';
import Globals from '../../Framework/Globals/Globals';
import { AlignmentPositionEnum } from '../../Framework/Models/AlignmentPositionEnum';

@CustomElement({
	selector: 'esignatur-branding-sign-preview',
	template: `
		<div class="esignatur-branding-sign-preview">
			<div class="sign-preview-nav">
				<img src="${Globals.esignaturLogoUrl}" alt="logo">
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
	`,
	style: `
		* {
			transition: 0.5s;
		}
		.row {
			width: 66.66667%;
			max-width: 650px;
			margin: auto;
			padding: 0 15px;
		}
		.esignatur-branding-sign-preview {
			font-family: 'Raleway', sans-serif;
			min-width: 600px;
			background: #FFFFFF;
		}
		.sign-preview-nav {
			background: #B6B8BA;
			padding: 15px 40px;
		}
		.sign-preview-nav img {
			max-height: 30px;
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
			color: #333333;
			font-family: Verdana;
			font-size: 16px;
			text-align: center;
			width: 100%;
			font-size: 16px;
		}
		.stepindicator li.box.active .stepnumber {
			color: #FFFFFF !important;
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
			color: #333333;
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
			color: #333333;
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
		const navElement = this.getChildElement('.sign-preview-nav');
		const logoElement = this.getChildElement<HTMLImageElement>('.sign-preview-nav img');

		const logoScale = branding.logoScale ? branding.logoScale / 100 : 1;
		logoElement.style.transform = `scale(${logoScale})`;

		const logoSrc = branding.logoDataUrl ? branding.logoDataUrl : Globals.esignaturLogoUrl;
		logoElement.src = logoSrc;

		const logoAlignment = branding.logoAlignment ? AlignmentPositionEnum[branding.logoAlignment] : 'left';
		navElement.style.textAlign = logoAlignment;
	}

	private styleColoring(branding: Branding) {
		const navElement = this.getChildElement('.sign-preview-nav');
		const stepIndicatorBoxes = this.getChildElements<HTMLElement>('.stepindicator li.box');
		const stepIndicatorActiveBox = this.getChildElement('.stepindicator li.box.active');
		const stepIndicatorStepNumber = this.getChildElement('.stepindicator li .stepnumber');
		const contentPreview = this.getChildElement('.sign-preview-content-header');
		const contentPreviewH3 = this.getChildElement('.sign-preview-content-header h3');
		const languageSelectLi = this.getChildElement('ul.language-select li');
		const languageArrow = this.getChildElement('.dropdown-arrow-icon svg polygon');

		navElement.style.background = Conversions.colorToStyle(branding.backgroundColor);
		stepIndicatorBoxes.forEach(box => {
			box.style.background = Conversions.nullColorToTransparent(branding.secondaryColor);
		});
		stepIndicatorActiveBox.style.background = Conversions.nullColorToTransparent(branding.primaryColor);
		stepIndicatorStepNumber.style.color = Conversions.nullColorToTransparent(branding.textColor);
		contentPreview.style.color = Conversions.nullColorToTransparent(branding.textColor);
		contentPreviewH3.style.color = Conversions.nullColorToTransparent(branding.primaryColor);
		languageSelectLi.style.color = Conversions.nullColorToTransparent(branding.textColor);
		languageArrow.style.fill = Conversions.nullColorToTransparent(branding.primaryColor);
	}
}
