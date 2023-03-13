'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Widget from '../../base/widget.js';
import Tooltip from '../../ui/tooltip.js';
import Diagram from './diagram.js';

export default Core.templatable("Api.Widget.Diagram", class wDiagram extends Widget { 

	get canvas() { return this.diagram.canvas; }
	
	constructor(node, simulation, options) {
		super(node);
		
		this.simulation = simulation;
		this.options = options;
		this.tooltip = new Tooltip();
		
		this.redraw(simulation, options.diagram);
		this.resize();
		
		this.diagram.on("mousemove", this.on_mousemove.bind(this));
		this.diagram.on("mouseout", this.on_mouseout.bind(this));
		
		options.on("change", this.on_settings_change.bind(this));
		options.on("new-diagram", ev => this.redraw(this.simulation, ev.diagram));
		
		simulation.on("next", ev => this.diagram.draw(ev.frame.output_messages));
		simulation.on("previous", ev => this.diagram.draw(ev.frame.output_messages));
		simulation.on("jump", ev => this.diagram.draw(ev.frame.output_messages));
	}

	resize() {	
		var size = this.diagram.get_diagram_size(this.options);
		
		this.elems.diagram.style.width = size.width + "px";
		this.elems.diagram.style.height = size.height + "px";	

		var cv_size = Dom.geometry(this.elems.diagram);
		
		this.diagram.canvas.setAttribute('width', cv_size.w);	
		this.diagram.canvas.setAttribute('height', cv_size.h);
	}
	
	redraw(simulation, diagram) {
		Dom.empty(this.elems.diagram);
		Dom.empty(this.elems.canvas);
		
		this.diagram = new Diagram(simulation, diagram);
		
		this.elems.diagram.appendChild(this.diagram.svg);
		this.elems.canvas.appendChild(this.diagram.canvas);
		
		this.diagram.draw(this.simulation.current_frame.output_messages);
	}
		
	on_settings_change(ev) {
		if (["height", "width", "aspect"].indexOf(ev.property) == -1) return;

		this.resize();
	}
	
	on_mousemove(ev) {
		Dom.empty(this.tooltip.elems.content);
		
		var messages = this.simulation.current_frame.output_messages;
		var tY = messages.filter(t => t.model.id == ev.id);
		
		if (tY.length == 0) return;
		
		Dom.create("div", { className:"tooltip-label", innerHTML:`<b>${ev.id}</b> outputs:`, }, this.tooltip.elems.content);
		
		var ul = Dom.create("ul", null, this.tooltip.elems.content);

		tY.forEach(t => {
			t.pair((f,v) => {				
				Dom.create("li", { className:"tooltip-label", innerHTML:`<b>${v}</b> through <b>${f.name}</b>` }, ul);
			});
		});
		
		this.tooltip.show(ev.x + 20, ev.y);
	}
	
	on_mouseout(ev) {
		this.tooltip.hide();
	}
		
	html() {
		return "<div handle='root'>" +
				   "<div handle='diagram' class='diagram-widget'></div>" +
				   "<div handle='canvas' class='diagram-canvas hidden'></div>" +
			   "</div>";
	}
});