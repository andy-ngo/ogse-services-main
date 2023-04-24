'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Evented from '../../base/evented.js';
import ModelGrid from '../../data_structures/metadata/model-grid.js';

const STROKE_WIDTH = 2;
const DEFAULT_COLOR = "#fff";

export default Core.templatable("Api.Widget.Grid", class Grid extends Evented { 
	
	set canvas(value) { this._canvas = value; }
	get canvas() { return this._canvas; }
	
	get context() { return this.canvas.getContext("2d"); }
	
	set model(value) { this._model = value; }
	get model() { return this._model; }
	
	get styler() { return this._styler; }
	set styler(value) { this._styler = value; }

	get dimensions() { return this.model.dimensions; }
	get columns() { return this.options.columns; }
	get rows() { return Math.ceil(this.n_grids / this.columns); }
	get spacing() { return this.options.spacing; }
	get styles() { return this.options.styles; }
	get width() { return this.options.width; }
	get height() { return this.options.height; }
	get layers() { return this.options.layers; }
	get aspect() { return this.options.aspect; }
	get n_grids() { return this.layers.length || this.dimensions.z; }

	set cell_height(value) { this._cell_height = value; }
	get cell_height() { return this._cell_height; }
	
	set cell_width(value) { this._cell_width = value; }
	get cell_width() { return this._cell_width; }
	
	set index(value) { this._index = value; }
	get index() { return this._index; }

	constructor(container, simulation, options) {
		super();
		
		this.options = options;
		this.model = simulation.grid_types[0];
		this.canvas = Dom.create("canvas", null, container);

		this.canvas.addEventListener("mousemove", this.on_canvas_mousemove.bind(this));
		this.canvas.addEventListener("mouseout", this.on_canvas_mouseout.bind(this));

		this.update_layers(options.layers);
	}
	
	update_layers(layers) {
		var index = {};
		
		layers.forEach((l, i) => {			
			if (!index[l.z]) index[l.z] = {};
			
			l.fields.forEach(f => {
				if (!index[l.z][f]) index[l.z][f] = [];
				
				index[l.z][f].push(l);
			});
		});
		
		this.index = index;
	}
	
	resize() {
		// var size = Dom.geometry(this.canvas);
		var size = this.get_canvas_size(this.options);

		// Size of one layer drawn, only used to determine cell size, shouldn't be used after
		var layer_width = (size.width - (this.columns * this.spacing - this.spacing)) / this.columns;
		var layer_height = (size.height - (this.rows * this.spacing - this.spacing)) / this.rows;
		
		this.cell_width = Math.floor(layer_width / this.dimensions.x);
		this.cell_height = Math.floor(layer_height / this.dimensions.y);
		
		// Total effective size of drawing space 
		var total_width = (this.cell_width * this.dimensions.x) * this.columns + this.columns * this.spacing - this.spacing;
		var total_height = (this.cell_height * this.dimensions.y) * this.rows + this.rows * this.spacing - this.spacing;

		// Redefine with and height to fit with number of cells and cell size
		this.canvas.width = total_width;	
		this.canvas.height = total_height;	
		
		// Determine offset w, h to center grid as much as possible
		var margin_width = (size.width - total_width) / 2;
		var margin_height = (size.height - total_height) / 2;
		
		this.canvas.style.margin = `${margin_height}px ${margin_width}px`;		
		
		this.layers.forEach((l, i) => {	
			var row = Math.floor(i / this.columns);
			var col = i - (row * this.columns);

			var x1 = col * (this.dimensions.x * this.cell_width + this.spacing);
			var y1 = row * (this.dimensions.y * this.cell_height + this.spacing);
			var x2 = x1 + this.cell_width * this.dimensions.x;
			var y2 = y1 + this.cell_height * this.dimensions.y;

			l.geom = { x1:x1, y1:y1, x2:x2, y2:y2, z:l.z } 
		});
	}

	get_canvas_size(options) {
		var height = this.height;
		
		if (this.aspect) height = this.width / (this.dimensions.x / this.dimensions.y);
		
		return { 
			width : this.columns * this.width + this.spacing * this.columns - this.spacing, 
			height : this.rows * height + this.rows * this.spacing - this.spacing 
		}
	}
	
	draw_state(state) {
		for (var i = 0; i < this.layers.length; i++) {
			var l = this.layers[i];
			
			for (var x = 0; x < this.dimensions.x; x++) {
				for (var y = 0; y < this.dimensions.y; y++) {
					for (var p = 0; p < l.fields.length; p++) {
						var c = this.model.get_cell(x, y, l.z);
						var m = state.get_message(c);
						var v = m.get_value(l.fields[p]);
						
						this.draw_cell(x, y, i, this.get_color(l.style, v));
					}
				}
			}
		}
	}
	
	draw_changes(messages) {
		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var c = m.model;
			
			for (var j = 0; j < m.value.length; j++) {			
				var layers = this.index[c.z]?.[c.state.fields[j].name] ?? [];
				
				for (var k = 0; k < layers.length; k++) {
					var l = layers[k];
					
					this.draw_cell(c.x, c.y, l.position, this.get_color(l.style, m.value[j]));
				}
			}
		}
	}

	get_color(ramp_idx, value) {
		var ramp = this.styles[ramp_idx];
		
		for (var i = 0; i < ramp.length; i++) {
			var c = ramp[i];
			
			if (value >= c.start && value <= c.end) return `rgb(${c.color.join(",")})`;
		}
		
		return 'rgb(200, 200, 200)'
	}
	
	get_cell(clientX, clientY) {
		var rect = this.canvas.getBoundingClientRect();
		var x = clientX - rect.left;
		var y = clientY - rect.top;
		var zero = null;
		
		for (var k = 0; k < this.layers.length; k++) {
			var l = this.layers[k];
			
			if (x < l.geom.x1 || x > l.geom.x2) continue;
			
			if (y < l.geom.y1 || y > l.geom.y2) continue;
			
			zero = l;
			
			break;
		}
		
		if (!zero || zero.geom.y2 == y) return null;
		
		x = x - zero.geom.x1;
		y = y - zero.geom.y1;
		
		// Find the new X, Y coordinates of the clicked cell
		var pX = x - x % this.cell_width;
		var pY = y - y % this.cell_height;
		
		return { x:pX / this.cell_width, y:pY / this.cell_height, z:zero.geom.z, k:k, layer:this.layers[k] };
	}
	
	draw_cell(x, y, k, color) {			
		var zero = this.layers[k].geom;
		
		var x = zero.x1 + x * this.cell_width;
		var y = zero.y1 + y * this.cell_height;
		
		this.context.fillStyle = color;
		this.context.fillRect(x, y, this.cell_width, this.cell_height);
	}
	/*
	draw_cell_border(x, y, k, color) {	
		var zero = this._grids[k];
		
		// Find the new X, Y coordinates of the clicked cell
		var pX = zero.x1 + x * this.cell_width;
		var pY = zero.y1 + y * this.cell_height;
		
		var dX = pX + (STROKE_WIDTH / 2);
		var dY = pY + (STROKE_WIDTH / 2);
		
		// Define a stroke style and width
		this.context.lineWidth = STROKE_WIDTH;
		this.context.strokeStyle = color;
		
		// Draw rectangle, add offset to fix anti-aliasing issue. Subtract from height and width 
		// to draw border internal to the cell
		this.context.strokeRect(dX, dY, this.cell_width - STROKE_WIDTH, this.cell_height - STROKE_WIDTH);
	}
	
	on_canvas_click(ev) {		
		var data = this.get_cell(ev.clientX, ev.clientY);
		
		if (!data) return;
		
		this.emit("click", { x:ev.pageX, y:ev.pageY, data:data });
	}
	*/
	
	on_canvas_mousemove(ev) {				
		var data = this.get_cell(ev.clientX, ev.clientY);
		
		if (!data) return;
		
		var cell = this.model.get_cell(data.x, data.y, data.z)
		
		this.emit("mousemove", { x:ev.pageX, y:ev.pageY, cell:cell });
	}
		
	on_canvas_mouseout(ev) {		
		this.emit("mouseout", { x:ev.pageX, y:ev.pageY });
	}
});