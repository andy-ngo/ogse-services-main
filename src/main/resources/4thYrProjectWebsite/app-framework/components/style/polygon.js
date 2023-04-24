
import Style from "../../tools/style.js";
import BucketFill from "./bucketFill.js";
import BucketStroke from "./bucketStroke.js";

/** 
 * A style object for polygons
 **/
export default class Polygon {

	/** 
	* Gets the internal fill style
	* @type {StaticFill|BucketFill} 
	*/
	get fill() { return this._fill; }

	/** 
	* Gets the internal stroke style
	* @type {StaticStroke|BucketStroke} 
	*/
	get stroke() { return this._stroke; }

	/** 
	* Gets the type of style (polygon)
	* @type {string} 
	*/
	get type() { return this._type; }

    /**
     * @param {StaticFill|BucketFill} fill - the fill style for a polygon
     * @param {StaticStroke|BucketStroke} stroke - the stroke style for a polygon
     */
	constructor(fill, stroke) {
		this._type = "polygon";
		this._fill = fill;
		this._stroke = stroke;
	}
	
    /**
     * Builds style buckets, stores them on the class
	 * @param {object} stats - the simulation statistics
     * @todo maybe stats should be a class of its own rather than ad hoc
     */
	bucketize(stats) {
		Style.bucketize_style(this.fill, stats);
		Style.bucketize_style(this.stroke, stats);
	}
	
    /**
     * Build an OpenLayers style from this object
	 * @param {number} d - the value used to determine the style
     * @return {ol.style.Style} an OL style for polygons
     */
	symbol(d) {		
		return new ol.style.Style({
			stroke: this.stroke.symbol(d),
			fill: this.fill.symbol(d)
		});
	}
	
    /**
     * Build from a json object
     * @return {Polygon} the object built from json
     */
	static from_json(json) {		
		var fill = json.fill ? Style.fill_style_from_json(json.fill) : BucketFill.default_fill();
		
		var stroke = json.stroke ? Style.stroke_style_from_json(json.stroke) : BucketStroke.default_stroke();
		
		return new Polygon(fill, stroke);
	}
}