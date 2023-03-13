'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';

/**
 * Template module
 * @module base/Template
 */
/**
 * Template module, an object used to template widgets objects
 * @module base/Template
 */
export default class Template { 

	/**
	 * Get the root element of the template
	 */
	get root() { return this._root; }

	/**
	 * Get the DOM elements of the template
	 */
	get elems() { return this._elems; }
	
	/**
	 * Get / set the html string for the template
	 */
	get html() { return this._html; }

	set html(value) { this._html = value.trim(); }

	/**
	 * Constructor for template object
	 * @param {string} html - a string containing the HTML fragment
	 */
	constructor(html) {		
		
		this._elems = {};
	}
	
	/**
	 * Builds the template from the HTML fragment, replaces any nls in the fragment.
	 * @param {string} html - a string containing the HTML fragment
	 * @param {string} nls - an nls object containing strings for multi language support
	 */
	build(html, nls) {	
		if (!nls) this.html = html;
			
		// Replace all nls strings in template. Nls string pattern in templates is nls(StringId)
		else this.html = this.replace(html, /nls\((.*?)\)/, m => nls.get(m));
		
		this._template = Dom.create("div", { innerHTML:this.html });
		
		this.set_named_nodes();
		this.set_root();
		this.set_subwidgets();
	}
	
	/**
	 * Sets nodes with handles on the template. Any node with a handle attribute will 
	 * be stored in the elems property.
	 */
	set_named_nodes() {		
		var named = this._template.querySelectorAll("[handle]");
		
		// Can't use Array ForEach here since named is a NodeList, not an array
		for (var i = 0; i < named.length; i++) { 
			var name = Dom.get_attribute(named[i], "handle");
			
			this._elems[name] = named[i];
		}
	}
	
	/**
	 * Sets the root element for the template
	 */
	set_root() {
		this._root = null;
		
		if (this._template.children.length == 0) return;
		
		if (this._template.children.length > 1) {
			throw new Error("templates can only have one child element, verify the HTML function.");
		}
		
		this._root = this._template.children[0];
	}
	
	/**
	 * Sets the subwidgets for the template. Replaces any node with a widget attribute 
	 * by an instance of the widget.
	 */
	set_subwidgets() {		
		var nodes = this._template.querySelectorAll("[widget]");
		
		// Can't use Array ForEach here since nodes is a NodeList, not an array
		for (var i = 0; i < nodes.length; i++) {
			var path = Dom.get_attribute(nodes[i], "widget");
			var module = Core.templatable(path);
			var widget = new module();
			
			// replace div provided by widget root
			var next = nodes[i].nextElementSibling;
			
			if (!next) nodes[i].parentElement.appendChild(widget.root);
			
			else nodes[i].parentElement.insertBefore(widget.root, next);
			
			// store handle in nodes to access widget later
			var handle = Dom.get_attribute(nodes[i], "handle");
			
			if (handle) this._elems[handle] = widget;
			
			// transfer attributes from div provided to widget root
			for (var j = 0; j < nodes[i].attributes.length; j++) {	
				var attr = nodes[i].attributes[j];
				
				if (attr.name == 'handle' || attr.name == 'widget') continue;
				
				widget.root.setAttribute(attr.name, attr.value);		
			}
			
			// use innerHTML as content for widget
			if (nodes[i].innerHTML.length > 0) widget.content = nodes[i].innerHTML;
			
			nodes[i].remove();
		}
	}
	
	/**
	 * Places the built fragment in a container DOM element.
	 * @param {object} container - a dom element
	 */
	place(container) {
		this._container = container;
		
		Dom.place(this.root, this._container);
	}

	
	/**
	 * Replaces substrings in a string using a delegate function
	 * @param {string} str - the string in which to replace substrings
	 * @param {string} expr - the expression to replace
	 * @param {function} delegate - the delegate function used to replace content
	 * @returns {string} the modified string
	 */
	replace(str, expr, delegate) {
		var m = str.match(expr);
		
		while (m) {
			str = str.replace(m[0], delegate(m[1]));
			m = str.match(expr);
		}
		
		return str;
	}
}