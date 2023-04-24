'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Widget from '../../base/widget.js';
import Tooltip from '../../ui/tooltip.js';
import Grid from './grid.js';

export default Core.templatable("Api.Widget.Grid.Auto", class wGrid extends Widget { 

	get canvas() { return this.grid.canvas; }

	constructor(node, simulation, options) {
		super(node);
		
		this.simulation = simulation;
		this.options = options;
		this.tooltip = new Tooltip();
		
		this.grid = new Grid(this.elems.canvas, simulation, options);
		
		this.grid.on("mousemove", this.on_mousemove.bind(this));
		this.grid.on("mouseout", this.on_mouseout.bind(this));
		
		this.simulation.on("previous", ev => this.grid.draw_changes(ev.frame.previous_messages));
		this.simulation.on("next", ev => this.grid.draw_changes(ev.frame.state_messages));
		this.simulation.on("jump", ev => this.grid.draw_state(ev.state));
		
		options.on("change:height", ev => this.redraw());
		options.on("change:width", ev => this.redraw());
		options.on("change:columns", ev => this.redraw());
		options.on("change:spacing", ev => this.redraw());
		options.on("change:aspect", ev => this.redraw());
		options.on("change:styles", ev => this.redraw());
		
		options.on("change:layers", ev => {
			this.grid.update_layers(this.options.layers);
			this.redraw();
		});
		
		this.redraw();		
	}
	
	redraw() {
		this.grid.resize();
		this.grid.draw_state(this.simulation.state);
	}
	
	on_mousemove(ev) {
		var labels = [];
		var m = this.simulation.state.get_message(ev.cell);		
				
		for (var i = 0; i < m.value.length; i++) {
			var f = ev.cell.state.fields[i];
			var v = m.value[i];
			
			var label = `The state of cell <b>(${ev.cell.x}, ${ev.cell.y}, ${ev.cell.z})</b> 
						 on port <b>${f.name}</b> is <b>${v}</b>.`
			
			labels.push(label);
		}
		
		this.tooltip.content = labels.join("<br>");
		this.tooltip.show(ev.x + 20, ev.y);
	}
	
	on_mouseout(ev) {
		this.tooltip.hide();
	}
	
	html() {
		return "<div handle='canvas' class='grid-widget grid-canvas-container'></div>";
	}
});