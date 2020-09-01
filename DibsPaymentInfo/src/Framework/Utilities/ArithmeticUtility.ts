export default class ArithmeticUtility {
	static formatDecimal(numberMultipliedBy100: number): string {
		const formatted = (numberMultipliedBy100 / 100).toFixed(2);
		return formatted;
	}
}