import DanishDictionary from "./Languages/DanishDictionary";
import EnglishDictionary from "./Languages/EnglishDictionary";
import Globals from "../Globals/Globals";

export default class Translator {
	private static langauges = [
		'en',
		'da'
	];
	private static danishDictionary = new DanishDictionary();
	private static englishDictionary = new EnglishDictionary();

	static translate(key: string, language = Globals.language): string {
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