'use strict';

import Message from './message.js';

/** 
 * The message output class contains the data that a model outputs through a port.
 **/
export default class MessageOutput extends Message { 
	
	/** 
	* Gets the message port type
	* @type {TypePort} 
	*/
	get port() { return this._port; }
	
	/** 
	* Sets the message port type
	* @type {TypePort} 
	*/
	set port(value) { this._port = value; }
	
	get templated() { return this.port.message_type.template(this.value); }
	
	get templated_string() { return JSON.stringify(this.templated); }
	
    /**
     * @param {Model} model - the model that output the message
     * @param {TypePort} port - the port type that output the message
     * @param {object} value - the message value
     */
	constructor(model, port, value) {
		super(model, value);
		
		this.port = port;
	}
	
	pair(fn) {
		this.port.message_type.pair(this.value, fn);
	}
	
	get_value(field) {
		var i = this.port.message_type.index[field];
		
		return this.value[i];
	}
}