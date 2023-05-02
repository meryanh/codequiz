document.addEventListener('DOMContentLoaded', () => {
	/**
	 * @template T
	 * @callback ReplacerFunction<T>
	 * @param {Function} passthrough
	 * @param {T} target
	 * @param {any[]} args
	 */

	/**
	 * @template T
	 * @param {T} target
	 * @param {{[x: string]: ReplacerFunction<T>}} replacer
	 */
	function replace(target, replacer) {
		Object.keys(replacer).forEach(key => {
			/** @type {Function} */
			let passthrough = target[key];
			target[key] = function (...args) { return replacer[key](passthrough.bind(this, ...args), this, args); }
			Object.defineProperty(target[key], 'name', { value: passthrough.name, writable: false });
		});
	}

	replace(console, {
		log: (passthrough, target, args) => {
			top['log']('log', window, args);
			return passthrough();
		},
		warn: (passthrough, target, args) => {
			top['log']('warn', window, args);
			return passthrough();
		},
		error: (passthrough, target, args) => {
			top['log']('error', window, args);
			return passthrough();
		},
	});

	window.addEventListener('error', (evt)=> {
		console.error(evt.error);
	});
});