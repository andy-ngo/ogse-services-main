'use strict';

import Core from '../tools/core.js';

/**
 * Evented module. Allows the child class to emit and listen to events.
 * @module base/Evented
 */
export default class Evented { 

	/**
	 * Constructor for evented object
	 */
	constructor() {
		this._listeners = {};
	}

	/**
	 * @description
	 * Add an event listener to the list of event listeners.
	 * @param {string} type - event type to be listened for
	 * @param {function} callback - a callback function that listens for an event
	 * @param {boolean} once - indicates whether the event should be listened to only once
	 * @returns {object} an object containing the event handler information
	 */
	add_event_listener(type, callback, once){
		if (!(type in this._listeners)) this._listeners[type] = [];
		
		var h = { target:this, type:type, callback:callback, once:!!once };
		
		this._listeners[type].push(h);
		
		return h;
	}
	
	/**
	 * @description
	 * Remove an event listener from the list of event listeners.
	 * @param {string} type - name of the event
	 * @param {function} callback - a callback function that listens for an event
	 */
	remove_event_listener(type, callback){
		if (!(type in this._listeners)) return;
	  
		var stack = this._listeners[type];
		  
		for (var i = 0, l = stack.length; i < l; i++){
			if (stack[i].callback === callback){
				stack.splice(i, 1);
				
				return this.remove_event_listener(type, callback);
			}
		}
	}
	
	/**
	 * @description
	 * Invoke an event listener.
	 * @param {object} event - an event object 
	 */
	dispatch_event(event){
		if (!(event.type in this._listeners)) return;

		var stack = this._listeners[event.type];

		for (var i = 0; i < stack.length; i++) {
			stack[i].callback.call(this, event);
		}
		
		for (var i = stack.length - 1; i >= 0; i--) {
			if (!!stack[i].once) this.remove_event_listener(event.type, stack[i].callback);
		}
	}
	
	/**
	 * @description
	 * Dispatches an event from this class
	 * @param {string} type - a string containing the name of the event
	 * @param {object} data - an object to be passed with the event
	 */
	emit(type, data) {
		// Let base event properties be overwritten by whatever was provided.	
		var event = { bubbles:true, cancelable:true };
	
		Core.mixin(event, data);
		
		// Use the type that was specifically provided, target is always this.
		event.type = type;
		event.target = this;
		
		this.dispatch_event(event);
	}
	
	/**
	 * @description
	 * Add a an event listener
	 * @param {string} type - event type to be listened for
	 * @param {function} callback - a callback function that executes when the event is heard
	 * @returns {object} an object containing the event handler information
	 */
	on(type, callback) {
		return this.add_event_listener(type, callback, false);
	}

	/**
	 * @description
	 * Add a one time event listener
	 * @param {string} type - event type to be listened for
	 * @param {function} callback - a callback function that executes when the event is heard
	 * @returns {object} an object containing the event handler information
	 */
	once(type, callback) {
		return this.add_event_listener(type, callback, true);
	}

	/**
	 * @description
	 * Remove an event listener
	 * @param {string} type - event type to be listened for
	 * @param {function} callback - a callback function that listens for an event
	 */
	off(type, callback) {
		this.remove_event_listener(type, callback);
	}
}