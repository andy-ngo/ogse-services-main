'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Widget from '../../base/widget.js';
import Select from '../../ui/select.js';

export default Core.templatable("Widgets.GIS.VariableSelect", class GIS extends Widget { 
	
	get selected() { return this._selected; }
	
	get control() { return this._control; }
	
	constructor(node) {
		super(node);
		
		this._selected = {};
		
		this._control = new ol.control.Control({ element: this.elems.variable_select_container });
	}
	
	add_selectors(layers, variables) {
		// Add map widgets, some of them require everything to be ready		
		layers.forEach(l => {
			var filtered = variables.filter(s => s.layer.id == l.id);
			
			if (filtered.length == 0) return; 
			
			this.add_selector(l, filtered);
		});
	}
	
	add_selector(layer, variables) {
		var title = this.nls("title_variable_select")
		var select = new Select(this.elems.variable_select_container);
		
		variables.forEach((v, i) => {			
			select.add(v.name, null, { layer:layer, variable:v });
		});
		
		select.value = 0;

		this.selected[layer.id] = variables[0];
		
		select.on("change", this.on_variable_select_change.bind(this));
	}

	on_variable_select_change(ev){
		this.selected[ev.item.layer.id] = ev.item.variable;
		
		this.emit("change", { selected:this.selected });
	}
	
	html() {
		return "<div handle='variable_select_container' class='variable-select-container custom-control'>" + 
				   "<label>nls(label_variable_select)</label>" +
				"</div>";
	}
	
	localize(nls) {
		super.localize(nls);
		
		nls.add("label_variable_select", "en", "Select layer variables:");
		nls.add("label_variable_select", "fr", "Choisissez les variables:");
		nls.add("title_variable_select", "en", "Select a simulation variable to display on the map");
		nls.add("title_variable_select", "fr", "Choisissez une variable de simulation à afficher sur la carte");
	}
});