class elementConfig {
    selector: string;
    template: string;
    style: string;
    useShadow: boolean;
    templatePath?: string;
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
        let connectedCallback =
            cls.prototype.connectedCallback || function() {};
        cls.prototype.connectedCallback = function() {
            let clone = document.importNode(templateElement.content, true);
            if (config.useShadow) {
                this.attachShadow({ mode: 'open' }).appendChild(clone);
            } else {
                this.appendChild(clone);
            }
            connectedCallback.call(this);
        };
        window.customElements.define(config.selector, cls);
    };
};

export default CustomElement;
