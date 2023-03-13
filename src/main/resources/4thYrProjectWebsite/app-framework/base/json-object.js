'use strict';

/**
 * A base for objects created from json data
 * @module base/json_object
 * @extends Widget
 */
export default class JsonObject { 
	
	get json() { return this._json; }
	
	
	set json(value) { this._json = value; }
	
    /**
     * @param {object} json - JSON used to initialize the object.
     */
	constructor(json) {
		this.json = json;
	}
	
	toJSON() { return this.json; }
}