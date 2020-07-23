### Error Page Custom Component

##### Description
this is a custom component that displays an error page based on an error **key**

##### Usage
this component can be used as blow
```
	<esignatur-error-page apiurl="https://localhost:5001/" key="NoAccessOwner" language="en"
		tokens='{ "REFERENCENR": "875467", "VIRKSOMHED": "Omar" }'>
	</esignatur-error-page>
```
- **apiurl**: represents the url of the error pages service [here](https://github.com/RovsingApplications/Fejlsider)
- **key**: the key of the error
- **language**: options are ["en", "da", "nb", "sv", "fi"]
- **tokens**: place holder values (only for errors that have those)