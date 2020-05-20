export default class UrlUtil {
	constructor() {
	}

	queryValue: Function = (field: string, url?: string): string => {
		var href: string = url ? url : window.location.href;
		var reg: RegExp = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
		var string: string[] = reg.exec(href);
		return string ? string[1].toLowerCase() : null;
	};

	currentURL: Function = (): string => window.location.href;

	getURLParameters: Function = (url: string): any =>
		(url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) =>
			((a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a), {});

	redirect: Function = (url, asLink = true): void => asLink ? (window.location.href = url) : window.location.replace(
		url);

	baseUrl: Function = (): string => window.location.origin;

	host: Function = (): string => window.location.host;

	pathArray: Function = (): string[] => window.location.pathname.split('/');
}
