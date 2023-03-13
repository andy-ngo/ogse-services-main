'use strict';

/** 
 * The Frame object contains output and state messages for a given frame. 
 * Frames are added or removed from the simulation state to move forward or 
 * backward respectively.
 **/
export default class Frame { 

	/** 
	* Gets all messages for the frame.
	* @type {Message[]} 
	*/
	get messages() { return this._messages; }

	/** 
	* Gets output messages for the frame.
	* @type {Message[]} 
	*/
	get output_messages() { return this.messages.output; }

	/** 
	* Gets state messages for the frame.
	* @type {Message[]} 
	*/
	get state_messages() { return this.messages.state; }
	
	get previous_messages() { return this.messages.previous; }
	
	/** 
	* Gets the time representation for the frame.
	* @type {string} 
	*/
	get time() { return this._time; }
	
    /**
     * @param {string} time - The time representation for the frame.
     */
	constructor(time) {
		this._time = time;
		
		this._messages = {
			output : [],
			state : [],
			previous : []		// previous state messages for this frame
		}
	}
	
    /**
     * Add a message of the specified type to the frame .
	 * @param {Message} message - message to add.
	 * @param {string} type - the type of message to add (output or state).
     * @return {Message} the added message.
     */
	add_message(message, type) {
		this.messages[type].push(message);
		
		return message;
	}
	
    /**
     * Add an output message to the frame .
	 * @param {Message} message - message to add.
     * @return {Message} the added message.
     */
	add_output_message(message) {
		return this.add_message(message, "output");
	}
	
    /**
     * Add an state message to the frame .
	 * @param {Message} message - message to add.
     * @return {Message} the added message.
     */
	add_state_message(message) {
		return this.add_message(message, "state");
	}
	
	add_previous_message(message) {
		return this.add_message(message, "previous");
	}
	
	link_previous(state) {
		for (var i = 0; i < this.state_messages.length; i++) { 
			var m = this.state_messages[i].model;
		
			this.add_previous_message(state.get_message(m));
		}
	}
}