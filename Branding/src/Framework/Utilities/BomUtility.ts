export class BomUtility {
	public static isInternetExplorer(): boolean {
		return navigator.appVersion.toString().indexOf('.NET') > 0;
	}
}
