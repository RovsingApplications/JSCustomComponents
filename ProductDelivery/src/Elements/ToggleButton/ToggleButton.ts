
import CustomHTMLBaseElement from "../CustomHTMLBaseElement";

class switchLab extends CustomHTMLBaseElement {
	constructor () {
	  super();
	}
	get round() {
	  return this.hasAttribute('round');
	}
	get bgcolor() {
	  return this.hasAttribute('bgcolor');
	}
	get label() {
	  return this.hasAttribute('label');
	}
	get size() {
	  return this.hasAttribute('size');
	}
	get leftposition() {
	  return this.hasAttribute('leftposition');
	}
	get value() {
	  return this.hasAttribute('value');
	}
	get checked() {
	  return this.hasAttribute('checked');
	}
	el(){
	  var el = this.shadowRoot.querySelector('#switchCmp').children[0];
	  return el;
	}
	connectedCallback () {
	  let shadowRoot = this.attachShadow({mode: 'open'});
	  shadowRoot.innerHTML = `
		<style>
		  .switch {
			position: relative;
			display: inline-block;
			width: 55px;
			 height: 28px;
		  }
		  .switch_large {
			position: relative;
			display: inline-block;
			width: 60px;
			height: 34px;
		  }
		  .switch_small {
			 position: relative;
			display: inline-block;
			width: 41px;
			height: 23px;
		  }
		  .switch input {
			opacity: 0;
			width: 0;
			height: 0;
		  }
		  .slider {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #ccc;
			-webkit-transition: .4s;
			transition: .4s;
		  }
		  .slider_large {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #ccc;
			-webkit-transition: .4s;
			transition: .4s;
		  }
		  .slider:before {
			position: absolute;
			content: "";
			height: 22px;
			width: 22px;
			left: 4px;
			bottom: 3px;
			background-color: white;
			-webkit-transition: .4s;
			transition: .4s;
		  }
		  .slider_large:before {
			position: absolute;
			content: "";
			height: 26px;
			width: 26px;
			left: 4px;
			bottom: 4px;
			background-color: white;
			-webkit-transition: .4s;
			transition: .4s;
		  }
		  .slider_small:before {
			position: absolute;
			content: "";
			height: 17px;
			width: 17px;
			left: 3px;
			bottom: 3px;
			background-color: white;
			-webkit-transition: .4s;
			transition: .4s;
		  }
		  input:checked + .slider {
			background-color: #2196F3;
		  }
		  input:focus + .slider {
			box-shadow: 0 0 1px #2196F3;
		  }
		  input:checked + .slider_small {
			background-color: #2196F3;
		  }
		  input:focus + .slider_small {
			box-shadow: 0 0 1px #2196F3;
		  }
		  input:checked + .slider:before {
			-webkit-transform: translateX(26px);
			-ms-transform: translateX(26px);
			transform: translateX(26px);
		  }
		  input:checked + .slider_small:before {
			-webkit-transform: translateX(19px);
			-ms-transform: translateX(19px);
			transform: translateX(19px);
		  }
		  /* Rounded sliders */
			.slider.round {
			border-radius: 34px;
		  }
		  .slider.round:before {
			border-radius: 50%;
		  }
		  #label{
			top: 3px;
			position: relative;
			left: 4px;
			color: #5c5858;
		  }
		  .labelLarge{
			top: 5px!important;
		  }
		  .labelSmall{
			top: 0px!important;
		  }
		</style>
		<label id='switchCmp' class="switch">
		  <input type="checkbox">
		  <span id='switch' class="slider"></span>
		</label>
		<span id='label'></span>`;
  
	  if(this.round)
		shadowRoot.querySelector('#switch').classList.add("round");
  
	  if(this.label)
		shadowRoot.querySelector('#label').innerHTML = this.getAttribute('label');
  
	  if(this.leftposition)
		shadowRoot.querySelector('#label').classList.add("leftPosition");
  
	  if(this.size){
		if(this.getAttribute('size') == 'large'){
		  shadowRoot.querySelector('#switchCmp').classList.add("switch_large");
		  shadowRoot.querySelector('#switch').classList.add("slider_large");
		  if(this.leftposition)
			shadowRoot.querySelector('#label').classList.add("leftPositionLarge");
		  else
			shadowRoot.querySelector('#label').classList.add("labelLarge");
		}
		if(this.getAttribute('size') == 'small'){
		  shadowRoot.querySelector('#switchCmp').classList.add("switch_small");
		  shadowRoot.querySelector('#switch').classList.add("slider_small");
		  if(this.leftposition)
			shadowRoot.querySelector('#label').classList.add("leftPositionSmall");
		  else
			shadowRoot.querySelector('#label').classList.add("labelSmall");
		}
	  }
	}
  }
  window.customElements.define('switch-lab', switchLab);