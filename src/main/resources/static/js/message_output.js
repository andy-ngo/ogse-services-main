'use strict';

import MessageState from './message_state.js';

/** 
 * The message output class contains the data that a model outputs through a port.
 **/
export default class MessageOutput extends MessageState { 
	
	/** 
	* Gets the message port type
	* @type {TypePort} 
	*/
	get port() { return this._port; }
	
    /**
     * @param {Model} model - the model that output the message
     * @param {TypePort} port - the port type that output the message
     * @param {object} value - the message value
     */
	constructor(model, port, value) {
		super(model, value);
		
		this._port = port;
	}
	
    /**
     * Reverses the message. Used to move backwards in the simulation
     */
	reverse() {		
		// TODO: Only place where we use GetDiff I think.		
		return new MessageOutput(this.model, this.port, this.diff);
	}
}