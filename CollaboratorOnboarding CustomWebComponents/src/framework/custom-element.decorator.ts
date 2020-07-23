// https://medium.com/@gilfink/creating-a-custom-element-decorator-using-typescript-302e7ed3a3d1

class elementConfig {
	selector: string;
	template: string;
	style: string;
	useShadow: boolean;
}

const validateSelector = (selector: string) => {
	if (selector.indexOf('-') <= 0) {
		throw new Error('You need at least 1 dash in the custom element name!');
	}
};

const CustomElement = (config: elementConfig) => {
	return (cls: any) => {
		validateSelector(config.selector);
		let templateElement = document.createElement('template');
		if (!config.template) {
			throw new Error('You need to pass a template for the element');
		}
		templateElement.innerHTML = `<style>${config.style}</style> ${
			config.template
			}`;
		const connectedCallback = cls.prototype.connectedCallback || function () { };
		const disconnectedCallback = cls.prototype.disconnectedCallback || function () { };
		cls.prototype.connectedCallback = function () {
			let clone = document.importNode(templateElement.content, true);
			if (config.useShadow && !this.shadowRoot) {
				this.attachShadow({ mode: 'open' }).appendChild(clone);
			} else {
				this.appendChild(clone);
			}
			if (this.componentWillMount) {
				this.componentWillMount();
			}
			connectedCallback.call(this);
			if (this.componentDidMount) {
				this.componentDidMount();
			}
		};
		cls.prototype.disconnectedCallback = function () {
			if (this.componentWillUnmount) {
				this.componentWillUnmount();
			}
			disconnectedCallback.call(this);
			if (this.componentDidUnmount) {
				this.componentDidUnmount();
			}
		};
		window.customElements.define(config.selector, cls);
	};
};

export default CustomElement;
