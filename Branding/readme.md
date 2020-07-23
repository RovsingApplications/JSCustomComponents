## Branding Custom Web Element
> this custom component consumes the [Branding Service](#)

This custom component consists of:
- **form**: a custom component to edit the branding model
- **preview** a custom component to see the reflected changes (till now only the sign preview is working)


Each input element of the form is a cutom component in of it's own e.g. **color picker** element, **FileInput** element.


### **Implementation**
The form implementation is not actually a form in its conventional way, but rather some elements that each of them has a **change event**, and when any element's change event is fired, the form's own change event gets fired, and hence the preview gets updated. 

And hence this is important to know that in case of adding a new element to the form, the form should subscribe to that new input change event, and fire the form's own change event accordingly, and update the branding model etc.


In the Branding model, we can set the default values of a branding, e.g. in case the customer(apiKey) has not created a branding before, then a new one is created in the client side with these default values.

### **Usage**
It's simply used as below after adding the bundle (in lib directory) to the src of script tag
```
	<esignatur-branding api-key="<api-key>" api-url="<api-url>/"></esignatur-branding>
```
checkout the example inside demo/index.html as well, to see how it's used in this demo


### **Running the demo**
run ```gulp``` in the project directory


### **Browser Compatibility**
The component has been tested on chrome, firefox, edge, and IE11.

