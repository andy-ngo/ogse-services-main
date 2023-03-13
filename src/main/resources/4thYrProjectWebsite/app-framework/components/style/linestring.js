
import Style from "../../tools/style.js";

import BucketStroke from "./bucketStroke.js";

/** 
 * A style object for linestrings
 **/
export default class Linestring {

	/** 
	* Gets the internal stroke style
	* @type {StaticStroke|BucketStroke} 
	*/
	get stroke() { return this._stroke; }

	/** 
	* Gets the type of style (linestring)
	* @type {string}
	*/
	get type() { return this._type; }

    /**
     * @param {StaticStroke|BucketStroke} stroke - the stroke style for a linestring
     */
	constructor(stroke) {
		this._type = "linestring";
		this._stroke = stroke;
	}
	
    /**
     * Builds style buckets, stores them on the class
	 * @param {object} stats - the simulation statistics
     * @todo maybe stats should be a class of its own rather than ad hoc
     * @todo unimplemented
     */
	bucketize(stats) {

	}
	
    /**
     * Build an OpenLayers style from this object
	 * @param {number} d - the value used to determine the style
     * @return {ol.style.Style} an OL style for strokes
     */
	symbol(d) {
		return new ol.style.Style({
			stroke: this.stroke.symbol(d)
		});
	}
	
    /**
     * Build from a json object
     * @return {Linestring} the object built from json
     */
	static from_json(json) {		
		var stroke = json.stroke ? Style.stroke_style_from_json(json.stroke) : BucketStroke.default_stroke();
		
		return new Linestring(stroke);
	}
}