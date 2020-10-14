# Custom web element template
This is a template to make custom web elements using vanilla typescript.

## Main Parts

### 1. CustomElement Decorator
Found under "src\Framework\custom-element.decorator.ts"
It defines component's lifecycle events:

- componentWillMount
- componentDidMount (most common used one to initialize a component)
- componentWillUnmount
- componentDidUnmount

It also provide a way to easily define a component selector, template, style, and if it uses shadow dom, as in Custom Elements examples.

### 2. CustomHTMLBaseElement
Found in "src\Elements\CustomHTMLBaseElement.ts", It's a base class for custom elements that provides common functionality

### 3. Custom Elements
As in "src\Elements\Input\CustomInputElement.ts" and "src\MyCustomWebElement.ts".

A custom Elements is decorated with the **CustomElement decorator**, and extends the **CustomHTMLBaseElement**.

To define attributes for the component, use "**observedAttributes**" method to set their names, and "**attributeChangedCallback**" to define the behavior with respect to their values.

In "CustomInputElement", there is an example of dispatching an event "change" from the component.

Also component initialization is done in the "componentDidMount" lifecycle function, and notice how it loops on the components attributes and calls "attributeChanged" function, that's because the "attributeChangedCallback" is called before "componentDidMount".

### 4. gulpfile
"gulpfile.js" compiles/transpiles "src\index.ts" (in which all of the components should be exported) into "lib" directory, as well as "demo\index.ts" and starts a server for "demo\index.html".


> Inside "src\Framework\**", there are some useful utilities e.g. **Translator**, to support multiple languages, and **ElementsCreator** to create spinner, overlay, etc.

## Starting a demo
Make sure all dependencies are installed (run `npm install`)

To start a demo just run `gulp`
