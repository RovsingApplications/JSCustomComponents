const debounce = (fn, ms = 0, immediate = false) => {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			if (!immediate) { fn.apply(this, args) }
		}, ms)
		if (immediate && !timeout) { fn.apply(this, [...args]) }
	};
};

const throttle = (func, ms) => {
	let lastFunc;
	let lastRan;
	return function() {
		const context = this;
		const args = arguments;
		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc)
			lastFunc = setTimeout(function() {
				if ((Date.now() - lastRan) >= ms) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, ms - (Date.now() - lastRan));
		}
	};
};

export {
	debounce,
	throttle,
};
