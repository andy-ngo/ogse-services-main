
import Style from "../../tools/style.js";
import StaticScale from "./staticScale.js";

/** 
 * A scale style that varies according to the value of the geometry it is applied to
 **/
export default class BucketScale {

	/** 
	* Gets number of buckets for this style
	* @type {number} 
	*/
	get length() { return this.classes; }

    /**
     * @param {string} property - the property to use to apply classification
     * @param {number} classes - the number of scales to use for classification
     * @param {number[]} scale - a list of scale values
     * @param {string} type - the type of buckets (equivalent or quantile)
     * @param {number[]} buckets - a list of upper limits to use for classification
     * @param {number} zero - the colors to use for 0 value
	 * @todo classes and scale is confusing, let the user provide an array of scale values instead.
     */
	constructor(property, classes, scale, type, buckets, zero) {
		this.type = type;
		this.attribute = "scale";
		this.property = property;
		this.classes = classes;
		this.scale = scale;
		this.buckets = buckets || null;
		this.zero = zero || null;
	}
	
    /**
     * Retrieve the scale value for this object
	 * @param {number} value - the value used to determine the style
     * @return {number} the scale for this style
     */
	symbol(message) {
		var v = message.get_value(this.property);
		
		if (v == 0 && this.zero) return new ol.style.Fill({ color: this.zero });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return this.scale[i];
	}
	
    /**
     * Build from a json object
     * @return {BucketScale} the object built from json
     */
	static from_json(json) {
		if (json.type == "user-defined") var scale = json.scale;

		else var scale = Style.equivalent_buckets(json.min, json.max, json.classes);
		
		return new BucketScale(json.property, json.classes, scale, json.type, json.buckets, json.zero);
	}
	
    /**
     * Builds a default style for a scale
     * @return {StaticScale} a default style
     */
	static default_scale() {
		return new StaticScale(0.5);
	}
}