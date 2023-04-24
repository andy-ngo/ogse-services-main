'use strict';

import JsonObject from '../../base/json-object.js';
import List from '../../base/list.js';
import Field from './field.js';

/**
 * Metadata message type element
 * @module metadata/message-type
 * @extends JsonObject
 */
export default class MessageType extends JsonObject { 
	
	get id() { return this.json["identifier"]; }
	
	get field() { return this.json["field"]; }
	
	set field(value) { this.json["field"] = value; }
	
	set field(value) { this.json["field"] = value; }
	
	get index() { return this._index; }
	
    /**
     * @param {object} json - JSON used to initialize the object.
     */
	constructor(json) {
		super(json);
		
		this._index = {};
		
		var fields = this.field.map(j => new Field(j));
		this.field = new List(f => f.name);
		fields.forEach(f => this.add_field(f));
	}
	
	add_field(field) {
		var f = this.field.add(field);
		
		// TODO: Make this part of the field object ?
		this._index[f.name] = this.field.get_index(f.name);
		
		return f;
	}
	
	pair(values, fn) {
		for (var i = 0; i < this.field.length; i++) {
			fn(this.field[i], values[i]);
		}
	}
	
	template(values, fn) {
		var t = {};
		
		for (var i = 0; i < this.field.length; i++) {
			t[this.field[i].name] = values[i];
		}
		
		return t;
	}
	/*
	static make(id, fields) {
		return new MessageType({
			"identifier": id,
			"field": fields
		});
	}
	*/
	static make(id, fields) {
		return {
			"identifier": id,
			"field": fields
		};
	}
}