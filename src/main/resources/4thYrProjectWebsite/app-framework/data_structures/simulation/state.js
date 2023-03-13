'use strict';

/** 
 * Stores the state of all models in the simulation at a given frame.
 **/
export default class State { 
	
	/** 
	* Gets the models for the state object.
	* @type {object} 
	*/
	get models() { return this._models; }
	
	/** 
	* Gets the state messages for the state object.
	* @type {object} 
	*/
	get messages() { return this._messages; }
	
	set position(value) { this._position = value; }
	
	get position() { return this._position; }
		
    /**
	 * The state class holds the last state messages for all models in the simulation.
     * @param {Model[]} models - An array of all the models in the simulation.
     */
	constructor(models) {
		this._position = -1;
		this._models = models;
		this._messages = {};
		
		for (var i = 0; i < models.length; i++) this.messages[models[i].id] = null;
	}
	
    /**
     * Make a deep clone of the State object.
     * @return {State} the cloned state.
     */
	clone() {
		var clone = new State(this.models);
		
		for (var i = 0; i < this.models.length; i++) {
			var m = this.models[i];
			
			clone.messages[m.id] = this.messages[m.id];
		}
		
		clone.position = this.position;
		
		return clone;
	}
	
    /**
     * Returns the state value of a model for the current state.
     * @param {Model} model - a model instance for which to retrieve the state value.
	 * @return {object} a state value (usually JSON).
     */
	get_message(model) {
		return this.messages[model.id] || null;
	}
	
    /**
     * Determine a new state by applying all the messages for the provided frame.
     * @param {Frame} frame - the frame to apply to the state.
	 */
	apply_frame(frame) {
		this.position++;
		
		for (var i = 0; i < frame.state_messages.length; i++) {
			var message = frame.state_messages[i];
			this.messages[message.model.id] = message;
		}
	}
	
	rollback_frame(frame) {
		this.position--;

		for (var i = 0; i < frame.state_messages.length; i++) {
			var message = frame.state_messages[i];
			this.messages[message.model.id] = message.prev;
		}
	}
}