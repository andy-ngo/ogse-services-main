
/** 
 * A static scale style without classification
 **/
export default class StaticScale {

    /**
     * @param {number} scale - the scale to apply to the style
     */
	constructor(scale) {
		this.type = "static";
		this.attribute = "scale";
		this.scale = scale;
	}
	
    /**
     * Retrieve the scale value for this object
     * @return {number} the scale for this style
     */
	symbol() {
		return this.scale;
	}
	
    /**
     * Build from a json object
     * @return {StaticScale} the object built from json
     */
	static from_json(json) {
		return new StaticScale(json.scale);
	}
}