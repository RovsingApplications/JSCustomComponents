import DanishDictionary from "./Languages/DanishDictionary";
import EnglishDictionary from "./Languages/EnglishDictionary";
import Constants from "../../../Framework/Constants/Constants";

export default class Translator {
	private static langauges = [
		'en',
		'da'
	];
	private static danishDictionary = new DanishDictionary();
	private static englishDictionary = new EnglishDictionary();

	static translate(key: string, language = Constants.language): string {
		language = language.toLowerCase();
		const isSupportedLanguage = Translator.langauges.indexOf(language) != -1;
		if (!isSupportedLanguage) {
			language = 'da'
		}
		switch (language) {
			case 'da':
				return this.danishDictionary.get(key);
			case 'en':
				return this.englishDictionary.get(key);
		}
	}
}