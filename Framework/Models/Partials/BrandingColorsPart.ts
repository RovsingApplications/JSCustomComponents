import Color from "../Color";

export default class BrandingColorsPart {
	primaryColor: string;
	secondaryColor: string;
	textColor: string;
	backgroundColor: Color;

	constructor(brandingColorsPart: Partial<BrandingColorsPart>) {
		Object.assign(this, brandingColorsPart);
	}
}
