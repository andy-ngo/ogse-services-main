'use strict';

import JsonObject from '../../base/json-object.js';
import MessageType from './message-type.js';

/**
 * Metadata port element
 * @module metadata/port
 * @extends JsonObject
 */
export default class Port extends JsonObject { 
	
	get type() { return this.json["type"]; }
	
	get name() { return this.json["name"]; }
	
	get message_type() { return this.json["message type"]; }
	
	set message_type(value) { this.json["message type"] = value; }
	
	get fields() { return this.message_type.field; }
	
	toJSON() {
		return {
			"type": this.type,
			"name": this.name,
			"message type": this.message_type.id
		}
	}
	/*
	static make(type, name, message_type) {
		return new Port({
			"type": type,
			"name": name,
			"message type": message_type
		});
	}
	*/
	static make(type, name, message_type_id) {
		return {
			"type": type,
			"name": name,
			"message type": message_type_id
		};
	}
}