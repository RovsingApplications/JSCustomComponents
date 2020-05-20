export default class Constants {
	public static commonStyling: string = `
	:host {	
		position: relative;
		float: left;
		property-events: none;
        width: 100%; 
	}
	.custom-element {
		position: relative;
	}
	.custom-element label {
		position: absolute;
		left: 15px;
        top: 27px;
		transition: all .4s ease;
		color: #aaa;
		pointer-events: none;
		max-width: calc(100% - 20px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.custom-element p.description {
		font-size: .8rem;
		margin: 3px;
	}
	.custom-element h2,p,span,li,label {
		font-family: Railway, Lato, Arial, sans-serif;
	}
	`
	public static stylingInput: string = `
	${Constants.commonStyling}
	.custom-element input, .custom-element ul {
		width: 100%; }
	.custom-element input {
		width: calc(100% - 2px);
		margin-top:15px;
		height: 34px;
		text-indent: 12px;
		font-size: 14px;
		line-height: 1.4;
		border: 1px solid #ccc;
		border-radius: 4px;
		outline-color: #ccc;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }
	.custom-element label.input-top {
		top: -3px;
		left: 0px;
		color: #333;
	}
	.custom-element .error input {
		box-shadow: 1px 1px 4px rgba(205, 92, 92, 0.5)!important;
		border: 2px solid rgba(205, 92, 92, 0.8)!important;
	}
	.custom-element .error input {
		box-shadow: 1px 1px 4px rgba(205, 92, 92, 0.5)!important;
		border: 2px solid rgba(205, 92, 92, 0.8)!important;
	}
	.custom-element span.error{
		color: indianred;
		font-size: .9rem;
		padding-left: 6px;
	}
`
}