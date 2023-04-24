'use strict';

import JsonObject from '../../base/json-object.js';

/**
 * Set of model instances in a scenario
 * @module scenario/instance-set
 * @extends JsonObject
 */
export default class CouplingsSet extends JsonObject { 
	
	get from_model() { return this.json["from_model"]; }
	
	get from_port() { return this.json["from_port"]; }
	
	get to_model() { return this.json["to_model"]; }
	
	get to_port() { return this.json["to_port"]; }
	
	get couplings() { return this.json["couplings"]; }
}