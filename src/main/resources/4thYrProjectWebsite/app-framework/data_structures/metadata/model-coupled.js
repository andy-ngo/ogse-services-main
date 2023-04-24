'use strict';

import List from '../../base/list.js';
import Model from './model.js';
import Subcomponent from './subcomponent.js';
import Coupling from './coupling.js';

/**
 * Metadata coupled model element
 * @module metadata/model-coupled
 * @extends Model
 */
export default class ModelCoupled extends Model { 
	
	get subcomponent() { return this.json["subcomponent"]; }
	
	set subcomponent(value) { this.json["subcomponent"] = value; }
	
	get coupling() { return this.json["coupling"]; }
	
	set coupling(value) { this.json["coupling"] = value; }
	
	get state() { return this.json["state"]; }
	
    /**
     * @param {object} json - JSON used to initialize the object.
     */
	constructor(json) {
		super(json);
		
		var subcomponents = this.subcomponent?.map(j => new Subcomponent(j));
		this.subcomponent = new List(s => s.id);
		subcomponents?.forEach(s => this.add_subcomponent(s));
		
		var couplings = this.coupling?.map(j => new Coupling(j));
		this.coupling = []
		couplings?.forEach(c => this.add_coupling(c));
	}
	
	add_subcomponent(subcomponent) {
		return this.subcomponent.add(subcomponent);
	}
	
	add_coupling(coupling) {
		this.coupling.push(coupling);
		
		return coupling;
	}
	
	static make(id, title) {
		return {
			"identifier": id,
			"title": title,
			"port": [],
			"message type": [],
			"subcomponent": [],
			"coupling": []
		};
	}
	/*
	static make(id, title) {
		return new ModelCoupled({
			"identifier": id,
			"title": title,
			"port": [],
			"message type": [],
			"subcomponent": [],
			"coupling": []
		});
	}*/
}