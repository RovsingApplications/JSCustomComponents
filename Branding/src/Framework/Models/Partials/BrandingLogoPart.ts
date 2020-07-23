import { AlignmentPositionEnum } from "../AlignmentPositionEnum";

export default class BrandingLogoPart {
	logoDataUrl: string;
	logoAlignment: AlignmentPositionEnum;
	logoScale: number;

	constructor(brandingLogoPart: Partial<BrandingLogoPart>) {
		Object.assign(this, brandingLogoPart);
	}
}
