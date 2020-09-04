export default class DomUtility {

	// https://stackoverflow.com/questions/1230445/javascript-regex-how-to-bold-specific-words-with-regex
	static boldenText(inputText: string, matchindTextToBolden: string) {
		return inputText.replace(new RegExp('(^|)(' + matchindTextToBolden + ')(|$)', 'ig'), '$1<b>$2</b>$3');
	}
}