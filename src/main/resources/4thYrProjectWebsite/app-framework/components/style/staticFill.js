
/** 
 * A static fill style without classification
 **/
export default class StaticFill {

    /**
     * @param {string} color - a string representing an RGBA color 
     */
	constructor(color) {
		this.type = "static";
		this.attribute = "fill";
		this.color = color;
	}
	
    /**
     * Build an OpenLayers style from this object
     * @return {ol.style.Fill} an OL style for fills
     */
	symbol() {
		return new ol.style.Fill({ color: this.color });
	}
	
    /**
     * Build from a json object
     * @return {StaticFill} the object built from json
     */
	static from_json(json) {
		return new StaticFill(json.color);
	}
}