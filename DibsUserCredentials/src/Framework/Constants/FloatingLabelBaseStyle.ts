import Constants from "./Constants";

export default class FloatingLabelBaseStyle {
	public static readonly style = `
	#item-group {
		position: relative;
		font-family: sans-serif;
	}
	#inner-element {
		z-index: 1;
		width: 100%;
		height: 37px;
		font-size: 14px;
		border: 1px solid #d8d8d8;
		border-radius: 5px;
		background-color: transparent;
		color: rgba(51, 51, 51, 0.75);
		box-sizing: border-box;
		padding: 5px 10px;
		transition: all .1s ease-out;
	}
	::-ms-clear {
		display: none;
	}

	#inner-label {
		position: absolute;
		top: 2px;
		left: 10px;
		font-size: 14px;
		color: #d2c7bf;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: fit-content;
		transition: all .2s ease-out;
	}

	#inner-element:focus {
		border: 1px solid #315c78;
		outline: none;
	}
	#inner-element:invalid {
			box-shadow: none;
	}

	#inner-element:focus + #inner-label ,
	#inner-element.has-value + #inner-label {
		top: -14px;
		left: 15px;
		padding: 0 2px;
		color: #315c78;
		font-size: 12px;
		background-color: white;
	}
	#inner-element.has-value:not(:focus) + #inner-label{
		color: #315c78;
	}
	#inner-element.invalid {
		border: 2px solid #cd5c5c;
	}
	#postfix-icon {
		position: absolute;
		top: 0;
		max-width: 15px;
		max-height: 15px;
		right: 20px;
	}
	#error-message {
		display: none;
		transition: all .1s ease-out;
	}
	#inner-element.invalid ~ #error-message {
		display: block;
		color: #d57878;
		font-size: 12px;
		padding-left: 5px;
	}
	#inner-element.nudge {
		animation: nudge .2s linear;
	}
	@keyframes nudge {
		0% {
			transform: rotate(-1deg);
		} 
		20% {
			transform: rotate(1deg);
		}
		40% {
			transform: rotate(-1deg);
		}
		60% {
			transform: rotate(1deg);
		}
		80% {
			transform: rotate(-1deg);
		}
	}
	@media only screen and (max-width: ${Constants.mobileSize}) {
		#inner-element,
		#inner-label {
			font-size: 12px;
		}
		#inner-element.invalid ~ #error-message,
		#inner-element:focus + #inner-label ,
		#inner-element.has-value + #inner-label {
			font-size: 10px;
		}
	}
`;
}