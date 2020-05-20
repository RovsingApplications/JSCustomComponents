import ArrayUtil from './ArrayUtil';
import DomUtil from './DomUtil';

export default class ChangeLanguage {
    languageForm: HTMLFormElement;
    languages: HTMLLIElement[];

    constructor() {
        this.languageForm = document.getElementById(
            'selectLanguage',
        ) as HTMLFormElement;
        this.languages = ArrayUtil.FromNodeList<HTMLLIElement>(
            this.languageForm.querySelectorAll('li'),
        );
    }

    execute() {
        this.languages.forEach(language => {
            if (language.classList.contains('active')) return;
            language.addEventListener('click', this.setLanguage.bind(this));
        });
    }

    setLanguage(event: Event) {
        const languageUtil = new DomUtil(event.currentTarget as HTMLElement);
        let actionUrl = this.languageForm.action;
        if (actionUrl.indexOf('?') < 0) {
            actionUrl += `?culture=${languageUtil.getDataAttr('lang')}`;
        } else {
            actionUrl += `&culture=${languageUtil.getDataAttr('lang')}`;
        }
        this.languageForm.action = actionUrl;
        this.languageForm.submit();
    }
}
