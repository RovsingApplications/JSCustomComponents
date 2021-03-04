export default class DateTimeUtility {
	static format(input: string | Date): string {
		const dateTime = new Date(input);
		const day = ('0' + dateTime.getDate()).slice(-2);
		const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
		const year = ('' + dateTime.getFullYear()).slice(-2);
		const hours = ('0' + dateTime.getHours()).slice(-2);
		const minutes = ('0' + dateTime.getMinutes()).slice(-2);
		const seconds = ('0' + dateTime.getSeconds()).slice(-2);
		const dateTimeFormatted = `${day}-${month}-${year} - ${hours}:${minutes}:${seconds}`;
		return dateTimeFormatted;
	}
}


