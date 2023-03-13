'use strict';

import JsonObject from '../../base/json-object.js';

/**
 * Metadata dimensions element for coupled grid models
 * @module metadata/dimensions
 * @extends JsonObject
 */
export default class Dimensions extends JsonObject { 
	
	get x() { return this.json[0]; }
	
	get y() { return this.json[1]; }
	
	get z() { return this.json[2]; }
	
	/*
	static make(dimensions) {
		return new Dimensions(dimensions);
	}
	*/
	static make(dimensions) {
		return dimensions;
	}
}