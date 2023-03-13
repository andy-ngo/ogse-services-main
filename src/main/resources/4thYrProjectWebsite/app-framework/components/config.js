import Net from "../tools/net.js";

/**
 * Config module, a base class that holds application configuration
 */
export class Config {
	/**                              
	 * Get the json object
	 */
	get json() { return this._json; }
	
	/**                              
	 * Set the json object
	 */
	get URLs() { return this.json.URLs; }
	
	/**                              
	 * Set the json object
	 */
	get logs() { return this.json["log-files"]; }
	
	/**
	 * Loads the configuration from a JSON file url
	 * @param {string} url - the url for the configuration file
	 */
	async load(url) {
		this._json = await Net.json(url);
		
		if (this !== _config) _config._json = this._json;
		
		this.configure();
	}
	
	/**
	 * Processes the configuration. This function is meant to be overwritten by inheritors.
	 */
	configure() {
		
	}
}

var _config = new Config();

export default _config;