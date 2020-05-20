export class ScriptLoader {
	public callback: Function;
	public script: string;

	constructor(script: string, callback: Function) {
		this.script = script;
		this.callback = callback;
	}

	public load() {
		// Adding t<he script tag to the head as suggested before
		const head = document.head;
		const script = document.createElement("script") as HTMLScriptElement;
		script.type = "text/javascript";
        script.src = this.script;
        
		// Then bind the event to the callback function.
		// There are several events for cross browser compatibility.
        script.onloadend = this.callback();
        
		// Fire the loading
		head.appendChild(script);
	}
}
