export default class Color {
	isGradient: boolean;

	solidColor: string;

	gradientColor1: string;
	gradientColor2: string;
	gradientAngle: number;

	constructor(color: Partial<Color> | string) {
		if (typeof color === 'string') {
			this.solidColor = color;
			return;
		}
		Object.assign(this, color);
	}
}