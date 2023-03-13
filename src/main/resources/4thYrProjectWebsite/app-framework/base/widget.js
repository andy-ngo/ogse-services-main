'use strict';

import Component from './component.js';
import Template from './template.js';
import Dom from '../tools/dom.js';

/**
 * Widget module, a base class for complex UI components
 * @module base/Widget
 * @extends Component
 */
export default class Widget extends Component { 
	
	/**
	 * Get/set the template object
	 */
	get template() { return this._template; }
	set template(value) { this._template = value; }

	/**
	 * Get/set the container DOM Element
	 */
	get container() { return this._container; }
	set container(value) { 
		this._container = value;
		
		if (this.container) this.template.place(this.container); 
	}

	/**
	 * Set the content of this widget
	 */
	set content(value) {
		throw new Error("content setter not defined.");
	}
	
	/**
	 * Get the root element of the widget
	 */
	get root() { return this.template.root; }
	
	/**
	 * Get the DOM elements of the widget
	 */
	get elems() { return this.template.elems; }

	/**
	 * Constructor for widget object
	 * @param {object} container - A DOM element that will contain the widget
	 */
	constructor(container) {
		super();
		
		var html = this.html();
	
		if (html) {
			this.template = new Template(html);
			
			this.template.build(html, this._nls);
		};
		
		this.container = container;
	}
	
	/**
	 * Return an HTML fragment to build the widget's UI
	 * @returns {string} the HTML fragment for the widget's UI
	 */
	html() {
		return null;		
	}
	
	/**
	 * Handles error by emitting an event containing the error. This error should
	 * be caught at the application level.
	 * @returns {string} the HTML fragment for the widget's UI
	 */
	error(error) {
		this.emit("error", { error:error });
	}
}