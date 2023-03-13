'use strict';

/** 
 * The message class contains the data that a model outputs or the state of the model.
 **/
export default class Message { 
	
	/** 
	* Gets the message model
	* @type {Model} 
	*/
	get model() { return this._model; }
	
	/** 
	* Sets the message model
	* @type {Model} 
	*/
	set model(value) { this._model = value; }
	
	/** 
	* Gets the message value
	* @type {object} 
	*/
	get value() { return this._value; }
	
	/** 
	* Sets the message value
	* @type {object} 
	*/
	set value(value) { this._value = value; }
		
    /**
     * @param {object} value - the message value.
     * @param {string} diff - the message value's difference with the previous state 
     */
	constructor(model, value) {
		this.model = model; 
		this.value = value;
	}
}
