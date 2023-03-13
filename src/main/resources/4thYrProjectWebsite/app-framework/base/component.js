'use strict';

import Core from '../tools/core.js';
import Evented from './evented.js';
import Nls from './nls.js';

/**
 * Component module, a base class for localized and evented objects
 * @module base/Component
 * @extends Evented
 */
export default class Component extends Evented { 

	/**                              
	 * Get/set the nls object
	 */
	get nls() { return this._nls; }

	set nls(value) { this._nls = value; }

	/**
	 * Constructor for component object
	 */
	constructor() {
		super();
		
		this._nls = new Nls();
		
		this.localize(this._nls);
	}
	
	/**
	 * Add specified language strings to the nls object
	 * @param {object} nls - Existing nls object
	 */
	localize(nls) {
		return;
	}
	
	/**
	 * @description
	 * Get a localized nls string resource
	 * @param {object} id — the id of the nls resource to retrieve
	 * @param {array} subs - an array of Strings to substitute in the localized nls string resource
	 * @param {string} locale - the locale for the nls resource
	 * @returns - the localized nls string resource
	 */
	nls(id, subs, locale) {
		return this._nls.get(id, subs, locale);
	}
}