import Color from "./Color";
import { AlignmentPositionEnum } from "./AlignmentPositionEnum";

export default class Branding {
	primaryColor: string;
	secondaryColor: string;
	textColor: string;
	backgroundColor: Color;
	logoDataUrl: string;
	logoAlignment: AlignmentPositionEnum;
	logoScale: number;

	constructor(branding?: Partial<Branding>) {
		if (branding) {
			Object.assign(this, branding);
			return;
		}
		this.setToDefault();
	}

	setToDefault() {
		this.primaryColor = '#325d77';
		this.secondaryColor = '#D3D3D3';
		this.textColor = '#333333';
		this.backgroundColor = new Color({
			isGradient: false,
			solidColor: '#B6B8BA'
		});
		this.logoAlignment = AlignmentPositionEnum.left;
		this.logoScale = 1;
	}
}
