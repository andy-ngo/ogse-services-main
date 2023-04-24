'use strict';

import JsonObject from '../../base/json-object.js';

/**
 * Set of model instances in a scenario
 * @module scenario/instance-set
 * @extends JsonObject
 */
export default class InstancesSet extends JsonObject { 
	
	get id() { return this.json["id"]; }
	
	get type() { return this.json["type"]; }
	
	get properties() { return this.json["properties"]; }
	
	get models() { return this.json["models"]; }
}