'use strict';

import JsonObject from '../../base/json-object.js';

/**
 * Metadata temporal coverage element
 * @module metadata/temporal-coverage
 * @extends JsonObject
 */
export default class TemporalCoverage extends JsonObject { 
	
	get start() { return this.json["start"]; }
	
	get end() { return this.json["end"]; }
	
	get scheme() { return this.json["scheme"]; }
	/*
	static make(start, end, scheme) {
		return new TemporalCoverage({
			"start": start,
			"end": end,
			"scheme": scheme
		});
	}
	*/
	static make(start, end, scheme) {
		return {
			"start": start,
			"end": end,
			"scheme": scheme
		};
	}
}
