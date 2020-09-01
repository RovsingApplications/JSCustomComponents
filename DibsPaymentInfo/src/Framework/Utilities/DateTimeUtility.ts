export default class DateTimeUtility {
	static format(input: string | Date): string {
		const options = {
			hour: 'numeric', minute: 'numeric', second: 'numeric',
			year: 'numeric', month: '2-digit', day: '2-digit',
			timeZoneName: 'short'
		};
		var date = new Date(input);
		var result = new Intl.DateTimeFormat('en-AU', options).format(date);
		return result;
	}
}


