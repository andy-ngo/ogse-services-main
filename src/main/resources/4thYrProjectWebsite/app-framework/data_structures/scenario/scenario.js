'use strict';

import List from '../../base/list.js';
import JsonObject from '../../base/json-object.js';
import InstanceSet from './instances-set.js';
import CouplingSet from './couplings-set.js';

/**
 * Simulation scenario data structure
 * @module scenario/scenario
 * @extends JsonObject
 */
export default class Scenario extends JsonObject { 
	
	get instances() { return this.json["instances"]; }
	
	get couplings() { return this.json["couplings"]; }
	
    /**
     * @param {object} json - JSON used to initialize the object.
     */
	constructor(json) {
		super(json);
		
		this.json["instances"] = new List(i => i.id, this.instances?.map(j => new InstanceSet(j)));
		
		if (this.couplings) this.json["couplings"] = this.couplings.map(j => new CouplingSet(j));
	}
}