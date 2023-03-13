'use strict';

import JsonObject from '../../base/json-object.js';
import Subcomponent from './subcomponent.js';
import Port from './port.js';

/**
 * Metadata coupling element
 * @module metadata/coupling
 * @extends JsonObject
 */
export default class Coupling extends JsonObject { 
	
	get from_model() { return this.json["from model"]; }
	
	set from_model(value) { this.json["from model"] = value; }
	
	get from_port() { return this.json["from port"]; }
	
	set from_port(value) { this.json["from port"] = value; }
	
	get to_model() { return this.json["to model"]; }
	
	set to_model(value) { this.json["to model"] = value; }
	
	get to_port() { return this.json["to port"]; }
	
	set to_port(value) { this.json["to port"] = value; }
	
	toJSON() {
		return {
			"from model": this.from_model.id,
			"from port": this.from_port.name,
			"to model": this.to_model.id,
			"to port": this.to_port.name
		}
	}
	
	static make(from_model_id, from_port_name, to_model_id, to_port_name) {
		return {
			"from model": from_model_id,
			"from port": from_port_name,
			"to model": to_model_id,
			"to port": to_port_name
		};
	}
	/*
	static make(from_model_id, from_port_name, to_model_id, to_port_name) {
		return new Coupling({
			"from model": from_model_id,
			"from port": from_port_name,
			"to model": to_model_id,
			"to port": to_port_name
		});
	}
	*/
}