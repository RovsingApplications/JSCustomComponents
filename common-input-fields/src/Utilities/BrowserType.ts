export default class BrowserType {
	public readonly userAgentString: string;
	public readonly platformName: string;
	public readonly browserName: string;
	public readonly fullVersion: number;
	public readonly majorVersion: number;
	private readonly nVer: string;
	private readonly nAgt: string;
	private nameOffset: number | string;
	private verOffset: number;
	private ix: string;

	constructor() {
		this.nVer = navigator.appVersion;
		this.nAgt = navigator.userAgent;
		this.browserName = navigator.appName;
		this.fullVersion = parseFloat(navigator.appVersion);
		this.majorVersion = parseInt(navigator.appVersion, 10);

		this.platformName = "Unknown OS";
		if (navigator.userAgent.indexOf("Win") !== -1) { this.platformName = "Windows"; }
		if (navigator.userAgent.indexOf("Mac") !== -1) { this.platformName = "Macintosh"; }
		if (navigator.userAgent.indexOf("Linux") !== -1) { this.platformName = "Linux"; }
		if (navigator.userAgent.indexOf("Android") !== -1) { this.platformName = "Android"; }
		if (navigator.userAgent.indexOf("like Mac") !== -1) { this.platformName = "iOS"; }

		this.userAgentString = navigator.userAgent;

		// In Opera, the true version is after "Opera" or after "Version"
		if ((this.verOffset = this.nAgt.indexOf("Opera")) != -1) {
			this.browserName = "Opera";
			this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 6));
			if ((this.verOffset = this.nAgt.indexOf("Version")) != -1)
				this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 8));
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((this.verOffset = this.nAgt.indexOf("MSIE")) != -1) {
			this.browserName = "Microsoft Internet Explorer";
			this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 5));
		} else if ((this.verOffset = this.nAgt.indexOf("Edge")) != -1) {
			this.browserName = "Edge";
			this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 5));
		}
		// In Chrome, the true version is after "Chrome"
		else if ((this.verOffset = this.nAgt.indexOf("Chrome")) != -1) {
			this.browserName = "Chrome";
			this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 7));
		}
		// In Safari, the true version is after "Safari" or after "Version"
		else if ((this.verOffset = this.nAgt.indexOf("Safari")) != -1) {
			this.browserName = "Safari";
			this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 7));
			if ((this.verOffset = this.nAgt.indexOf("Version")) != -1)
				this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 8));
		}
		// In Firefox, the true version is after "Firefox"
		else if ((this.verOffset = this.nAgt.indexOf("Firefox")) != -1) {
			this.browserName = "Firefox";
			this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 8));
		}
		// In most other browsers, "name/version" is at the end of userAgent
		else if (
			(this.nameOffset = this.nAgt.lastIndexOf(" ") + 1) <
			(this.verOffset = this.nAgt.lastIndexOf("/"))
		) {
			this.browserName = this.nAgt.substring(this.nameOffset, this.verOffset);
			this.fullVersion = parseFloat(this.nAgt.substring(this.verOffset + 1));
			if (this.browserName.toLowerCase() == this.browserName.toUpperCase()) {
				this.browserName = navigator.appName;
			}
		}
		// trim the fullVersion string at semicolon/space if present
		/*
			if ((this.ix = this.fullVersion.indexOf(";")) != -1)
			this.fullVersion = this.fullVersion.substring(0, ix);
			if ((this.ix = this.fullVersion.indexOf(" ")) != -1)
			this.fullVersion = this.fullVersion.substring(0, ix);
		*/

		this.majorVersion = parseInt("" + this.fullVersion, 10);
		if (isNaN(this.majorVersion)) {
			this.fullVersion = parseFloat(navigator.appVersion);
			this.majorVersion = parseInt(navigator.appVersion, 10);
		}
	}

	public isChrome(): boolean {
		return this.browserName === "Chrome";
	}

	public isFirefox(): boolean {
		return this.browserName === "Firefox";
	}

	public isEdge(): boolean {
		return this.browserName === "Edge";
	}

	public isOpera(): boolean {
		return this.browserName === "Opera";
	}

	public isIE(): boolean {
		return this.browserName === "Microsoft Internet Explorer" || this.browserName === "Netscape";
	}

	public isSafari(): boolean {
		return this.browserName === "Safari";
	}

	public iPhone(): boolean {
		const iDevices = ["iPhone Simulator", "iPod Simulator", "iPhone", "iPod"];

		if (navigator.platform) {
			while (iDevices.length) {
				if (navigator.platform === iDevices.pop()) {
					return true;
				}
			}
		}

		return false;
	}

	public isMobile(): boolean {
		return /Mobi/i.test(navigator.userAgent);
	}

	public iOSversion(): string {
		if (!this.isMobile() && !this.iPhone()) {
			return null;
		}
		return this.majorVersion + "";
	}

	public hasPlugin(name: string): boolean {
		name = name.toLowerCase();
		const plugins = window.navigator.plugins;
		for (let i = 0; i < plugins.length; i++) {
			if (plugins[i][name]) return true;
		}
		return false;
	}

	public isIframe(): boolean {
		return document.querySelector("body").classList.contains("iframe");
	}

	public is_touch_device(): boolean {
		const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
		const mq = (query) => {
			return window.matchMedia(query).matches;
		};

		if ("ontouchstart" in window) {
			return true;
		}

		const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
		return mq(query);
	}

	public useNativePdfViewer(): boolean {
		if (this.isIframe() || this.isMobile()) {
			return false;
		}
		return this.hasPlugin("application/pdf");
	}
}
