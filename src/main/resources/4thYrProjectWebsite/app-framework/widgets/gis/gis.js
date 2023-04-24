'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Style from '../../tools/style.js'
import Evented from '../../base/evented.js';

import Map from '../../components/ol/map.js'
import Legend from "../../components/ol/legend.js";
import Reader from "../../components/chunk-reader.js";

import Content from './popup-content.js';

export default class GIS extends Evented { 
	
	get popup() { return this.popup_content; }
	
	constructor(container, simulation, options) {
		super(container);
		
		this.simulation = simulation;
		this.options = options;
		
		var basemap1 = Map.basemap_osm(options.basemap == "openstreetmap");
		var basemap2 = Map.basemap_satellite(options.basemap == "satellite");
		
		this.map = new Map(container, [basemap1, basemap2]);
		
		Promise.all([this.map.ready(), this.get_layer_json()]).then(this.on_map_ready.bind(this));
		
		if (options.view) this.map.set_view(options.view.center, options.view.zoom);

		else this.map.set_view([-75.7, 45.3], 10);
		
		this.popup_content = new Content(this.map.popup.content);
	}
	
	show_popup(coordinates, features) {
		this.map.show_popup(null);
		
		if (features.length == 0) return;
		
		this.popup_content.fill(features);
		
		this.map.popup.setPosition(coordinates);
	}
	
	async on_map_ready(d, ev) {	
		// Load all geojson data layers contained in visualization.json
		this.options.layers.forEach(l => {			
			if (l.json) return this.load_layer_from_file(l);
			
			if (l.url) return this.load_layer_from_service(l);
		});

		// Prepare simulation styles, set first one as currently selected, 
		// update the variable selector to reflect the current property being coloured
		this.prepare_simulation_visualization();
		
		this.map.on("click", this.on_map_click.bind(this));
		
		this.emit("ready");
	}
	
	async get_layer_json() {
		return Promise.all(this.options.layers.map(async l => {
			if (!l.file) return;
			
			var f = this.options.files.geojson.find(f => f.name == l.file);
			
			if (!f) throw new Error(`File ${l.file} not provided in the visualization file.`);
			
			l.json = await Reader.read_as_json(f);
		}));
	}
		
	async load_layer_from_file(layer, position) {
		var j_style = this.options.styles.find(s => s.id == layer.style);
		var style = Style.from_json(layer.type, j_style);
		
		layer.json.name = layer.id;
		
		var l = this.map.add_geojson_layer(layer.id, layer.json, position);
		
		l.setStyle(style.symbol());
	}
	
	async load_layer_from_service() {
		// TODO: load from web service
		debugger;
	}
	
	prepare_simulation_visualization() {
		var stats = Style.statistics(this.simulation);
		
		this.options.variables.forEach(s => {
			s.layer = this.options.layers.find(l => l.id == s.layer);
			s.style = Style.from_json(s.layer.type, s);

			s.style.bucketize(stats);
		});
	}
	
	add_legend(variable){	
		if (this.legend) this.map.remove_control(this.legend.control);

		this.legend = new Legend(variable);
		
		for (var id in variable) this.legend.add_legend(variable[id]);
		
		this.map.add_control(this.legend.control);
	}

	add_layer_switcher() {
		var ls = new ol.control.LayerSwitcher({ groupSelectStyle: "group" });
		
		this.map.add_control(ls);
	}
	
	draw(variable, data) {		
		if (!this.map) return;
		
		for (var id in variable) {
			var features = this.map.layer_features(id);
			var v = variable[id];
			
			features.forEach(f => {
				var id = f.getProperties()[v.layer.join];
				var m = data[id];
				
				if (m != null) f.setStyle(v.style.symbol(m));
			});
		}
	}
	
	on_map_click(ev) {
		this.emit("click", { coordinates:ev.coordinates, features:ev.features });
	}
};