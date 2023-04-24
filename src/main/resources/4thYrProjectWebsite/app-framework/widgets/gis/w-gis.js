'use strict';

import Core from '../../tools/core.js';
import Net from '../../tools/net.js';
import Dom from '../../tools/dom.js';
import Style from '../../tools/style.js'
import Reader from '../../components/chunk-reader.js';
import AppConfig from '../../components/config.js';
import Widget from '../../base/widget.js';
import VariableSelect from './variable-select.js';
import GIS from './gis.js';

export default Core.templatable("Api.Widget.GIS", class wGIS extends Widget { 

	get canvas() { return this.elems.map.querySelector(".ol-layer").firstChild; }
	
	get current() { return this.elems.variable_select.selected; }
	
	constructor(node, simulation, options, files) {
		super(node);
		
		this.simulation = simulation;
		this.options = options;
		this.files = files;
		this.selected = [];
		
		this.gis = new GIS(this.elems.map, simulation, options);

		this.gis.popup.get_content = this.get_content.bind(this);
		
		this.gis.on("ready", this.on_gis_ready.bind(this));
		this.gis.on("click", this.on_gis_click.bind(this));
	}
	
	select_features(features) {		
		this.selected = features.filter(f => !!this.current[f.layer]);
		
		this.selected.forEach(s => {
			// TODO: There's an issue here, highlight style has to be geometry type specific.
			var json = this.options.styles.find(s => s.id == "highlight");
			var type = s.feature.getGeometry().getType().toLowerCase();
			var style = Style.get_style(type, json);
		
			s.feature.setStyle(style);
		});
	}
	
	reset_selected() {
		this.selected.forEach(s => {
			var variable = this.current[s.layer];
			
			if (!variable) return;
			
			var id = s.feature.getProperties()[variable.layer.join];
			var model = this.simulation.models.get(id);
			var data = this.simulation.state.get_message(model);
			var style = variable.style.symbol(data);
			
			s.feature.setStyle(style);
		});
	}
	
	get_content(s) {		
		var variable = this.current[s.layer];
		
		if (!variable) return;
		
		// state messages
		var props = s.feature.getProperties();
		var id = props[variable.layer.join];
		var model = this.simulation.models.get(id);
		var data = this.simulation.state.get_message(model).templated;
		
		var root = Dom.create("div");
		var div = Dom.create("div", { className:"title", innerHTML:variable.layer.label }, root);
		var ul = Dom.create("ul", { className:"properties" }, root);
		var li = Dom.create("li", { innerHTML:"Attributes" }, ul);
		
		variable.layer.fields.forEach(f => Dom.create("li", { innerHTML: `${f}: ${props[f]}` }, ul))
	
		var ul = Dom.create("ul", { className:"state-message" }, root);
		var li = Dom.create("li", { innerHTML:"State" }, ul);

		for (var p in data) Dom.create("li", { innerHTML: `${p}: ${data[p]}` }, ul);
		
		// var line = `<div class='title'>${variable.layer.label}</div>`;
		
		// line += `<ul class='properties'><li>Attributes</li>`;
		
		// variable.layer.fields.forEach(f => line += `<li>${f}: ${props[f]}</li>`);
		
		// line += `</ul>`;
		// line += `<ul class='state-message'><li>State</li>`;
		
		// for (var p in data) line += `<li>${p}: ${data[p]}</li>`
		
		// line += `</ul>`;
		
		// output messages
		/*
		var tY = this.simulation.current_frame.output_messages.filter(t => t.model.id == id);
		
		tY.forEach(t => {
			line += `<ul class='output-message'><li>Output</li>`;
			
			var data = t.templated;
			
			for (var p in data) line += `<li>${p}: ${data[p]}</li>`
			
			line += `</ul>`;
		});
		*/
		return root;
	}
	
	
	async on_gis_ready() {				
		// Add variable-select widget
		this.elems.variable_select.add_selectors(this.options.layers, this.options.variables);
		this.elems.variable_select.on("change", this.on_variable_select_change.bind(this));
		
		this.gis.map.add_control(this.elems.variable_select.control);
		
		this.gis.draw(this.current, this.simulation.state.messages);
		
		this.gis.add_legend(this.current);
		this.gis.add_layer_switcher();
		
		this.simulation.on("next", this.on_simulation_move.bind(this));
		this.simulation.on("previous", this.on_simulation_move.bind(this));
		this.simulation.on("jump", this.on_simulation_jump.bind(this));
		
		this.emit("ready", { view:this });
	}
	
	on_gis_click(ev) {
		this.reset_selected();
		this.select_features(ev.features);
		
		this.gis.show_popup(ev.coordinates, this.selected);
	}
	
	on_variable_select_change(ev){		
		this.gis.draw(this.current, this.simulation.state.messages);

		this.gis.add_legend(this.current);
	}
	
	on_simulation_jump(ev) {
		this.gis.draw(this.current, this.simulation.state.messages);
	}
	
	on_simulation_move(ev) {
		var data = {};
		
		ev.frame.state_messages.forEach(t => data[t.model.id] = t);
		
		this.gis.draw(this.current, data);
	}
	
	html() {
		return "<div class='map-container'>" + 
				   "<div handle='map' class='map'></div>" +
				   "<div handle='variable_select' widget='Widgets.GIS.VariableSelect'></div>" +
			   "</div>";
	}
});