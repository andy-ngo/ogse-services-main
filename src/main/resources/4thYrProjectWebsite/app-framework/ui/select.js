'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Widget from '../base/widget.js';

/** 
 * A replacement for the select component
 **/
export default class Select extends Widget {
	
	/**
	 * Get select box value
	 * @type {number}
	 */
	get value() {
		return this.root.value;
	}
	
	/**
	 * Set select box value
	 * @type {number}
	 */
	set value(value) {
		this.root.value = value;
	}
	
	/**
	 * Get select box title
	 * @type {string}
	 */
	get title() { return this.root.title; }
	
	/**
	 * Set select box title
	 * @type {string}
	 */
	set title(value) { this.root.title = value; }
	
	/**
	 * Get disabled state of the tooltip
	 * @type {boolean}
	 */
	get disabled() { return this.root.disabled; }
	
	/**
	 * Set disabled state of the tooltip
	 * @type {boolean}
	 */
	set disabled(value) { this.root.disabled = value; }
	
	/**
	 * Get selected element object (label, value)
	 * @type {object}
	 */
	get selected() {
		var i = this.root.value;
		
		return this._items[i];
	}
	
	/**
	 * Set the placeholder value of select box
	 * @type {string}
	 */
	set placeholder(value) {
		this._ph = Dom.create("option", { innerHTML:value, value:-1, className:"select-placeholder" });
		
		this._ph.disabled = true;
		this._ph.selected = true;
		
		this.root.insertBefore(this._ph, this.root.firstChild);
	}
	
	/**
	 * Constructor for the select element. Follows the widget creation pattern.
	 * @param {object} container - div container
	 */	
	constructor(container) {
		super(container);
		
		this._items = [];
		
		this._ph = null;
		
		this.root.addEventListener("change", this.on_select_change.bind(this));
	}
	
	/**
	 * Populate options in select box
	 * @param {string} label - Label of select option
	 * @param {string} title - Title of select option
	 * @param {object} item - Object containing option description, label, and value
	 */
	add(label, title, item) {
		Dom.create("option", { innerHTML:label, value:this._items.length, title:title || "" }, this.root);
		this.root.querySelectorAll('option').forEach( x=> x.setAttribute("role", "option")); // for accessibility
		
		this._items.push(item);
	}
	
	/**
	 * This function selects the first value in the component for which the delegate function returns true.
	 * @param {function} delegate  - Delegate function
	 */
	select(delegate) {		
		this.value = this.find_index(delegate);
	}
	
	/**
	 * Finds index of selected classification method through link to styler widget
	 * @param {function} delegate - Delegate function
	 * @returns {number} Index number of selected classification method (-1 if none)
	 */
	find_index(delegate) {
		for (var i = 0; i < this._items.length; i++) {
			if (delegate(this._items[i], i)) return i;
		}
		
		return -1;
	}
	
	/**
	 * Emit change event when a new option is selected
	 * @param {object} ev - Event object
	 */
	on_select_change(ev) {
		var item = this._items[ev.target.value];
		
		this.emit("change", { index:ev.target.value, item:item, label:ev.target.innerHTML });
	}
	
	/**
	 * Create HTML for select element
	 * @returns {string} HTML for select element
	 */
	html() {
		return '<select handle="root" role="listbox"></select>'; // role for accessibility
	}
	
	/**
	 * Empty items in select box
	 */
	empty() {
		Dom.empty(this.root);
		
		this._items = [];
		
		if (!this._ph) return;
		
		Dom.place(this._ph, this.root);
	
		this._ph.selected = true;
	}
};

Core.templatable("Api.UI.Select", Select);