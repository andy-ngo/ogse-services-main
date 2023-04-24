
import Style from "../../tools/style.js";
import StaticRadius from "./staticRadius.js";

/** 
 * A radius style that varies according to the value of the geometry it is applied to
 **/
export default class BucketRadius {

	/** 
	* Gets number of buckets for this style
	* @type {number} 
	*/
	get length() { return this.classes; }

    /**
     * @param {string} property - the property to use to apply classification
     * @param {number} classes - the number of radii to use for classification
     * @param {number[]} radius - a list of radius values
     * @param {string} type - the type of buckets (equivalent or quantile)
     * @param {number[]} buckets - a list of upper limits to use for classification
     * @param {number} zero - the colors to use for 0 value
	 * @todo classes and radius is confusing, let the user provide an array of radius values instead.
     */
	constructor(property, classes, radius, type, buckets, zero) {
		this.type = type;
		this.attribute = "radius";
		this.property = property;
		this.classes = classes;
		this.radius = radius;
		this.buckets = buckets || null;
		this.zero = zero || null;
	}
	
    /**
     * Retrieve the radius value for this object
	 * @param {number} value - the value used to determine the style
     * @return {number} the radius for this style
     */
	symbol(message) {
		var v = message.get_value(this.property);
		
		if (v == 0 && this.zero) return new ol.style.Fill({ color: this.zero });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return this.radius[i];
	}
	
    /**
     * Build from a json object
     * @return {BucketRadius} the object built from json
     */
	static from_json(json) {
		if (json.type == "user-defined") var radius = json.radius;

		else var radius = Style.equivalent_buckets(json.min, json.max, json.classes);
		
		return new BucketRadius(json.property, json.classes, radius, json.type, json.buckets, json.zero);
	}
	
    /**
     * Builds a default style for a radius
     * @return {StaticRadius} a default style
     */
	static default_radius() {
		return new StaticRadius(4);
	}
}