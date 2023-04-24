'use strict';

import Core from './core.js';

/** 
 * A utility class that contains a series of basic functions to manipulate the DOM tree
 **/
export default class Dom {
	
	/**
	* Create an element
	* @param {string} tagName - The type of element to be created (div, span, label, input, etc.)
	* @param {object} options - A dictionary type object containing the options to assign to the created Element
	* @param {element} pNode - The parent element where the created element will be apended
	* @returns {element} The element created
	*/
	static create(tagName, options, pNode) {
		var elem = document.createElement(tagName);
		
		Core.mixin(elem, options);
		
		this.place(elem, pNode);
		
		return elem
	}

	/**
	* Append an element to another element
	* @param {element} elem - The element to be appended
	* @param {element} pNode - The parent element where the element will be appended
	*/
	static place(elem, pNode) {
		if (!!pNode) pNode.appendChild(elem);
	}

	/**
	* Remove all children of an element
	* @param {element} elem - The element to empty
	*/
	static empty(elem) {
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	}

	/**
	* Add a CSS rule to an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to add to the element
	*/
	static add_css(elem, css) {
		var c1 = elem.className.split(" ");
		
		css.split(" ").forEach(function(c) {
			if (c1.indexOf(c) == -1) c1.push(c);
		})
		
		elem.className = c1.join(" "); 
	}

	/**
	* Remove a CSS rule from an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to remove from the element
	*/
	static remove_css(elem, css) {				
		var c1 = elem.className.split(" ");
		var c2 = css.split(" ");
		
		elem.className = c1.filter(function(c) { return c2.indexOf(c) == -1; }).join(" ");
	}

	/**
	* Set the CSS rules on an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to set on the element
	*/
	static set_css(elem, css) {
		elem.className = css; 
	}

	/**
	* Toggle a CSS rule on or or off for an element
	* @param {element} elem - The element to modify
	* @param {string} css - The CSS rule to toggle on the element
	* @param {boolean} enabled - True to toggle the CSS rule on, false to toggle it off
	*/
	static toggle_css(elem, css, enabled) {
		if (enabled) this.add_css(elem, css);
		
		else this.remove_css(elem, css);
	}
	
	/**
	* Get an attribute value from an element
	* @param {element} elem - The element to retrieve the attribute from
	* @param {string} attr - The name of the attribute to retrieve
	* @returns {string} The value of the attribute if found, null otherwise
	*/
	static get_attribute(elem, attr) {
		var attr = elem.attributes.getNamedItem(attr);
		
		return attr ? attr.value : null;
	}
	
	/**
	* Returns the geometry of a dom node (width, height)
	* @param {element} elem - The element from which to retrieve the geometry
	* @returns {object} An object containing the unpadded width and height of the element
	*/
	static geometry(elem) {
		var style = window.getComputedStyle(elem);
		
		var h = +(style.getPropertyValue("height").slice(0, -2));
		var w = +(style.getPropertyValue("width").slice(0, -2));
		var pL = +(style.getPropertyValue("padding-left").slice(0, -2));
		var pR = +(style.getPropertyValue("padding-right").slice(0, -2));
		var pT = +(style.getPropertyValue("padding-top").slice(0, -2));
		var pB = +(style.getPropertyValue("padding-bottom").slice(0, -2));
		
		var w = w - pL - pR;
		var h = h - pT - pB;
		
		return { w : w , h : h }
	}
}