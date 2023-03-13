'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Widget from '../base/widget.js';

/** 
 * A box element that allows users to drag and drop files
 **/
export default class BoxInputFiles extends Widget { 

	/**
	 * Set the label on the box-input
	 * @type {number[]}
	 */
	set label(value) { this.elems.label.innerHTML = value; }

	/**
	 * Set the icon on the box-input
	 * @type {number[]}
	 */
	set icon(value) { Dom.add_css(this.elems.icon, value); }
	
	/**
	 * Constructor for the Box input element. Follows the widget creation pattern.
	 * @param {object} container - div container
	 */	
	constructor(container) {
		super(container);
		
		this.files = [];
		
		this.elems.input.addEventListener("change", this.on_input_change.bind(this));
	}
	
	/**
	 * Create HTML for select element
	 * @returns {string} HTML for select element
	 */
	html() {
		return "<div class='box-input-files'>" +
				   "<div class='box-inner'>" +
					  "<label handle='label' class='top'>nls(Dropzone_Upload_Label)</label>" +
					  "<i handle='icon' class='fas fa-file-upload'></i>" +
					  "<input handle='input' type='file' multiple />" +
				   "</div>" +
				   "<div handle='files' class='files-container hidden'></div>" +
			   "</div>";
	}
	
	/**
	 * Update the box-input element with a set of files
	 * @param {File[]} newFiles - An array of files to assign to the box-input
	 */
	update(newFiles) {
		// Set css on condition of having files or not
		Dom.toggle_css(this.elems.files, "hidden", this.files.length == 0);
		
		var css = this.files.length > 0 ? "fas fa-thumbs-up" : "fas fa-exclamation-triangle";
		
		Dom.set_css(this.elems.icon, css);
		
		// Reload individual file boxes
		this.refresh(this.files);
	}
	
	/**
	 * Clears the files 
	 */
	clear() {
		this.files = [];
		
		this.refresh(this.files);
	}
	
	/**
	 * Refresh the box-input element, creates the files button below the box-input
	 * @param {File[]} files - An array of files to assign to the box-input
	 */
	refresh(files) {
		// load the individual file label buttons
		Dom.empty(this.elems.files);
				
		for (var i = 0; i < files.length; i++) {
			var options = { className:"file", title:this.nls("Dropzone_File_Title"), innerHTML:files[i].name };
			var lbl = Dom.create("label", options, this.elems.files);
			
			Dom.create("span", { className:"fa fa-times-circle" }, lbl);
			
			lbl.addEventListener("click", this.on_file_label_click.bind(this, lbl, files[i]));
		}
	}
	
	/**
	 * Handles click event on single file buttons
	 * removes the clicked file from the box-input selection
	 * @param {string} lbl - the label of the file
	 * @param {event} file - the file object to remove
	 * @param {event} ev - event object
	 */
	on_file_label_click(lbl, file, ev) {
		this.files.splice(this.files.indexOf(file), 1);
		
		this.elems.files.removeChild(lbl);
	}
	
	/**
	 * Handles input event on the box-input
	 * adds the file to the selection, shows the file button and bubbles the event externally
	 * @param {event} ev - event object
	 */
	on_input_change(ev) {
		for (var i = 0; i < ev.target.files.length; i++) {
			var exists = this.files.find(f => f.name === ev.target.files[i].name);
			
			if (!exists) this.files.push(ev.target.files[i]);
		}
		
		this.update(this.files);

		ev.target.value = null;

		this.emit("change", { files:this.files });
	}
	
	/**
	 * Defines the localized strings used in this component
	 * @param {Nls} nls - The nls object containing the strings
	 */
	localize(nls) {
		super.localize(nls);
		
		nls.add("Dropzone_Upload_Label", "en", "DRAG AND DROP<BR> FILES HERE");
		nls.add("Dropzone_Upload_Label", "fr", "GLISSER ET DÉPOSER<BR> LES FICHIERS ICI");
		nls.add("Dropzone_File_Title", "en", "Click to remove file");
		nls.add("Dropzone_File_Title", "fr", "Cliquer pour retirer le fichier");
	}
};

Core.templatable("Api.Widget.BoxInputFiles", BoxInputFiles);