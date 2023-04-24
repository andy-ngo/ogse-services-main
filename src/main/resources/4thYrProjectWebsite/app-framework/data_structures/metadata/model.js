'use strict';

import JsonObject from '../../base/json-object.js';
import List from '../../base/list.js';
import Port from './port.js';
import MessageType from './message-type.js';

/**
 * Metadata elements common to both atomic and coupled models
 * @module metadata/model
 * @extends JsonObject
 */
export default class Model extends JsonObject { 
	
	get id() { return this.json["identifier"]; }
	
	get title() { return this.json["title"]; }
	
	//get alternative() { return this.json["alternative"]; }
	
	//get creator() { return this.json["creator"]; }
	
	//get contributor() { return this.json["contributor"]; }
	
	//get language() { return this.json["language"]; }
	
	//get description() { return this.json["description"]; }
	
	//get subject() { return this.json["subject"]; }
	
	//get spatial_coverage() { return this.json["spatial coverage"]; }
	
	//get temporal_coverage() { return this.json["temporal coverage"]; }
	
	//get license() { return this.json["license"]; }
	
	//get created() { return this.json["created"]; }
	
	//get modified() { return this.json["modified"]; }
	
	//get behavior() { return this.json["behavior"]; }
	
	get port() { return this.json["port"]; }
	
	set port(value) { this.json["port"] = value; }
	
	get message_type() { return this.json["message type"]; }
	
	set message_type(value) { this.json["message type"] = value; }
	
    /**
     * @param {object} json - JSON used to initialize the object.
     */
	constructor(json) {
		super(json);
		
		var message_types = this.message_type?.map(j => new MessageType(j));
		this.message_type = new List(m => m.id);
		message_types?.forEach(m => this.add_message_type(m));
		
		var ports = this.port?.map(j => new Port(j));
		this.port = new List(p => p.name);
		ports?.forEach(p => this.add_port(p));
	}
	
	add_message_type(message_type) {
		return this.message_type.add(message_type);
	}
	
	add_port(port) {
		var p = this.port.add(port);
		
		p.message_type = this.message_type.get(p.message_type);
		
		return p;
	}
	
	/*
	static make(id, title) {
		return new Model({
			"identifier": id,
			"title": title,
			"port": [],
			"message type": []
		});
	}
	*/
	static make(id, title) {
		return {
			"identifier": id,
			"title": title,
			"port": [],
			"message type": []
		};
	}
}