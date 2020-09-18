export default class ConversionUtility {
	static base64ToArrayBuffer(base64: string) {
		const binaryString = window.atob(base64);
		const binaryLen = binaryString.length;
		const bytes = new Uint8Array(binaryLen);
		for (let i = 0; i < binaryLen; i++) {
			let ascii = binaryString.charCodeAt(i);
			bytes[i] = ascii;
		}
		return bytes;
	}
}