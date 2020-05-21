import DanishDictionary from "./Languages/DanishDictionary";
import EnglishDictionary from "./Languages/EnglishDictionary";

export default class Translator {
	private static langauges = [
		'en',
		'da'
	];
	private static danishDictionary = new DanishDictionary();
	private static englishDictionary = new EnglishDictionary();

	static Translate(key: string, language = 'da'): string {
		language = language.toLowerCase();
		const isSupportedLanguage = Translator.langauges.indexOf(language) != -1;
		if (!isSupportedLanguage) {
			language = 'da'
		}
		switch (language) {
			case 'da':
				return this.danishDictionary.get(key);
				break;
			case 'en':
				return this.danishDictionary.get(key);
				break;
		}
	}
}