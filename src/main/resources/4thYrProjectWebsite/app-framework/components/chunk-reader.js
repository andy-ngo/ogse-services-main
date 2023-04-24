'use strict';

import Core from '../tools/core.js';
import Evented from '../base/evented.js';

const CHUNK_SIZE = 8388608;

/**
 * A component that can read files by chunks. It wraps a FileReader object.
 */
export default class Reader extends Evented { 
	
	constructor () {
		super();
		
		this.fileReader = new FileReader();
		this.defer = null;
	
		this.fileReader.addEventListener("loadend", this.on_load_end.bind(this));
		this.fileReader.addEventListener("error", this.on_load_error.bind(this));
	}
	
	/**
	 * Read a file asynchronously, meant to be private.
	 * @param {File} file - the file to read
	 * @return {promise} a promise, resolved when the file is read
	 */	
	promise_read(file) {
		if (this.defer) throw new Error("FileReader is in use");
		
		this.defer = Core.defer();
		
		// let start = reverse ? file.size - CHUNK_SIZE : 0;
        // let end = reverse ? file.size : CHUNK_SIZE;
        // let slice = file.slice(start, end);
		
		// TODO: readAsArrayBuffer is better for large files supposedly
		this.fileReader.readAsText(file);
		// this.fileReader.readAsArrayBuffer(file);
		
		return this.defer.promise;
	}
	
	/**
	 * Handles the load event on the internal FileReader object
	 * Resolves the promise for the chunk reader
	 * @param {event} ev - event object
	 */
	on_load_end(ev) {
		var resolve = this.defer.Resolve;
		
		this.defer = null;
		
		resolve(this.fileReader.result);
	}

	/**
	 * Handles errors on the FileReader object
	 * @param {event} ev - event object
	 */
	on_load_error(ev) {		
		// TODO: This never triggers, example, bad visualization.json file
		var reject = this.defer.Reject;
		
		this.defer = null;
		
		reject(new Error("Unable to read the file."));
	}
	
	/**
	 * Read a file asynchronously, processes the file using a delegate function.
	 * @param {File} file - the file to read
	 * @param {Function} delegate - the delegate used to process the response
	 * @return {promise} a promise, resolved when the file is read
	 */	
	read(file, delegate) {
		var d = Core.defer();
		
		if (!file) return d.Resolve(null);
		
		this.promise_read(file).then(function(result) {
			try {			
				d.Resolve(delegate(result));
			}
			catch(ex) {
				d.Reject(ex);
				
				throw(ex);
			}
		}, (error) => { d.Reject(error); });

		return d.promise;
	}
	
	/**
	 * Read a file asynchronously as json
	 * @param {File} file - the file to read
	 * @return {promise} a promise, resolved when the file is read
	 */	
	read_as_json(file) {
		return this.read(file, json => JSON.parse(json));
	}
	
	/**
	 * Read a file asynchronously as text
	 * @param {File} file - the file to read
	 * @return {promise} a promise, resolved when the file is read
	 */	
	read_as_text(file) {
		return this.read(file, text => text);
	}
	
	/**
	 * Read a file asynchronously by chunks, processes content line by line using 
	 * a delegate, incomplete lines are left to the next chunk.
	 * @param {File} file - the file to read
	 * @param {string} split - the line delimiter string
	 * @param {function} delegate - the function used to process each line
	 * @return {promise} a promise, resolved when the file is completely read
	 * @todo this does too many things. There should be one function for chunking
	 *		 processing line by line shouldn't be here.
	 */	
	read_by_chunk(file, split, delegate) {
		var position = 0;
		var d = Core.defer();
		var read = null;
		
		if (!file) return d.Resolve(null);
		
		var ReadChunk = (size) => {
			var chunk = file.slice(position, position + size);
		
			this.promise_read(chunk).then((result) => {
				var idx = size > result.length ? result.length - 1 : result.lastIndexOf(split);
				var content = result.substr(0, idx);
				
				position += content.length + 1;
				
				try {
					read = delegate(read, content, 100 * position / file.size);
				}
				catch (error) {
					d.Reject(error);
				}
				
				if (position < file.size) ReadChunk(size);
				
				else if (position == file.size) d.Resolve(read);
				
				else d.Reject(new Error("Reader position exceeded the file size."));
			});
		}
		
		ReadChunk(CHUNK_SIZE);
		
		return d.promise;
	}
	
	/**
	 * Read a file asynchronously, processes the file using a delegate function. 
	 * This function is static to avoid instantiating the chunk reader.
	 * @param {File} file - the file to read
	 * @param {Function} delegate - the delegate used to process the response
	 * @return {promise} a promise, resolved when the file is read
	 */	
	static Read(file, delegate) {
		var reader = new Reader();
	
		return reader.read(file, delegate);
	}
	
	/**
	 * Read a file asynchronously by chunks, processes content line by line using 
	 * a delegate, incomplete lines are left to the next chunk.
	 * This function is static to avoid instantiating the chunk reader.
	 * @param {File} file - the file to read
	 * @param {string} split - the line delimiter string
	 * @param {function} delegate - the function used to process each line
	 * @return {promise} a promise, resolved when the file is completely read
	 * @todo this does too many things. There should be one function for chunking
	 *		 processing line by line shouldn't be here.
	 */	
	static read_by_chunk(file, split, delegate) {
		var reader = new Reader();
	
		return reader.read_by_chunk(file, split, delegate);
	}
	
	/**
	 * Read a file asynchronously as json
	 * This function is static to avoid instantiating the chunk reader.
	 * @param {File} file - the file to read
	 * @return {promise} a promise, resolved when the file is read
	 */	
	static read_as_json(file) {
		var reader = new Reader();
		
		return reader.read_as_json(file);
	}
	
	/**
	 * Read a file asynchronously as text
	 * This function is static to avoid instantiating the chunk reader.
	 * @param {File} file - the file to read
	 * @return {promise} a promise, resolved when the file is read
	 */	
	static read_as_text(file) {
		var reader = new Reader();
		
		return reader.read_as_text(file);
	}
}