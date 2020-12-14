import CustomElement from "../Framework/custom-element.decorator";
import DeliveryResult from "../models/DeliveryResult";
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";
import Colors from "../Framework/Constants/Colors"

@CustomElement({
	selector: 'delivery-result',
	template: `
<!-- move this to a independent web component -->
<label>Delivery result</label>
<div class="result-box pad-10">
</div>
	`,
	style: `

	/* result-box */
	.result-box {
		position: relative;
		width: 100%;
		background: ${Colors.senary};
		border: 1px solid ${Colors.tertiary};
		box-sizing: border-box;
		border-radius: 4px;
		height: 470px;
		margin-top: 10px;
		overflow: auto;
	}
	* {
		font-family: "Mulish", sans-serif;
		color: ${Colors.font};
	}
	.pad-10 {
		padding: 10px;
	}
	
	.label {
		font-size: 14px;
	}

	.loader {
		border: 10px solid white;
		border-top: 10px solid ${Colors.primary};
		border-right: 10px solid ${Colors.primary};
		border-bottom: 10px solid ${Colors.primary};
		border-radius: 50%;
		width: 60px;
		height: 60px;
		animation: spin 3s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.hide-loader{
		display:none;
	}

	.center {
		position: relative;
  		height: 50px;
  		background-color: ${Colors.senary};
  		top: 40%;
	}

	.firsttext {
		font-family: Mulish;
		font-style: normal;
		font-weight: normal;
		font-size: 20px;
		line-height: 25px;
		text-align: center;
		color: ${Colors.font};
		margin-left: -165px;
	}

	.secondtext {
		background: ${Colors.senary};
		box-sizing: border-box;
		border-radius: 4px;
		height: 34.53px;
		text-align: center;
		margin-left: -165px;
	}

	.resultcontent {
		position: absolute;
		font-family: Mulish;
		font-style: normal;
		font-weight: bold;
		font-size: 11px;
		line-height: 13px;
		color: ${Colors.primary};
	}

	ul {
		list-style-type: none;
		padding: 0;
	}
	
	`,
	useShadow: false,
})
export default class CustomDeliveryResultElement extends CustomHTMLBaseElement {
	private mainDivElement: HTMLDivElement;

	constructor() {
		super();
	}

	componentDidMount() {
		this.mainDivElement = this.getChildElement('.result-box');
		this.initialResultText();
	}

	addWaitingSpinner() {
		this.clearContent();
		var outerDivElement = document.createElement("div");
		outerDivElement.classList.add("center");
		var innerDivElement = document.createElement("div");
		innerDivElement.classList.add("loader");
		var firstText = document.createElement('p');
		firstText.innerText = 'Connecting';
		firstText.classList.add('firsttext');
		var secondText = document.createElement('p');
		secondText.innerHTML = 'Connecting to product delivery <br> is in progress...';
		secondText.classList.add('secondtext');
		outerDivElement.appendChild(innerDivElement);
		outerDivElement.appendChild(firstText);
		outerDivElement.appendChild(secondText);
		this.mainDivElement.appendChild(outerDivElement);
	}

	removeBusyWaiting() {
		this.clearContent()
	}

	initialResultText() {
		var outerDivElement = document.createElement("div");
		outerDivElement.classList.add("center");
		var firstText = document.createElement('p');
		firstText.innerText = 'Awaiting test';
		firstText.classList.add('firsttext');
		var secondText = document.createElement('p');
		secondText.innerHTML = 'Please enter your credentials and test your <br> connection to product delivery';
		secondText.classList.add('secondtext');
		outerDivElement.appendChild(firstText);
		outerDivElement.appendChild(secondText);
		this.mainDivElement.appendChild(outerDivElement);
	}



	AddDeliveryResult(deliveryResult: DeliveryResult) {
		this.clearContent();
		var div = this.addEventDiv(deliveryResult);
		if (div != null) {
			this.mainDivElement.appendChild(div);
		}
	}

	clearContent() {
		this.mainDivElement.innerHTML = "";
	}

	formatDate() {
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		hours = hours % 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? 0 + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + seconds + ' ';
		return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
	}


	AddDeliveryResults(deliveryResults: DeliveryResult[]) {
		this.clearContent();
		var sucessResults = 0;
		var failedResults = 0;
		deliveryResults.forEach(dr => {
			if (dr.resultStatus === 'Success') {
				sucessResults += 1;
			}
			else {
				failedResults += 1;
			}
		});
		var resultDivElement = document.createElement("div");
		resultDivElement.classList.add("resultcontent");
		var labelText = document.createTextNode(`Summary`);
		var unOrderedList = document.createElement("ul");
		var nodesucess = document.createElement("LI");
		var textnodeSuccess = document.createTextNode(`Number of Success Delivery Results : ${sucessResults}`);
		nodesucess.appendChild(textnodeSuccess);
		unOrderedList.appendChild(nodesucess);
		var nodefailed = document.createElement("LI");
		var textnodeFailed = document.createTextNode(`Number of Failed Delivery Results : ${failedResults}`);
		nodefailed.appendChild(textnodeFailed);
		unOrderedList.appendChild(nodefailed);
		resultDivElement.appendChild(labelText);
		resultDivElement.appendChild(unOrderedList);
		this.mainDivElement.appendChild(resultDivElement);
	}

	createDeliveryProfile(deliveryResult: DeliveryResult) {
		this.clearContent();
		var resultDivElement = document.createElement("div");
		resultDivElement.classList.add("resultcontent");
		var paragraphElement = document.createElement("p");
		paragraphElement.innerText = `Profile saved successfully!`;
		resultDivElement.appendChild(paragraphElement);
		this.mainDivElement.appendChild(resultDivElement);
	}

	private addEventDiv(deliveryResult: DeliveryResult): HTMLDivElement {
		if (deliveryResult.eventLog != null) {
			var resultDivElement = document.createElement("div");
			resultDivElement.classList.add("resultcontent");
			var datetime = this.formatDate();
			var labelText = document.createTextNode(`${datetime} - ${deliveryResult.id}`);
			var unOrderedList = document.createElement("ul");
			var eventList = (deliveryResult.eventLog as string[]);
			eventList.forEach(event => {
				var node = document.createElement("LI");
				var textnode = document.createTextNode(`$ ${event}`);
				node.appendChild(textnode);
				unOrderedList.appendChild(node);
			});
			resultDivElement.appendChild(labelText);
			resultDivElement.appendChild(unOrderedList);
			return resultDivElement;
		}
		return null;
	}

}