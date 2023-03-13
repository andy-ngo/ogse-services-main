
/** 
 * A static stroke radius without classification
 **/
export default class StaticRadius {

    /**
     * @param {number} radius - the radius to use for the point style
     */
	constructor(radius) {
		this.type = "static";
		this.attribute = "radius";
		this.radius = radius;
	}
	
    /**
     * Retrieve the radius value for this object
     * @return {number} the radius for this style
     */
	symbol() {
		return this.radius;
	}
	
    /**
     * Build from a json object
     * @return {StaticRadius} the object built from json
     */
	static from_json(json) {
		return new StaticRadius(json.radius);
	}
}