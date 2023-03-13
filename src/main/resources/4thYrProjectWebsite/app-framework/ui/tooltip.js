'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Widget from '../base/widget.js';

/** 
 * A tooltip container that can be shown at a specifc screen X,Y position
 **/
export default class Tooltip extends Widget { 
	
	/**
	 * Get tooltip bounding box
	* @type {object} 
	 */
	get bbox() {
		return this.elems.root.getBoundingClientRect();
	}
	
	/**
	 * Set HTML content value
	* @type {string} 
	 */
	set content(value) {
		this.elems.content.innerHTML = value;
	}
	
	/**
	 * Constructor for the tooltip. Follows the widget creation pattern.
	 * Adds it to the document body by default.
	 * @param {string} - CSS to add to the root of the tooltip
	 */	
	constructor(css) {	
		super(document.body);		

		if (css) Dom.add_css(this.elems.root, css);		
	}
	
	/**
	 * Create HTML template for the tooltip
	 * @returns {string} HTML for the tooltip
	 */		
	html() {
		return '<div handle="root" class="tooltip">' +
				  '<div handle="content"></div>' +
			   '</div>';
	}
	
	/**
	 * Set new coordinates for tooltip based on offsets and coords of a bounding box
	 * @param {object} target - Target element
	 * @param {number[]} offset - Offset coordinates
	 */
	position_target(target, offset) {
		offset = offset || [0,0];
		
		bbox1 = target.getBoundingClientRect();
		bbox2 = this.elems.root.getBoundingClientRect();
		
		var x = bbox1.left +  bbox1.width / 2 - bbox2.width / 2 + offset[0];
		var y = bbox1.top + document.documentElement.scrollTop - bbox2.height - 5  + offset[1];
		
		this.position_xy(x, y);
	}
	
	/**
	 * Set tooltip position to specified coodinates
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 */
	position_xy(x, y) {
		this.elems.root.style.left = x + "px";
		this.elems.root.style.top = y + "px";
				
		if (this.bbox.left + this.bbox.width > window.innerWidth) {
			this.elems.root.style.top = y + 30 + "px";
			this.elems.root.style.left = -180 + x + "px";
		}
	}
	
	/**
	 * Set tooltip position and show it
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 */
	show(x, y) {
		this.position_xy(x, y);
		
		this.elems.root.style.opacity = 1;
	}
	
	/**
	 * Hide the tooltip
	 */
	hide() {
		this.elems.root.style.opacity = 0;
	}
	
	/** 
	 * Empty the tooltip 
	 */
	empty() {
		Dom.empty(this.elems.content);
	}
};

Core.templatable("Api.UI.Tooltip", Tooltip);