
import StaticStroke from "./staticStroke.js";

/** 
 * A stroke style that varies according to the value of the geometry it is applied to
 **/
export default class BucketStroke {

	/** 
	* Gets number of buckets for this style
	* @type {number} 
	*/
	get length() { return this.colors.length; }
	
    /**
     * @param {string} property - the property to use to apply classification
     * @param {string[]} colors - a list of string RGBA colors, same length as width
     * @param {number[]} width - a list of stroke widths, in pixels, same length as colors
     * @param {string} type - the type of buckets (equivalent or quantile)
     * @param {number[]} buckets - a list of upper limits to use for classification
     * @param {number} zero - the colors to use for 0 value
     */
	constructor(property, colors, width, type, buckets, zero) {
		this.type = type;
		this.attribute = "stroke";
		this.property = property;
		this.colors = colors;
		this.width = width;
		this.buckets = buckets || null;
		this.zero = zero || null;
		
		// TODO: Doesn't support widths yet. Because it would have to support one or the other, or both.
	}
	
    /**
     * Build an OpenLayers style from this object
	 * @param {number} value - the value used to determine the style
     * @return {ol.style.Stroke} an OL style for strokes
     */
	symbol(message) {
		var v = message.get_value(this.property);
		
		if (v == 0 && this.zero) return new ol.style.Stroke({ color: this.zero,	width: this.width[0] });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return new ol.style.Stroke({ color: this.colors[i],	width: this.width[i] });
	}
	
    /**
     * Build from a json object
     * @return {BucketStroke} the object built from json
     */
	static from_json(json) {
		return new BucketStroke(json.property, json.colors, json.width, json.type, json.buckets, json.zero);
	}
	
    /**
     * Builds a default style for a stroke
     * @return {StaticStroke} a default style
     */
	static default_stroke() {
		return new StaticStroke('rgba(0,0,0,1)', 1);
	}
}