
import Style from "../../tools/style.js";

import BucketScale from "./bucketScale.js";

/** 
 * A style object for points using icons
 **/
export default class PointIcon {

	/** 
	* Gets the internal scale style for the icon
	* @type {StaticScale|BucketScale} 
	*/
	get scale() { return this._scale; }

	/** 
	* Gets the source string for the icon
	* @type {string} 
	*/
	get src() { return this._src; }

	/** 
	* Gets the type of style (point)
	* @type {string} 
	*/
	get type() { return this._type; }

    /**
     * @param {StaticScale|BucketScale}  scale - the scale style for a point icon
     * @param {string} src - the source string for the icon
     */
	constructor(scale, src) {
		this._type = "point";
		this._scale = scale;
		this._src = src;
	}
	
    /**
     * Builds style buckets, stores them on the class
	 * @param {object} stats - the simulation statistics
     * @todo maybe stats should be a class of its own rather than ad hoc
     */
	bucketize(stats) {
		Style.bucketize_style(this.scale, stats);
	}
	
    /**
     * Build an OpenLayers style from this object
	 * @param {number} d - the value used to determine the style
     * @return {ol.style.Style} an OL style for points icons
     */
	symbol(d) {		
		return new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 0.5],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				scale: this.scale.symbol(d),
				offset: [0,0],
				opacity: 1,
				src: this.src
			})
		});
	}
		
    /**
     * Build from a json object
     * @return {PointIcon} the object built from json
     */
	static from_json(json) {
		if (!json.src) {
			throw new Error("Cannot create a default point icon style. It must be created from json.");
		}
		
		var scale = json.scale ? Style.scale_style_from_json(json.scale) : BucketScale.default_scale();
		
		return new PointIcon(scale, json.src);
	}
}