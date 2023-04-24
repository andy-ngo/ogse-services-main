import Core from './core.js';

/** 
 * A utility class that contains a series of basic functions for requests
 **/
export default class Net {
	// TODO: USE ASYNC AWAIT
	/**
	* builds a url string from a query object and base url
	* @param {string} base - the base URL
	* @param {object} query - a key, value map that will be converted to URL parameters
	* @return {string} the complete URL.
	*/
	static url(base, query) {
		var keys = Object.keys(query);
		
		var params = keys.length > 0 ? keys.map(k => `${k}=${query[k]}`).join("&") : null;
		
		return params ? `${base}?${params}` : base;
	}
	
	/**
	* Execute a web request using the fetch native API
	* @param {string} url - the URL to the file to read
	* @param {object} options - options to pass to the fetch request
	* @param {boolean} optional - indicates whether the file is optional or not. If optional, a 404
	* 							  error will not throw an error.
	* @return {promise} a promise resolved when the request is complete.
	*/
	static fetch(url, options, optional){
		var d = Core.defer();
		var p = fetch(url, options);
		
		p.then((response) => {
			if (response.status == 200) d.Resolve(response);
		
			else if (response.status > 399 && response.status < 500 && !!optional) d.Resolve(null);
			
			else d.Reject(new Error(`Url ${url} returned ${response.status} ${response.statusText}`));
		}, (error) => d.Reject(error));

		return d.promise;
	}
	
	/**
	* reads a blob object from a URL
	* @param {string} url - the URL to the file to read
	* @param {object} options - options to pass to the fetch request
	* @param {boolean} optional - indicates whether the file is optional or not. If optional, a 404
	* 							  error will not throw an error.
	* @return {promise} a promise resolved when the blob is retrieved.
	*/
	static fetch_blob(url, options, optional) {
		var d = Core.defer();
		
		this.fetch(url, options, optional).then(response => {
			if (response == null) d.Resolve(null);
			
			else response.blob().then(blob => d.Resolve(blob), error => d.Reject(error));
		}, error => d.Reject(error));
		
		return d.promise;
	}
	
	/**
	* reads a text from a URL
	* @param {string} url - the URL to the file to read
	* @param {object} options - options to pass to the fetch request
	* @param {boolean} optional - indicates whether the file is optional or not. If optional, a 404
	* 							  error will not throw an error.
	* @return {promise} a promise resolved when the text is retrieved.
	*/
	static fetch_text(url, options, optional) {
		var d = Core.defer();
		
		this.fetch(url, options, optional).then(response => {
			if (response == null) d.Resolve(null);
			
			else response.text().then(text => d.Resolve(text), error => d.Reject(error));
		}, error => d.Reject(error));
		
		return d.promise;
	}		
	
	/**
	* reads a json object from a URL
	* @param {string} url - the URL to the file to read
	* @param {object} options - options to pass to the fetch request
	* @param {boolean} optional - indicates whether the file is optional or not. If optional, a 404
	* 							  error will not throw an error.
	* @return {promise} a promise resolved when the json is retrieved.
	*/
	static json(url, options, optional) {
		var d = Core.defer();
		
		this.fetch(url, options, optional).then(response => { 
			if (response == null) d.Resolve(null);
			
			else response.json().then(json => d.Resolve(json), error => d.Reject(error));
		}, error => d.Reject(error));
		
		return d.promise;
	}

	/**
	* reads a remote file object from a URL
	* @param {string} url - the URL to the file to read
	* @param {string} name - the name of the file to read
	* @param {boolean} optional - indicates whether the file is optional or not. If optional, a 404
	* 							  error will not throw an error.
	* @return {promise} a promise resolved when the file is retrieved.
	*/
	static file(url, name, optional) {
		var d = Core.defer();
		
		Net.fetch_blob(url, null, optional).then(b => {			
			d.Resolve(b ? new File([b], name) : null);
		}, error => d.Reject(error));
		
		return d.promise;
	}
	
	/**
	* Get a parameter value from the document URL
	* @param {string} name - the name of the parameter to retrieve from the URL
	* @return {string} the value of the parameter from the URL, an empty string if not found
	*/
	static get_url_parameter (name) {				
		name = name.replace(/[\[\]]/g, '\\$&');
		
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
		
		var results = regex.exec(window.location.href);
		
		if (!results) return null;
		
		if (!results[2]) return '';
		
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
	
	/**
	* Download content as a file
	* @param {string} name - the name of the file to download
	* @param {string} content -	the content of the file to save
	*/
	static download(name, content) {
		var link = document.createElement("a");
		
		// link.href = "data:application/octet-stream," + encodeURIComponent(content);
		link.href = URL.createObjectURL(content);
		link.download = name;
		link.click();
		link = null;
	}
	
	/**
	* Gets the base URL for the app
	* @return {string} the base path to the web app
	*/
	static app_path() {
		var path = location.href.split("/");
		
		path.pop();
		
		return path.join("/");
	}
	
	/**
	* Gets the base URL for the app
	* @return {string} the base path to the file
	*/
	static file_path(file) {
		file = file.charAt(0) == "/" ? file.substr(1) : file;
		
		var path = [Net.app_path(), file];
				
		return path.join("/");
	}
}