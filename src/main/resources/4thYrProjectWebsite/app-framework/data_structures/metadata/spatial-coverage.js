'use strict';

import JsonObject from '../../base/json-object.js';
import Extent from './extent.js';
/**
 * Metadata spatial coverage element
 * @module metadata/spatial-coverage
 * @extends JsonObject
 */
export default class SpatialCoverage extends JsonObject { 
	
	get placename() { return this.json["placename"]; }
	
	get extent() { return this.json["extent"]; }
	
	set extent(value) { this.json["extent"] = value; }
	
	constructor(json) {
		super(json);
		
		this.extent = new Extent(json.extent);
	}
	
	static make(placename, extent) {
		return {
			"placename": placename,
			"extent": extent
		};
	}
	/*
	static make(placename, extent) {
		return new SpatialCoverage({
			"placename": placename,
			"extent": extent
		});
	}
	*/
}
