/**************************************************************************
 * Expected:
 * 	Clicking on a button should add a log message with the text of the 
 * 	button that was clicked.
 * 
 * Actual:
 * 	Clicking the buttons always logs that it clicked on button 4.
 **************************************************************************/

let buttons = document.querySelectorAll('#ButtonList button');
let button = null;

for (let i = 0; i < buttons.length; ++i) {
	button = buttons[i];

	button.addEventListener('click', () => {
		console.log(`You clicked ${button.textContent}`);
	});
}