export default class DateUtil {

	static format(date: Date): string {
		const ukFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		return ukFormat.format(date);
	}
}