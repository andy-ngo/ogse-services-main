'use strict';

import Subcomponent from './subcomponent.js';
import Model from './model.js';

/**
 * Metadata subcomponent-cell element for coupled models
 * @module metadata/subcomponent
 * @extends JsonObject
 */
export default class SubcomponentCell extends Subcomponent { 
	
	get coords() { return this.json["coords"]; }
	
	get x() { return this.coords[0]; }
	
	get y() { return this.coords[1]; }
	
	get z() { return this.coords[2]; }
	
	toJSON() {
		return {
			"identifier": this.id,
			"model type": this.type.id,
			"coords": this.coords
		}
	}

	static make(id, type_id, coords) {
		return {
			"identifier": id,
			"model type": type_id,
			"coords": coords
		};
	}
}