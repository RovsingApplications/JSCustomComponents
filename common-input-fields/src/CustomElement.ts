import CustomElementConfig from "./models/CustomElementConfig";

const validateSelector = (selector: string) => {
    if (selector.indexOf('-') <= 0) {
        throw new Error('You need at least 1 dash in the custom element name!');
    }
};

const CustomElement = (config: CustomElementConfig) => (customElementClass) => {
    validateSelector(config.selector);
    if (!config.template) {
        throw new Error('You need to pass a template for the element');
    }
    const template = document.createElement('template');
    if (config.style) {
        config.template = `<style>${config.style}</style> ${config.template}`;
    }
    template.innerHTML = config.template;

    const connectedCallback = customElementClass.prototype.connectedCallback || function () { };
    customElementClass.prototype.connectedCallback = function () {
        const clone = document.importNode(template.content, true);
        if (config.useShadow) {
            this.attachShadow({ mode: 'open' }).appendChild(clone);
        } else {
            this.appendChild(clone);
        }
        connectedCallback.call(this);
    };

    window.customElements.define(config.selector, customElementClass);
};

export default CustomElement;