'use strict';

import JsonObject from '../../base/json-object.js';

/**
 * Metadata extent element
 * @module metadata/extent
 * @extends JsonObject
 */
export default class Extent extends JsonObject { 
	
	get reference() { return this.json["reference"]; }
	
	get x_min() { return this.json["x min"]; }
	
	get y_min() { return this.json["y min"]; }
	
	get x_max() { return this.json["x max"]; }
	
	get y_max() { return this.json["y max"]; }
	/*
	static make(reference, x_min, y_min, x_max, y_max) {
		return new Extent({
			"reference": reference,
			"x min": x_min,
			"y min": y_min,
			"x max": x_max,
			"y max": y_max
		});
	}
	*/
	static make(reference, x_min, y_min, x_max, y_max) {
		return {
			"reference": reference,
			"x min": x_min,
			"y min": y_min,
			"x max": x_max,
			"y max": y_max
		};
	}
}