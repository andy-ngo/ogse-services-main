'use strict';

import JsonObject from '../../base/json-object.js';
import Model from './model.js';

/**
 * Metadata subcomponent element for coupled models
 * @module metadata/subcomponent
 * @extends JsonObject
 */
export default class Subcomponent extends JsonObject { 
	
	get id() { return this.json["identifier"]; }
	
	get type() { return this.json["model type"]; }
	
	set type(value) { this.json["model type"] = value; }
	
	get port() { return this.type.port; }
	
	get state() { return this.type.state ?? null; }
	
	get message_type() { return this.type.message_type; }
	
	get subcomponent() { return this.type.subcomponent ?? null; }
	
	get coupling() { return this.type.coupling ?? null; }
		
	toJSON() {
		return {
			"identifier": this.id,
			"model type": this.type.id
		}
	}

	static make(id, type_id) {
		return {
			"identifier": id,
			"model type": type_id
		};
	}
}