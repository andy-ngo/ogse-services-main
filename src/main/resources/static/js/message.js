'use strict';

/** 
 * The message class contains the data that a model outputs or the state of the model.
 **/
export default class Message { 
	
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
	* Gets the message value's difference with the previous state. The diff value is used to move the simulation backwards.
	* @type {object} 
	*/
	get diff() { return this._diff; }
	
	/** 
	* Sets the message value's difference with the previous state. The diff value is used to move the simulation backwards.
	* @type {object} 
	*/
	set diff(value) { this._diff = value; }
	
    /**
     * @param {object} value - the message value.
     * @param {string} diff - the message value's difference with the previous state 
     */
	constructor(value, diff) {
		this.value = value != undefined ? value : null;
		this.diff = diff != undefined ? diff : null;
	}
	
    /**
     * Stores the value provided on this message. The provided value is usually the value of the 
	 * previous state for the model targeted by the message. The diff value is used subsequently 
	 * to return to the previous state when playing backwards. 
     */
	difference(v) {
		if (v === undefined || v === null) return;
		
		this.diff = {};
		
		for (var f in this.value) this.diff[f] = v[f];
	}
	
    /**
     * Reverses the message. Used to move backwards in the simulation
     */
	reverse() {		
		throw new Error("Reverse must be implemented by child class.");
	}
}
