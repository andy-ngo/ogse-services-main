'use strict';

/**
 * List module. An array extension with an index for finding items easily.
 * @module base/List
 */
export default class List extends Array { 
	/**                              
	 * Get/set the indexing function
	 */
	set fn_key(value) { this._fn_key = value; }
	get fn_key() { return this._fn_key; }

	/**                              
	 * Get/set the index associated to the list
	 */
	set index(value) { this._index = value; }
	get index() { return this._index; }

	/**                              
	 * Get the first item in the list
	 */
	get first() { return this[0]; }

	/**                              
	 * Get the last item in the list
	 */
	get last() { return this[this.length - 1]; }

	/**
	 * Constructor for list object
	 * @param {function} fn_key - indexing function for the list
	 * @param {array} items - items in the list
	 */
	constructor(fn_key, items) {
		super();

		this.fn_key = fn_key;
		this.index = {};
		
		if (items) items.forEach(i => this.add(i));
	}

	/**
	 * @description
	 * Adds an item to the list
	 * @param {object} item - an item to add to the list
	 * @returns {object} the added item or the preexisting item 
	 */
	add(item) {
		if (!this.fn_key) {
			this.push(item);
			
			return item;
		}
		
		var key = this.fn_key(item);
		
		if (!this.has_key(key)) {
			this.index[key] = item;
			this.push(item);
		} 

		return this.index[key];
	}
	
	set(key, value) {
		this.index[key] = value;
	}
	
	/**
	 * @description
	 * Removes an item from the list
	 * @param {object} item - an item to remove from the list
	 * @returns {object} the removed item
	 */
	remove(item) {		
		var key = this.fn_key(item);
		var idx = this.get_index(key);
		var g = this[idx];
		
		this.splice(idx, 1);
		delete(this.index[key]);
		
		return g;
	}

	/**
	 * @description
	 * Gets an item from the list
	 * @param {string} key - the key of the item to retrieve
	 * @returns {object} the item if found, null otherwise
	 */
	get(key) {
		return this.index[key] || null;
	}
	
	/**
	 * @description
	 * Gets the index of an item from the list
	 * @param {object} item - the item for which to retrieve the index
	 * @returns {number} the index of the item found, -1 otherwise
	 */
	get_index(key) {		
		return this.indexOf(this.index[key]);
	}

	/**
	 * @description
	 * Checks if the list contains an item
	 * @param {object} item - the item to check
	 * @returns {boolean} true if the item is found, false otherwise
	 */
	has(item) {
		var key = this.fn_key(item);

		return this.has_key(key);
	}

	/**
	 * @description
	 * Checks if the list contains an item key
	 * @param {string} key - the key to look for
	 * @returns {boolean} true if the item is found, false otherwise
	 */
	has_key(key) {
		return key in this.index;
	}

	/**
	 * @description
	 * Rebuilds the index for the list, this may be necessary after mapping the list.
	 * @param {function} fn_key - the function used to build the index
	 * @returns {boolean} true if the item is found, false otherwise
	 */
	reindex(fn_key) {
		debugger;
		this.index = {};
		this.fn_key = fn_key;
		
		for (var i = 0; i < this.length; i++) {
			var key = this.fn_key[this[i]];
			
			this.index[key] = this[i];
		}
		
		return this;
	}
	
	/**
	 * @description
	 * Maps the list to another list using a delegate function
	 * @param {function} fn_map - the function used to map the list
	 * @returns {object} the new list
	 */
	map(fn_map) {
		return new List(null, super.map(fn_map));
	}
	
	/**
	 * @description
	 * Filters the list to another list using a delegate function
	 * @param {function} fn_filter - the function used to filter the list
	 * @returns {object} the new list
	 */
	filter(fn_filter) {
		return new List(this.fn_key, super.filter(fn_filter));
	}
		
	/**
	 * @description
	 * Sorts the list in place using a delegate function in ascending or descending order
	 * @param {function} fn_value - the function used to get the values to sort
	 * @param {boolean} ascending - true to sort in ascending order, false for descending
	 */
	sort(fn_value, ascending) {		
		super.sort((a, b) => {
			var vA = fn_value(a);
			var vB = fn_value(b);
			
			if (vA == vB) return 0;
			if (vA == null) return 1;
			if (vB == null) return -1;
			
			if (ascending) return vA > vB ? 1 : -1;
			
			else return vA > vB ? -1 : 1;
		});
	}
}