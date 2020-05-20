import { CustomForm, elements } from './../src/index';

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        let form = new CustomForm(document.forms[0]);
        form.onsubmit = promise => {
            promise.then(response => {});
        };
    }
};
