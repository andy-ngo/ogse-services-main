'use strict';

import List from '../../base/list.js';
import Model from './model.js';
import ModelCoupled from './model-coupled.js';
import SubcomponentCell from './subcomponent-cell.js';
import State from './state.js';
import Dimensions from './dimensions.js';

/**
 * Metadata coupled grid model element
 * @module metadata/model-grid
 * @extends Model
 */
export default class ModelGrid extends Model { 
	
	get subcomponent() { return this.json["subcomponent"]; }
	
	set subcomponent(value) { this.json["subcomponent"] = value; }
	
	get dimensions() { return this.json["dimensions"]; }
	
	set dimensions(value) { this.json["dimensions"] = value; }
	
	get state() { return this.json["state"]; }
	
	set state(value) { 
		this.json["state"] = value;
		
		this.state.message_type = this.message_type.get(this.state.message_type);
	}
	
	get index() { return this._index; }
	
    /**
     * @param {object} json - JSON used to initialize the object.
     */
	constructor(json) {
		super(json);
		
		this._index = []
		
		this.state = new State(json.state);
		this.dimensions = new Dimensions(json.dimensions);
		
		var subcomponents = this.subcomponent.map(j => new Subcomponent(j));
		this.subcomponent = new List(s => s.id);
		subcomponents.forEach(s => this.add_subcomponent(s));
	}
	
	add_subcomponent(subcomponent) {
		return this.subcomponent.add(subcomponent);
	}
		
	build_index(metadata, type) {		
		var id = 0;
		
		for (var x = 0; x < this.dimensions.x; x++) {
			this.index[x] = [];
			
			for (var y = 0; y < this.dimensions.y; y++) {
				this.index[x][y] = [];
			
				for (var z = 0; z < this.dimensions.z; z++) {
					var json = SubcomponentCell.make(`c-${id++}`, type, [x,y,z]);
					var cell = this.subcomponent.add(new SubcomponentCell(json));
					this.index[x][y][z] = metadata.models.add(cell);
				}
			}
		}
	}
	
	get_cell(x, y, z) {
		return this.index[x][y][z];
	}
	
	toJSON() {
		return {
			"identifier": this.id,
			"title": this.title,
			"port": this.ports,
			"state": this.state,
			"message type": this.message_type,
			"dimensions": this.dimensions
		}
	}
	
	static make(id, title, state, message_types, dimensions) {
		return {
			"identifier": id,
			"title": title,
			"port": [],
			"message type": message_types,
			"subcomponent": [],
			"state": state,
			"dimensions": dimensions
		};
	}
	/*
	static make(id, title, state, dimensions) {
		return new ModelGrid({
			"identifier": id,
			"title": title,
			"port": null,
			"message type": [state.message_type],
			"subcomponent": null,
			"state": state,
			"dimensions": dimensions
		});
	}
	*/
}