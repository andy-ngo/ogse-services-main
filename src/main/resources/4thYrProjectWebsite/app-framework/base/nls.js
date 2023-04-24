'use strict';

import Core from '../tools/core.js';

/**
 * Nls module, an object that holds multi lingual strings
 * @module base/Nls
 */
export default class Nls { 

	/**
	 * Constructor for the nls object
	 * @param {string} strings - an object containing the english and french strings. 
	 *							 each object should be { id:"", en:"", fr:"" }
	 */
	constructor(strings) {
		this.strings = {};
		
		if (!strings) return;
		
		strings.forEach(s => this.add(s[0], s[1], s[2]));
	}
	
	/**
	 * @description
	 * Get a localized nls string resource
	 * @param {String} id - the id of the nls resource to retrieve
	 * @param {Array} subs - an array of Strings to substitute in the localized nls string resource
	 * @param {String} locale - the locale for the nls resource (optional)
	 * @returns the localized nls string resource
	 */
	get(id, subs, locale) {
		if (!this.strings) throw new Error("Nls content not set.");
		
		var itm = this.strings[id];

		if (!itm) throw new Error("Nls String '" + id + "' undefined.");

		var txt = itm[(locale) ? locale : Core.locale];
		
		if (!txt) throw new Error("String does not exist for requested language.");

		return this.format(txt, subs);
	}
	
	/**
	 * @description
	 * Adds a localized string
	 * @param {String} id - the id of the nls resource to add
	 * @param {String} locale - the locale for the string added
	 * @param {String} string - the string to add
	 */
	add(id, locale, string) {
		if (!this.strings[id]) this.strings[id] = {};
		
		this.strings[id][locale] = string;
	}
		
	/**
	 * @description
	 * Formats a String using substitute string
	 * @param {String} str - The String to format
	 * @param {Array} subs - An array of Strings to substitute into the String
	 * @returns the formatted String
	 */
	format(str, subs) {
		if (!subs || subs.length == 0) return str;
		
		var s = str;

		for (var i = 0; i < subs.length; i++) {
			var reg = new RegExp("\\{" + i + "\\}", "gm");
			s = s.replace(reg, subs[i]);
		}

		return s;
	}
};
