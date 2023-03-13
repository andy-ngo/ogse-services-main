'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Widget from '../../base/widget.js';
import Select from '../../ui/select.js';
import Fields from './fields.js';

export default Core.templatable("Api.Widget.Palette.Layers", class Layers extends Widget { 
	
	set settings(value) { this._settings = value; }
	
	get settings() { return this._settings; }

	constructor(id) {
		super(id);
		
		this.items = null;
		
		this.elems.addLayer.addEventListener("click", this.on_button_add_layer_click.bind(this));
	}
	
	refresh() {
		this.items.forEach(item => {
			item.style.empty();
			
			this.settings.styles.forEach((style, i) => {
				item.style.add(i, null, i);
		
				item.style.select((s, i) => i == item.data.style);
			});
		});
	}
	
	initialize(grid, settings) {	
		this.items = [];
		
		this.grid = grid;
		this.settings = settings;
		
		this.settings.layers.forEach((l) => this.add_layer(l));
	}
	
	add_layer(l) {
		var item = {}
		
		item.data = l;
		item.row = Dom.create("tr", { className:"table-row" }, this.elems.body);		
		item.z = this.add_z(item, this.grid.dimensions.z);
		item.fields = this.add_fields(item, this.grid.state.fields);
		item.style = this.add_style(item, this.settings.styles);
		item.btnDelete = this.add_delete_button(item);
		
		this.items.push(item);
	}
	
	remove_layer(item) {
		var i = this.items.indexOf(item);
		
		this.items.splice(i, 1);
	}
	
	add_z(item, max) {
		var td = Dom.create("td", { className:"grid-z"}, item.row);
		var select = new Select(td);

		for (var i = 0; i < max; i++) select.add(i, null, i);
		
		select.select(s => s == item.data.z);
		
		select.on("change", ev => {
			item.data.z = ev.item;
			
			this.settings.set("layers", this.settings.layers);
		})
		
		return select;
	}
	
	add_fields(item, fields) {
		var td = Dom.create("td", { className:"grid-fields"}, item.row);
		
		var select = new Fields(td);
		
		select.available = fields;
		
		select.select(item.data.fields);
		
		select.on("change", ev => {
			item.data.fields = ev.target.value;
			
			this.settings.set("layers", this.settings.layers);
		})
		
		return select;
	}
		
	add_style(item, styles) {
		var td = Dom.create("td", { className:"grid-styles"}, item.row);
		
		var select = new Select(td);

		styles.forEach((s, i) => select.add(i, null, s));
		
		select.select((s, i) => i == item.data.style);
		
		select.on("change", ev => {
			item.data.style = styles.indexOf(ev.item);
			
			this.settings.set("layers", this.settings.layers);
		})
		
		return select;
	}
	
	add_delete_button(item) {
		var td = Dom.create("td", { className:"grid-delete"}, item.row);
		var btn = Dom.create("button", { className:"table-button button-delete image-button" }, td);
		var img = Dom.create("img", { className:"image-icon", src:"./assets/delete.png", title:this.nls("Settings_Layers_Delete_Title") }, btn);
		
		btn.addEventListener('click', this.on_button_delete_click.bind(this, item));
		
		return btn;
	}
	
	on_button_add_layer_click(ev) {
		var layer = this.settings.add_layer(0, this.grid.state.fields, 0);
		
		this.add_layer(layer);
		
		this.elems.layers.scrollTop = this.elems.layers.scrollHeight;
		
		this.settings.set("layers", this.settings.layers);
	}
		
	on_button_delete_click(item, ev) {		
		this.settings.remove_layer(item.data);
		
		this.remove_layer(item);
		
		item.row.remove();
		
		this.items.forEach((item, i) => item.data.i = i + 1);
		
		this.settings.set("layers", this.settings.layers);
	}		
	
	html() {
		return  "<div handle='layers' class='layers-widget'>" + 
				   "<table>" + 
					  "<thead>" +
						 "<tr>" + 
							"<td class='col-1'>nls(Settings_Layers_Z)</td>" +
							"<td class='col-2'>nls(Settings_Layers_Fields)</td>" +
							"<td class='col-3'>nls(Settings_Layers_Styles)</td>" +
							"<td class='col-4'></td>" +
						 "</tr>" +
					  "</thead>" + 
					  "<tbody handle='body'></tbody>" + 
					  "<tfoot handle='foot'>" + 
						 "<tr>" + 
							"<td class='col-1'></td>" +
							"<td class='col-2'></td>" +
							"<td class='col-3'></td>" +
							"<td class='col-4'>" + 
							   "<button handle='addLayer' class='table-button image-button' title='nls(Settings_Layers_Add_Title)'>" + 
								  "<img src='./assets/add.png' class='image-icon'/>" +
							   "</button>" +								
							"</td>" +
						 "</tr>" +
					  "</tfoot>" + 
				   "</table>" + 
				"</div>";
	}
	
	localize(nls) {
		super.localize(nls);
		
		nls.add("Settings_Layers_Z", "en", "Z");
		nls.add("Settings_Layers_Fields", "en", "Fields");
		nls.add("Settings_Layers_Styles", "en", "Style");
		nls.add("Settings_Layers_Add_Title", "en", "Add another grid to the visualization");
		nls.add("Settings_Layers_Delete_Title", "en", "Remove grid no from visualization");
	}
});