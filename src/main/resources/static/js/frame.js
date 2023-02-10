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
			state : []
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
	
    /**
     * Get the reverse of the frame object. A reverse frame is obtained by reversing
	 * all the messages in a frame. A reverse message has the values required to move a 
	 * model's state back to the preceding frame. 
	 * @return {Frame} the reversed message.
     */
	reverse () {
		var reverse = new Frame(this.time);
		
		for (var i = 0; i < this.state_messages.length; i++) {
			var m = this.state_messages[i];
			
			reverse.add_state_message(m.reverse());
		}
		
		return reverse;
	}
	
    /**
     * This function computes the differences between the state messages of this frame and 
	 * the state provided. Difference values are assigned to each message object
	 * @see Message, Model
     */
	difference(state) {
		for (var i = 0; i < this.state_messages.length; i++) {
			var m = this.state_messages[i];			
			var v = state.get_value(m.model);
			
			m.difference(v);
		}
	}
}