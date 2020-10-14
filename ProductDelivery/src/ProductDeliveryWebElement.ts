import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import Translator from "./Framework/Language/Translator";


@CustomElement({
	selector: 'product-delivery',
	template: `
<div class="wrapper">
	<h2>Product Delivery Setup</h2>
	<div class="container container--left">	 <!-- move this to a independent web component -->
		<label id="url">FTP address</label>
		<custom-input-element name="url"></custom-input-element>
		<label id="port">Port</label>
		<custom-input-element name="port"></custom-input-element>
		<label id="type">Type</label>
		<select class="select">
			<option>FTP</option>
			<option>FTPS</option>
		</select>
		<label id="fileName">File Name (template)</label>
		<select class="select">
			<option>Template 1</option>
			<option>Template 2</option>
			<option>Template 3</option>
		</select>
		<label id="path">Path</label>
		<custom-input-element name="path"></custom-input-element>
		<button class="button">Save</button>
	</div>	
	<div class="container container--right"> <!-- move this to a independent web component -->
		<label id="status">Delivery result</label> 
		<div>
			<p>
				Here shows current status of FTP Connection.
			</p>
		</div>
		<button class="button">Try</button> 
	</div>
	<table class="content-table"> <!-- move this to a independent web component -->
		<tbody>
			<tr class="active-row">
				<td>localhost:8080</td>
				<td>80</td>
				<td>FTPS</td>
				<td>Audit Report 2020</td>
				<td>/Report/Audit</td>
				<td>Sucess</td>
			</tr>
		</tbody>
	</table>
</div>
	`,
	style: `
/* latin */
@font-face {
	font-family: 'Mulish';
	font-style: normal;
	font-weight: 500;
	font-display: swap;
	src: url(https://fonts.gstatic.com/s/mulish/v1/1Ptvg83HX_SGhgqk3wot.woff2) format('woff2');
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
* {
	font-family: "Mulish", sans-serif;
	color: #000;
}

/* text */
h1, h2, h3, h4, h5, p, span {
	width:100%;
}

h1 {
	font-weight: 800;
	font-size: 24px;
	line-height: 30px;
}

/* label text */
label {
	display: block;
	padding-top: 5px;
 	padding-bottom: 5px;
}

/* button */
.button {
	background:#808080;
	border: none;
	color: white;
	padding: 10px 27px;
	text-align: center;
	float: right;
	display: inline-block;
	font-size: 16px;
	margin: 4px 2px;
	cursor: pointer;
  }

/* select */
.select{
	width: 100% !important;
	height: 40px;
	border-radius: 4px;
	border-color: 1px solid #DFDFDF;
}

/* inputs boxes */
input, select, textarea, *-element {
	height: 40px;
	border-radius: 4px;
	box-sizing: border-box;
	border: 1px solid #DFDFDF;
	background: #fff;
	padding-bottom: 5px;
}
.wrapper {
	width: 100%;
}

.container {
	width: calc(50% - 51px);
	position: relative;
	float: left;
}

.container--left {
	padding-right: 50px;
	border-right: 1px solid #DFDFDF; 
}

.container--right {
	padding-left: 50px;
}

table
{
	width: 100%;
	clear: both;
}
`,
	useShadow: true,
})
export default class ProductDeliveryWebElement extends CustomHTMLBaseElement {
	private titleLabel: HTMLElement;
	private descriptionLabel: HTMLElement;
	private submitButton: HTMLElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.titleLabel = this.getChildElement('#title-label');
		this.descriptionLabel = this.getChildElement('#description-label');
		this.submitButton = this.getChildElement('#submit-btn');

		this.getAttributeNames().forEach(attributeName => {
			let attributeValue = this.getAttribute(attributeName);
			this.attributeChanged(attributeName, null, attributeValue);
		});

	}

	private changeLanguage(language: string) {
		if (!this.titleLabel || !this.descriptionLabel || !this.submitButton) {
			return;
		}
		this.titleLabel.innerHTML = Translator.translate('Form.Tilte', language);
		this.descriptionLabel.innerHTML = Translator.translate('Form.Description', language);
		this.submitButton.innerHTML = Translator.translate('Form.Submit', language);
	}

	private static get observedAttributes() {
		return ['language'];
	}
	attributeChangedCallback(name: string, oldVal: string, newVal: string) {
		this.attributeChanged(name, oldVal, newVal);
	}
	private attributeChanged(name: string, oldVal: string, newVal: string) {
		switch (name) {
			case 'language':
				this.changeLanguage(newVal)
				break;
		}
	}

}