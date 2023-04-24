
import Style from "../../tools/style.js";

import BucketFill from "./bucketFill.js";
import BucketStroke from "./bucketStroke.js";
import BucketRadius from "./bucketRadius.js";

/** 
 * A style object for points
 **/
export default class Point {

	/** 
	* Gets the internal radius style
	* @type {StaticRadius|BucketRadius} 
	*/
	get radius() { return this._radius; }

	/** 
	* Gets the internal stroke style
	* @type {StaticStrokes|BucketStroke} 
	*/
	get stroke() { return this._stroke; }

	/** 
	* Gets the internal fill style
	* @type {StaticFill|BucketFill} 
	*/
	get fill() { return this._fill; }

	/** 
	* Gets the type of style (point)
	* @type {string} 
	*/
	get type() { return this._type; }

    /**
     * @param {StaticRadius|BucketRadius} radius - the radius style for a point
     * @param {StaticStroke|BucketStroke} fill - the fill style for a point
     * @param {StaticFill|BucketFill} stroke - the stroke style for a point
     */
	constructor(radius, fill, stroke) {
		this._type = "point";
		this._radius = radius;
		this._fill = fill;
		this._stroke = stroke;
	}
	
    /**
     * Builds style buckets, stores them on the class
	 * @param {object} stats - the simulation statistics
     * @todo maybe stats should be a class of its own rather than ad hoc
     */
	bucketize(stats) {
		Style.bucketize_style(this.radius, stats);
		Style.bucketize_style(this.fill, stats);
		Style.bucketize_style(this.stroke, stats);
	}
	
    /**
     * Build an OpenLayers style from this object
	 * @param {number} d - the value used to determine the style
     * @return {ol.style.Style} an OL style for points
     */
	symbol(d) {
		if (this.radius) {
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: this.radius.symbol(d),
					fill: this.fill.symbol(d),
					stroke: this.stroke.symbol(d)
				})
			});
		}
	}
	
    /**
     * Build from a json object
     * @return {Point} the object built from json
     */
	static from_json(json) {
		var radius = json.radius ? Style.radius_style_from_json(json.radius) : BucketRadius.default_radius();
		
		var fill = json.fill ? Style.fill_style_from_json(json.fill) : BucketFill.default_fill();
		
		var stroke = json.stroke ? Style.stroke_style_from_json(json.stroke) : BucketStroke.default_stroke();
		
		return new Point(radius, fill, stroke);
	}
}