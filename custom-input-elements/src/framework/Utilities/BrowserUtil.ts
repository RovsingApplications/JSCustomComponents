export default class BrowserUtil {

	constructor() {
	}

	supportWebp() {
		var canvas: any = typeof document === 'object' ? document.createElement('canvas') : {};
		canvas.width = canvas.height = 1;
		var index = canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5 : false;

		return index;
	}
}
