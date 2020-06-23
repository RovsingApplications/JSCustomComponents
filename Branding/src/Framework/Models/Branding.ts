import Color from "./Color";
import { AlignmentPositionEnum } from "./AlignmentPositionEnum";

export default class Branding {
	primaryColor: string;
	secondaryColor: string;
	textColor: string;
	backgroundColor: Color;
	logoBase64: string;
	logoAlignment: AlignmentPositionEnum;
	logoScale: number;

	constructor(branding: Partial<Branding>) {
		Object.assign(this, branding);
	}
}
