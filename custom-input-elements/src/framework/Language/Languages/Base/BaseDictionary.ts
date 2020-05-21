export default abstract class BaseDictionary {
	abstract dictionary: any;

	get(key: string): string {
		const keyParts = key.split('.');
		var result: string | any = this.dictionary;
		keyParts.forEach(keyPart => {
			result = result[keyPart];
			if (!result) {
				result = key;
				return;
			}
		});
		return result;
	}
}