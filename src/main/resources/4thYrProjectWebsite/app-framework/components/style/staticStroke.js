
/** 
 * A static stroke style without classification
 **/
export default class StaticStroke {

    /**
     * @param {string} color - a string representing an RGBA color 
     * @param {number} width - the stroke width, in pixels
     */
	constructor(color, width) {
		this.type = "static";
		this.attribute = "stroke";
		this.color = color;
		this.width = width;
	}
	
    /**
     * Build an OpenLayers style from this object
     * @return {ol.style.Stroke} an OL style for strokes
     */
	symbol() {
		return new ol.style.Stroke({ color: this.color,	width: this.width });
	}
	

    /**
     * Build from a json object
     * @return {StaticStroke} the object built from json
     */
	static from_json(json) {
		return new StaticStroke(json.color, json.width);
	}
}