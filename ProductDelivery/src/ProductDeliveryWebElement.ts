import CustomElement from "./Framework/custom-element.decorator";
import CustomHTMLBaseElement from "./Elements/CustomHTMLBaseElement";
import Translator from "./Framework/Language/Translator";


@CustomElement({
	selector: 'product-delivery',
	template: `
<div class="wrapper">
	<h2>Product Delivery Setup</h2>
	<div class="horizontal">
		<label id="port">Produuct Delivery :</label>
		<div class="onoffswitch">
				<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="customSwitch" tabindex="0" checked>
				<label class="onoffswitch-label" for="customSwitch">
					<span class="onoffswitch-inner"></span>
					<span class="onoffswitch-switch"></span>
				</label>
		</div>
	</div>
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
		
		<div>
			<p>
				Here shows current status of FTP Connection.
			</p>
		</div>
		<button class="button">Try</button> 
	</div>
	<h3>Deliveries</h3>
	<table> <!-- move this to a independent web component -->
		<tbody>
			<tr class="active-row">
				<td>localhost:8080</td>
				<td>80</td>
				<td>FTPS</td>
				<td>Sucess</td>
			</tr>
			<tr class="active-row">
				<td>localhost:8080</td>
				<td>21</td>
				<td>FTP</td>
				<td>Fail</td>
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

.horizontal{
	display: inline-block
	text-align:right;
	float:right;
}

/* onoffswitch */	
.onoffswitch {
    position: relative; width: 55px;
	-webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
}
.onoffswitch-checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
.onoffswitch-label {
    display: block; overflow: hidden; cursor: pointer;
    border: 2px solid #999999; border-radius: 9px;
}
.onoffswitch-inner {
    display: block; width: 200%; margin-left: -100%;
    transition: margin 0.3s ease-in 0s;
}
.onoffswitch-inner:before, .onoffswitch-inner:after {
    display: block; float: left; width: 50%; height: 18px; padding: 0; line-height: 18px;
    font-size: 11px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold;
    box-sizing: border-box;
}
.onoffswitch-inner:before {
    content: "ON";
    padding-left: 5px;
    background-color: #FFFFFF; color: #94C5D6;
}
.onoffswitch-inner:after {
    content: "OFF";
    padding-right: 5px;
    background-color: #EEEEEE; color: #999999;
    text-align: right;
}
.onoffswitch-switch {
    display: block; width: 17px; margin: 0.5px;
    background: #FFFFFF;
    position: absolute; top: 0; bottom: 0;
    right: 33px;
    border: 2px solid #999999; border-radius: 9px;
    transition: all 0.3s ease-in 0s; 
}
.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
    margin-left: 0;
}
.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
    right: 0px; 
}
/*table*/
table
{
	width: 100%;
	clear: both;
	font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
	border-collapse: collapse;
	margin: 4px 2px;  
	  
}
table td{
	border: 1px solid #ddd;
	padding: 8px;
  }
table tr:nth-child(even){background-color: #f2f2f2;}
table tr:hover {background-color: #ddd;}
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