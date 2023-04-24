
import StaticFill from "./staticFill.js";

/** 
 * A fill style that varies according to the value of the geometry it is applied to
 **/
export default class BucketFill {

	/** 
	* Gets number of buckets for this style
	* @type {number} 
	*/
	get length() { return this.colors.length; }

    /**
     * @param {string} property - the property to use to apply classification
     * @param {string[]} colors - a list of string RGBA colors, same length as width
     * @param {string} type - the type of buckets (equivalent or quantile)
     * @param {number[]} buckets - a list of upper limits to use for classification
     * @param {number} zero - the colors to use for 0 value
     */
	constructor(property, colors, type, buckets, zero) {
		this.type = type;
		this.attribute = "fill";
		this.property = property;
		this.colors = colors;
		this.buckets = buckets || null;
		this.zero = zero || null;
	}
	
    /**
     * Build an OpenLayers style from this object
	 * @param {number} value - the value used to determine the style
     * @return {ol.style.Fill} an OL style for polygons
     */
	symbol(message) {
		var v = message.get_value(this.property);
		
		if (v == 0 && this.zero) return new ol.style.Fill({ color: this.zero });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return new ol.style.Fill({ color: this.colors[i] });
	}
	
    /**
     * Build from a json object
     * @return {BucketFill} the object built from json
     */
	static from_json(json) {
		return new BucketFill(json.property, json.colors, json.type, json.buckets, json.zero);
	}
	
    /**
     * Builds a default style for a fill
     * @return {StaticFill} a default style
     */
	static default_fill() {
		return new StaticFill('rgba(50,100,200,0.6)');
	}
}