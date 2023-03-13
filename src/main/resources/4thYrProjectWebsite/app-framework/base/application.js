'use strict';

import Core from '../tools/core.js';
import Widget from './widget.js';

/**
 * Application module
 * @module base/Application
 * @extends Widget
 */
export default class Application extends Widget { 
	
	/**
	 * Handles error events for widgets. 
	 * @returns {array} an array of widget objects
	 */
	handle_widget_errors(widgets) {
		widgets.forEach(w => {
			w.on("error", ev => this.handle_error(ev.error));
		});
	}
	
	/**
	 * Handles an error, displays an alert and logs it to console
	 * @returns {object} an error object
	 */
	handle_error(error) {
		console.error(error.stack);
		alert(error.message);
	}
	
	/**
	 * Return an HTML fragment to build the widget's UI
	 * @returns {string} the HTML fragment for the widget's UI
	 */
	html() {
		return	"<div handle='app-container' class='app-container'></div>";
	}
}