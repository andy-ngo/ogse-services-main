'use strict';

import Net from '../../tools/net.js';
import Evented from '../../base/evented.js';

/** 
 * A configuration class that holds all basic visualization parameters
 **/
export default class Configuration extends Evented { 
	
	get json() { return this._json; }
	
	set json(value) { this._json = value; }
	
	get type() { return this.json.type; }
	
	set type(value) { this.json.type = value; }
	
	get files() { return this._files; }
	
	set files(value) { this._files = value; }
	
	/** 
	* Gets the speed for the playback. In frames per second. 
	* @type {number} 
	*/
	get speed() { return this.json.speed; }
	
	/** 
	* Sets the speed for the playback. In frames per second. 
	* @type {number} 
	*/
	set speed(value) { this.json.speed = value; }
	
	/** 
	* Gets the loop flag for the playback. True if the simulation should loop.
	* @type {boolean} 
	*/
	get loop() { return this.json.loop; }
	
	/** 
	* Sets the loop flag for the playback. True if the simulation should loop.
	* @type {boolean} 
	*/
	set loop(value) { this.json.loop = value; }
	
	/** 
	* Gets the number of frames between cached frames.
	* @type {number} 
	*/
	get cache() {  return this.json.cache; }
	
	/** 
	* Sets the number of frames between cached frames.
	* @type {number} 
	*/
	set cache(value) { this.json.cache = value; }
	
    /**
     * @param {simulation} simulation - the simulation object
     * @param {object} viz - the visualization configuration as json
     * @param {object} style - the style configuration as json
     */
	constructor(json) {
		super();
		
		this.json = json || {};
		
		this.speed = this.speed ?? 10;
		this.loop = this.loop ?? true;
		this.cache = this.cache ?? 10;
		this.files = this.json.files ?? [];
	}
	
	initialize(files) {
		this.files = files;
	}
	
	async load_files() {
		return await Promise.all(this.files.map(async (f, i) => {			
			return await Net.file(f.url, f.name, false);
		}));
	}
	
    /**
     * Triggers a change event on the configuration section
     * @param {string} property - The name of the changed property
     */
	trigger(property) {
		this.emit("change", { property:property });
		this.emit(`change:${property}`, { property:property });
	}
	
    /**
     * Sets a parameter on the configuration section. Triggers a change event.
	 * @param {string} property - The name of the changed property
	 * @param {object} value - The value to set on the property.
     */
	set(property, value) {
		this[property] = value;
		
		this.trigger(property, value);
	}
	
    /**
     * Returns the configuration as file object
     */
	to_file() {
		var content = JSON.stringify(this);
		
		return new File([content], "visualization.json", { type:"application/json", endings:'native' });
	}
	
	toJSON() { return this.json; }
}
