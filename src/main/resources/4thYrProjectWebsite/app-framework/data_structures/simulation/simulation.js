'use strict';

import Evented from '../../base/evented.js';
import List from '../../base/list.js';
import Cache from './cache.js';
import State from './state.js';

/** 
 * The Simulation object contains all the data and metadata required to visually
 * represent and animate the simulation trace. Its main components are the structure
 * object which contains all information related to the model and the frames 
 * which contain all the messages for the simulation trace.
 * @see Structure, Frame, Message
 **/
export default class Simulation extends Evented { 
	
	get position() { return this.state.position; }
	
	/** 
	* Gets the simulation model structure
	* @type {Structure} 
	*/
	get metadata() { return this._metadata; }
	
	get name() { return this.root.type.title; }
	
	/** 
	* Gets the simulation model root
	* @type {Model[]} 
	*/
	get root() { return this.metadata.root; }
	
	/** 
	* Gets the simulation models
	* @type {Model[]} 
	*/
	get models() { return this.metadata.models; }
	
	/** 
	* Gets the simulation model types
	* @type {Model[]} 
	*/
	get types() { return this.metadata.types; }
	
	/** 
	* Gets the simulation atomic model types
	* @type {Model[]} 
	*/
	get atomic_types() { return this.metadata.atomic_types; }
	
	/** 
	* Gets the simulation coupled model types
	* @type {Model[]} 
	*/
	get coupled_types() { return this.metadata.coupled_types; }
	
	/** 
	* Gets the simulation coupled model types
	* @type {Model[]} 
	*/
	get grid_types() { return this.metadata.grid_types; }
	
	/** 
	* Gets the current state of the simulation
	* @type {State} 
	*/
	get state() { return this._state; }
	
	/** 
	* Gets the current state of the simulation
	* @type {State} 
	*/
	set state(value) { this._state = value; }
	
	/** 
	* Gets the cache for the simulation
	* @type {Cache} 
	*/
	get cache() { return this._cache; }
	
	/** 
	* Gets all frames in the simulation
	* @type {Frame[]} 
	*/
	get frames() { return this._frames; }

	/** 
	* Gets the current frame of the simulation
	* @type {Frame} 
	*/
	get current_frame() { return this.frames[this.position]; }
	
	/** 
	* Gets the first frame of the simulation
	* @type {Frame} 
	*/
	get first_frame() { return this.frames[0]; }
	
	/** 
	* Gets the last frame of the simulation
	* @type {Frame} 
	*/
	get last_frame() { return this.frames[this.frames.length - 1]; }
	
    /**
     * @param {Structure} structure - The simulation model structure.
     * @param {Frame[]} frames - An array of all the simulation frames.
     * @param {number} cache_interval - The cache interval.
     */
	constructor(metadata, n_cache) {
		super();
		
		this._position = 0;
		this._metadata = metadata;
		this._frames = new List(f => f.time);
		this._cache = null;	
		this._state = null;
	}
	
	initialize(frames, n_cache) {
		this._cache = new Cache(n_cache, this.models);	
		
		for (var i = 0; i < frames.length; i++) {
			var add = frames[i];
			
			if (this.frames.has(add)) throw new Error("Cannot add frame to simulation, it already exists.");
		
			if (i > 0) add.link_previous(this.cache.last());
			
			this.cache.add_frame(add, this.frames.length);
			this.frames.add(add);
		}
		
		this.state = this.cache.first().clone();
	}
	
    /**
     * Returns the state of the model for the frame at the position identified by the index provided.
     * @param {number} index - the position of the frame for which to retrieve the state.
	 * @return {State} the state corresponding to frame identified by the index provided.
     */
	get_state(index) {
		if (index == this.frames.length - 1) return this.cache.last().clone();
		
		if (index == 0) return this.cache.first().clone();
		
		var cached = this.cache.get_closest(index).clone();		
		
		for (var j = cached.position + 1; j <= index; j++) {
			cached.apply_frame(this.frames[j]);
		}
		
		return cached;
	}
	
    /**
     * Moves the simulation state to frame at the position identified by the index provided.
     * @param {number} index - the index of the frame to move to.
     */
	go_to_frame(index) {
		this.state = this.get_state(index);
		
		this.emit("jump", { state:this.state, frame:this.current_frame, i:this.position });
	}
	
    /**
     * Moves the simulation state to the next frame.
     */
	go_to_next_frame() {		
		var frame = this.frames[this.position + 1];
		
		this.state.apply_frame(frame);
		
		this.emit("next", { state:this.state, frame:this.current_frame, i:this.position });
	}
	
    /**
     * Moves the simulation state to the previous frame.
     */
	go_to_previous_frame() {
		var frame = this.frames[this.position];
		
		this.state.rollback_frame(frame);
		
		this.emit("previous", { state:this.state, frame : frame, i:this.position });
	}
}