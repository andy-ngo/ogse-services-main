'use strict';

import JsonObject from '../../base/json-object.js';

/**
 * Metadata field element
 * @module metadata/field
 * @extends JsonObject
 */
export default class Field extends JsonObject { 
	
	get name() { return this.json["name"]; }
	
	get description() { return this.json["description"]; }
	
	get type() { return this.json["type"]; }
	
	get uom() { return this.json["uom"]; }
	
	get scalar() { return this.json["scalar"]; }
	/*
	static make(name) {
		return new Field({
			"name": name
		});
	}
	*/
	static make(name) {
		return {
			"name": name,
			"description": null,
			"type": null,
			"uom": null,
			"scalar": null
		};
	}
}