'use strict';

import Configuration from './configuration.js';

/** 
 * A configuration class that holds all basic visualization parameters
 **/
export default class ConfigurationGis extends Configuration { 
	
	
	get json() { return this._json; }
	
	/** 
	* Sets the json configuration for the GIS view. 
	* @type {object} 
	*/
	set json(value) { 
		this._json = value; 
		
		if (this.variables) this.variables.forEach((s, i) => s.index = i); 
	}
	
	/** 
	* Gets the basemap to use for the GIS view. 
	* @type {string} 
	*/
	get basemap() { return this.json.basemap; }
	
	/** 
	* Gets the layers configuration to use for the GIS view. 
	* @type {object[]} 
	*/
	get layers() { return this.json.layers; }
	
	/** 
	* Gets the visual variables to use for the GIS view. 
	* @type {object[]} 
	*/
	get variables() { return this.json.variables; }
	
	/** 
	* Gets the view configuration for the GIS view. 
	* @type {object} 
	*/
	get view() { return this.json.view; }
	
	/** 
	* Gets the styles to use for the GIS view. 
	* @type {object[]} 
	*/
	get styles() { return this.json.styles; }
	
    /**
     * @param {simulation} simulation - the simulation object
     * @param {object} viz - the visualization configuration as json
     * @param {object} style - the style configuration as json
     */
	constructor(json) {
		super(json);
		
		this.type = this.type ?? "gis";
	}
}
