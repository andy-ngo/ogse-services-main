'use strict';

import Message from './message.js';

/** 
 * The message state class contains the data for the state of a model.
 **/
export default class MessageState extends Message { 
	
	/** 
	* Gets the message model
	* @type {Model} 
	*/
	get model() { return this._model; }
	
    /**
     * @param {Model} model - the model associated to the state message
     * @param {object} value - the message value
     */
	constructor(model, value) {
		super(value);
		
		this._model = model;
	}
	
    /**
     * Reverses the message. Used to move backwards in the simulation
	 * @return {MessageState} the reversed message.
     */
	reverse() {		
		// TODO: Only place where we use GetDiff I think.		
		return new MessageState(this.model, this.diff);
	}
}