
export default class MakeRequest {

	private xmlHttpRequest: XMLHttpRequest;
	method: string;
	url: string;
	headers: any;

	constructor(url: string, method: string = "get", headers: any = {}) {
		this.method = method;
		this.url = url;
		this.headers = headers;
	}

	private setHeaders(httpRequest: XMLHttpRequest) {
		for (const header in this.headers) {
			httpRequest.setRequestHeader(header, this.headers[header]);
		}
	}

	send(data: any = null) {
		return new Promise((resolve, reject) => {
			this.xmlHttpRequest = new XMLHttpRequest();
			this.xmlHttpRequest.open(this.method, this.url);
			this.setHeaders(this.xmlHttpRequest);
			this.xmlHttpRequest.onload = () => {
				if (this.xmlHttpRequest.status >= 200 && this.xmlHttpRequest.status < 300) {
					resolve(this.xmlHttpRequest.response);
				} else {
					reject({
						status: this.xmlHttpRequest.status,
						statusText: this.xmlHttpRequest.statusText,
						body: this.xmlHttpRequest.response,
					});
				}
			};
			this.xmlHttpRequest.onerror = () => {
				reject({
					status: this.xmlHttpRequest.status,
					statusText: this.xmlHttpRequest.statusText,
					body: this.xmlHttpRequest.response,
				});
			};
			this.xmlHttpRequest.send(data);
		});
	}

	getResponseHeader(headerName: string) {
		if (!this.xmlHttpRequest) {
			return null;
		}
		const headerValue = this.xmlHttpRequest.getResponseHeader(headerName);
		return headerValue;
	}
}