'use strict';

let _nls = {};
let _locale = document.documentElement.lang || "en";
let _templatables = {}

/** 
 * A utility class that contains a series of basic static functions
 **/
export default class Core {
	
	/**
	* Gets the current locale
	* @type {string} 
	*/
    static get locale() { return _locale; }
	
	/**
	* Sets the current locale
	* @type {string} 
	*/
    static set locale(value) { _locale = value; }

	/**
	* Get or set a templated class definition, this is required to nest Templated UI 
	* components within other Templated UI components.
	* @param {string} id - the id of the templated class definition to get or set
	* @param {class} definition - when specified, the class definition to set 
	* @return {class} if definition was not provided, the class definition corresponding to the id.
	*/
	static templatable(id, definition) {
		if (definition) {
			if (_templatables[id]) throw new Error(`Templatable ${id} is defined multiple times.`);
			
			else _templatables[id] = definition;
		}
		
		else if (!_templatables[id]) throw new Error(`Templatable ${id} is not defined.`);
		
		return _templatables[id];
	}
	
	/**
	* A convenience function to get a deffered object for asynchronous processing. 
	* Removes one level of nesting when working with promises
	* @return {object} an object that contains a promise object, a resolve and reject function
	*/
	static defer() {
		var defer = {};
		
		defer.promise = new Promise((resolve, reject) => {
			defer.Resolve = (result) => { resolve(result); };
			defer.Reject = (error) => { reject(error); };
		});
		
		defer.Resolved = (value) => {
			defer.Resolve(value);
			
			return defer.promise;
		}
		
		defer.Rejected = (error) => {
			defer.Reject(error);
			
			return defer.promise;
		}
		
		return defer;
	}
	
	/**
	* Merges an object into another object. 
	* @param {object} a - the object that will receive the properties 
	* @param {object} b - the object to merge into object A
	* @return {object} the modified Object
	*/
	static mixin(a, b) {				
		for (var key in b) {
			if (b.hasOwnProperty(key)) a[key] = b[key];
		}

		// TODO : Why did I use arguments[0] instead of a?
		return arguments[0];
	}
	
	/**
	* Returns a promise that waits until the HTML document is loaded. 
	* @return {promise} a promise, resolved when the HTML document is loaded.
	*/
	static wait_for_document() {
		var d = Core.defer();
		
		if (document.readyState === "complete") d.Resolve();
		
		else window.addEventListener('load', (ev) => d.Resolve());
		
		return d.promise;
	}
}
