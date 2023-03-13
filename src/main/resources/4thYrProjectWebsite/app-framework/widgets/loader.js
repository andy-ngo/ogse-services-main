'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Net from '../tools/net.js';
import Widget from '../base/widget.js';
import Reader from "../components/chunk-reader.js";
import BoxInputFiles from '../ui/box-input-files.js';
import Parser from '../parsers/parser.js';
import ParserCDpp from '../parsers/parserCDpp.js';
import ParserCadmium from '../parsers/parserCadmium.js';
import ParserOGSE from '../parsers/parserOGSE.js';
import ParserAidan from '../parsers/parserAidan.js';
import Simulation from '../data_structures/simulation/simulation.js';

export default Core.templatable("Api.Widget.Loader", class Loader extends Widget { 
		
	constructor(node) {		
		super(node);
		
		this.elems.parse.addEventListener("click", this.on_parse_button_click.bind(this));
		this.elems.clear.addEventListener("click", this.on_clear_button_click.bind(this));
		this.elems.dropzone.on("change", this.on_dropzone_change.bind(this));
	}
	
	update_button() {
		this.elems.parse.disabled = this.elems.dropzone.files.length == 0;
	}

	restore_ui() {
		Dom.add_css(this.elems.wait, "hidden");
		
		this.elems.parse.style.backgroundImage = null;
	}
	
	// Parsing, normal process:
	// 1. Get visualization json (either from file or service)
	// 2. Create configuration object from json (configuration-gis.js for example)
	// 3. Call load_files on configuration object.
	// 4. Create parser Object
	// 5. Call parse_metadata function on parser object
	// 6. Create simulation object from metadata
	// 7. Call parse_messages function on parser object
	// 8. call initialize on visualization object
	// 9. initialize simulation object
	async load(files) {
		try {			
			// returns visualization object and adds files to array
			var viz = await Parser.parse_visualization(files);
			
			if (viz) files = files.concat(await viz.load_files());
			
			if (ParserCadmium.detect(files)) var parser = new ParserCadmium(files);
			
			else if (ParserCDpp.detect(files)) var parser = new ParserCDpp(files);
			
			else if (ParserOGSE.detect(files)) var parser = new ParserOGSE(files);
			
			else if (ParserAidan.detect(files)) var parser = new ParserAidan(files);
			
			else throw new Error("Unable to detect simulation type (Cadmium, CDpp-Grid or OGSE).")
			
			await this.parse(parser, files, viz);
		}
		catch (error) {
			this.on_widget_error(error);
		}
	}
	
	async parse(parser, files, viz) {		
		parser.on("progress", this.on_parser_progress.bind(this));
		
		var metadata = await parser.parse_metadata();
		var simulation = new Simulation(metadata);
		var messages = await parser.parse_messages(simulation);
		
		if (!viz) viz = await parser.default_visualization();
		
		viz.initialize(parser.files, simulation);
		simulation.initialize(messages, viz.cache);
		
		this.restore_ui();

		this.emit("ready", { files: parser.files, simulation: simulation, viz: viz });		
	}
	
	on_parser_progress(ev) {		
		var c1 = "#198CFF";
		var c2 = "#0051A3";
		
		var bg = `linear-gradient(to right, ${c1} 0%, ${c1} ${ev.progress}%, ${c2} ${ev.progress}%, ${c2} 100%)`;
		
		this.elems.parse.style.backgroundImage = bg;		
	}
	
	on_dropzone_change(ev) {		
		this.update_button();
	}
		
	on_parse_button_click(ev) {
		Dom.remove_css(this.elems.wait, "hidden");
		
		this.load(this.elems.dropzone.files);
	}
	
	on_clear_button_click(ev) {
		this.elems.dropzone.clear();
		
		this.update_button();
	}
	
	on_widget_error(error) {
		this.restore_ui();
		
		this.error(error);
	}

	html() {
		return "<div class='loader-widget'>" +
				  "<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
			      "<div handle='dropzone' widget='Api.Widget.BoxInputFiles'></div>" +
				  "<div class='box-input-files'>" +
					 "<button handle='clear' class='clear'>nls(Loader_Clear)</button>" +
					 "<button handle='parse' class='parse' disabled>nls(Loader_Parse)</button>" +
			      "</div>" +
			   "</div>";
	}
	
	localize(nls) {
		super.localize(nls);
		
		nls.add("Loader_Clear", "en", "Clear");
		nls.add("Loader_Parse", "en", "Load simulation");
		nls.add("Dialog_Linker", "en", "This visualization uses an SVG diagram. Do you want to review the associations between the diagram and the structure file?");
	}
});
