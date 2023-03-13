'use strict';

import JsonObject from '../../base/json-object.js';
import Configuration from './configuration.js';
import ModelGrid from '../metadata/model-grid.js';

class GridLayer extends JsonObject {
	
	get z() { return this.json.z; }
	
	get fields() { return this.json.fields; }
	
	get style() { return this.json.style; }
	
	get position() { return this.json.position; }
	
	get geom() { return this.json.geom; }
	
	set geom(value) { this.json.geom = value; }
	
	constructor(json) {
		super(json); 
	}
	
	toJSON() {
		return { 
			z:this.z, 
			fields:this.fields, 
			style:this.style, 
			position:this.position
		}
	}
}



/** 
 * A configuration class that holds grid visualization parameters
 **/
export default class ConfigurationGrid extends Configuration { 
	
	/** 
	* Gets the number of columns for the grid. 
	* @type {number} 
	*/
	get columns() { return this.json.columns; }
	
	/** 
	* Sets the number of columns for the grid. 
	* @type {number} 
	*/
	set columns(value) { this.json.columns = value; }
	
	/** 
	* Gets the width for the grid. 
	* @type {number} 
	*/
	get width() { return this.json.width; }
	
	/** 
	* Sets the width for the grid. 
	* @type {number} 
	*/
	set width(value) { this.json.width = value; }
	
	/** 
	* Gets the height for the grid. 
	* @type {number} 
	*/
	get height() { return this.json.height; }
	
	/** 
	* Sets the height for the grid. 
	* @type {number} 
	*/
	set height(value) { this.json.height = value; }
	
	/** 
	* Gets the spacing between layers of the grid, in pixels. 
	* @type {number} 
	*/
	get spacing() { return this.json.spacing; }
	
	/** 
	* Sets the spacing between layers of the grid, in pixels. 
	* @type {number} 
	*/
	set spacing(value) { this.json.spacing = value; }
	
	/** 
	* Gets Indicates whether the grid should be drawn
	* @type {boolean} 
	* @unused
	*/
	get show_grid() { return this.json.showGrid; }
	
	/** 
	* Sets Indicates whether the grid should be drawn
	* @type {boolean} 
	* @unused
	*/
	set show_grid(value) { this.json.showGrid = value; }
	
	/** 
	* Gets whether the aspect ratio should be preserved for each grid layer.
	* @type {boolean} 
	*/
	get aspect() { return this.json.aspect; }
	
	/** 
	* Sets whether the aspect ratio should be preserved for each grid layer.
	* @type {boolean} 
	*/
	set aspect(value) { this.json.aspect = value; }
	
	/** 
	* Gets the layers configuration for the grid. 
	* @type {object[]} 
	*/
	get layers() { return this.json.layers; }
	
	/** 
	* Sets the layers configuration for the grid. 
	* @type {object[]} 
	*/
	set layers(value) { this.json.layers = value; }
	
	/** 
	* Gets the styles configuration for the grid. 
	* @type {object[]} 
	*/
	get styles() { return this.json.styles; }
	
	/** 
	* Sets the styles configuration for the grid. 
	* @type {object[]} 
	*/
	set styles(value) { this.json.styles = value; }
		
    /**
     * @param {simulation} simulation - the simulation object
     * @param {object} viz - the visualization configuration as json
     * @param {object} style - the style configuration as json
     */
	constructor(json) {
		super(json);
		
		this.columns = this.columns ?? 1;
		this.width = this.width ?? 350;
		this.height = this.height ?? 350;
		this.spacing = this.spacing ?? 10;
		this.showGrid = this.showGrid ?? false;
		this.aspect = this.aspect ?? true;
		this.styles = this.styles ?? [];
		this.type = this.type ?? "grid";
		
		this.layers = this.layers?.map(l => new GridLayer(l)) ?? [];
	}
	
	initialize(files, simulation) {
		super.initialize(files);
		
		if (this.layers.length > 0) return;

		var grid = simulation.types[1];
		var model = simulation.types[2];
		
		for (var i = 0; i < grid.dimensions.z; i++) {
			model.state.fields.forEach(f => this.add_layer(i, [f.name], 0));
		}

		this.columns = this.layers.length > 3 ? 3 : this.layers.length;
	}
		
    /**
     * Adds a layer to the grid configuration. A layer configuration determines how the layer will be drawn.
     * @param {number} z - The z value for the layer to draw.
     * @param {string[]} fields - An array of field names that will be drawn on the layer
     * @param {number} style - The index of the style used to draw the layer.
	 * @return {object} the layer configuration added
	 */
	add_layer(z, fields, style) {				
		var layer = new GridLayer({ 
			z:z, 
			fields:fields, 
			style:style, 
			position:this.layers.length 
		});
		
		this.layers.push(layer);
		
		return layer;
	}
	
    /**
     * Removes a layer from the grid configuration. A layer configuration determines how the layer will be drawn.
     * @param {object} layer - the layer configuration to remove
	 */
	remove_layer(layer) {
		var i = this.layers.indexOf(layer);
		
		this.layers.splice(i, 1);
		
		for (var i = 0; i < this.layers.length; i++) this.layers[i].position = i;
	}
	
    /**
     * Adds a style to the grid configuration.
     * @param {object[]} buckets - An array of classification buckets { start:number, end:number, color:[number,number,number]}.
     * @return {object} the style object 
	 * @todo style object should be made into a class
	 */
	add_style(style) {		
		this.styles.push(style);
		
		return style;
	}
	
    /**
     * Removes a style from the grid configuration.
     * @param {object} style - The style object to remove from the grid configuration.
	 * @todo style object should be made into a class
	 */
	remove_style(style) {
		var i = this.styles.indexOf(style);
		
		this.styles.splice(i, 1);
		
		this.layers.forEach(l => {
			if (l.style == i) l.style = 0;
		});
	}
}