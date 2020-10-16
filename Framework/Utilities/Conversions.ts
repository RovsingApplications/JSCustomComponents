import Color from "../Models/Color";
import { AlignmentPositionEnum } from "../Models/AlignmentPositionEnum";

export default class Conversions {
	static colorToStyle(color: Color) {
		if (!color) {
			return 'transparent';
		}
		if (!color.isGradient) {
			return Conversions.nullColorToTransparent(color.solidColor);
		}
		const gradient = `linear-gradient(${color.gradientAngle}deg, ${color.gradientColor1}, ${color.gradientColor2})`;
		return gradient;
	}
	static nullColorToTransparent(color: string) {
		if (!color || color.trim() === '') {
			return 'transparent';
		}
		return color;
	}

	static alignmentEnumToStyle(alignmentEnum: AlignmentPositionEnum) {
		switch (alignmentEnum) {
			case AlignmentPositionEnum.right:
				return 'right';
			case AlignmentPositionEnum.center:
				return 'center';
			default:
				return 'left';
		}
	}
}
