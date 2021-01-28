export default class ColorsUtility {
	
	// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	static hexToRGB (hexColor: string) : {r: number, g: number, b: number} {

		if (!hexColor || !hexColor.length || hexColor.length < 3 || hexColor.length > 7) {
			return null;
		}

		const sixDigitsHexRegex = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/;
		const threeDigitsHexRegex = /^#?([a-fA-F\d]{1})([a-fA-F\d]{1})([a-fA-F\d]{1})$/;

		const regex = hexColor.length > 4 ? sixDigitsHexRegex : threeDigitsHexRegex;

		const regexMatchResult = regex.exec(hexColor);
		if (!regexMatchResult) {
			return null;
		}

		return {
			r: parseInt(regexMatchResult[1], 16),
			g: parseInt(regexMatchResult[2], 16),
			b: parseInt(regexMatchResult[3], 16)
		};
	}

	// https://ux.stackexchange.com/questions/82056/how-to-measure-the-contrast-between-any-given-color-and-white/82068#82068
	static getRelativeLuminance (hexColor: string) : number {
		if (hexColor && hexColor.toLowerCase() === 'transparent') {
			return 1;
		}

		const rgb = ColorsUtility.hexToRGB(hexColor);

		if (rgb == null) {
			return null;
		}

		const red = ColorsUtility.getColorRelativeValue(rgb.r);
		const green = ColorsUtility.getColorRelativeValue(rgb.g);
		const blue = ColorsUtility.getColorRelativeValue(rgb.b);

		var relativeLuminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

		return relativeLuminance;
	}

	static getContrastRatio(hexColor1: string, hexColor2: string) {
		const relativeLuminance1 = ColorsUtility.getRelativeLuminance(hexColor1);
		const relativeLuminance2 = ColorsUtility.getRelativeLuminance(hexColor2);

		if (relativeLuminance1 > relativeLuminance2) {
			return (relativeLuminance1 + 0.05) / (relativeLuminance2 + 0.05)
		}
		
		return (relativeLuminance2 + 0.05) / (relativeLuminance1 + 0.05)
	}

	private static getColorRelativeValue(colorEightBits: number) : number {
		if (colorEightBits < 0 || colorEightBits > 255) {
			return null;
		}

		if (colorEightBits <= 10) {
			return colorEightBits / 3294;
		}

		return Math.pow((colorEightBits/269 + 0.0513), 2.4);
	}
}