export default class DownloadUtility {
	static saveByteArray(fileName: string, byte: BlobPart) {
		const blob = new Blob([byte], { type: "application/pdf" });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = fileName;
		link.click();
	};
}