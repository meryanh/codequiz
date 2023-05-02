/**@type {string}*/ let qPath;
/**@type {HTMLTextAreaElement}*/ let editorHtml;
/**@type {HTMLTextAreaElement}*/ let editorJs;
/**@type {HTMLIFrameElement}*/ let resultFrame;
/**@type {HTMLDivElement}*/ let resultLog;

function sendCode() {
	resultFrame.contentDocument.getElementById('target').innerHTML = editorHtml.value;
	resultFrame.contentWindow['index'](editorJs.value);
}

function run() {
	resultLog.innerHTML = '';
	resultFrame.src = `${qPath}/index.html`;
}

function htmlEncode(value) {
	const textArea = document.createElement("div");
	textArea.innerText = value;
	return textArea.innerHTML;
}

function next() {
	window.location.hash = parseInt(window.location.hash.substring(1))+1;
}

function previous() {
	window.location.hash = parseInt(window.location.hash.substring(1))-1;
}

/**
 * @param {string} type
 * @param {Window} wnd
 * @param {any[]} value
 */
function log(type, wnd, value) {
	/**@type {string}*/
	let cssClass = null;

	switch (type) {
		case 'log':
			cssClass = 'text-log';
			break;
		case 'warn':
			cssClass = 'text-warn';
			break;
		case 'error':
			cssClass = 'text-error';
			break;
	}

	if (value[0] instanceof wnd.Error) {
		resultLog.innerHTML += `<div class="${cssClass}">${htmlEncode(value[0].name)}: ${htmlEncode(value[0].message)}</div>`;
	} else {
		resultLog.innerHTML += `<div class="${cssClass}">${htmlEncode(value.join(','))}</div>`;
	}
}

async function getCode() {
	editorHtml.value = await (await fetch(`${qPath}/problem.html`)).text();
	editorJs.value = await (await fetch(`${qPath}/problem.js`)).text();
}

function getQPath() {
	if (!window.location.hash) { window.location.hash = 1; }
	qPath = `${window.location.origin}${window.location.pathname}${window.location.hash.substring(1)}`;
}

document.addEventListener('DOMContentLoaded', async () => {
	editorHtml = document.querySelector('#text-html');
	editorJs = document.querySelector('#text-js');
	resultFrame = document.querySelector('#result-frame');
	resultLog = document.querySelector('#log');
	getQPath();

	[editorHtml, editorJs].forEach(editor => {
		editor.addEventListener('keydown', function (e) {
			if (e.key === 'Tab') {
				e.preventDefault();
				if (!e.shiftKey) {
					document.execCommand("insertText", false, '\t');
				}
			}
		}, false);
	});

	await getCode();

	resultFrame.addEventListener('load', sendCode);
});

window.addEventListener('hashchange', async () => {
	getQPath();
	await getCode();
})
