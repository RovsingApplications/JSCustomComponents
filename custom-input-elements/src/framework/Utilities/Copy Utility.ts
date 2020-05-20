export class CopyUtility {
	public static deepCopy(destination: any, source: any): void {
		for (const key in source) {
			if (destination.hasOwnProperty(key)) {
				if (destination[key] instanceof Object) {
					this.deepCopy(destination[key], source[key]);
				} else {
					destination[key] = source[key];
				}
			} else {
				destination[key] = source[key];
			}
		}
	}
}
