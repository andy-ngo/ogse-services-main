'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Evented from '../../base/evented.js';
import ModelAtomic from '../../data_structures/metadata/model-atomic.js';

export default class Diagram extends Evented { 
	
	constructor(simulation, diagram) {
		super();
		
		this.svg = this.make_svg(simulation, diagram);
		this.canvas = this.make_canvas();
		this.links = this.load_links(simulation);
		this.origins = this.load_origin_svg_nodes(simulation);
		this.dests = this.load_destination_svgs(simulation);
	}

	make_svg(simulation, diagram) {
		var svg = Dom.create("div", { innerHTML:diagram }).children[0];
		
		var style = `.highlighted {
						stroke: #1e94c3 !important;
						fill: #d6f2fd !important;
						color: #1e94c3 !important;
					}

					path.highlighted,
					text.highlighted,
					marker.highlighted path {
						fill: #1e94c3 !important;
					}

					.highlighted.origin {
						stroke: #b36402 !important;
						fill: #f9e5c1 !important;
						color: #b36402 !important;
					}

					path.highlighted.origin,
					text.highlighted.origin,
					marker.highlighted.origin path {
						fill: #b36402 !important;
						stroke: #b36402 !important;
					}`
		
		Dom.create("style", { innerHTML:style }, svg);
		
		svg.setAttribute("preserveAspectRatio", "none");
		
		this.set_pointer_events(svg);
		
		return svg;
	}
	
	make_canvas() {
		return Dom.create("canvas", { className:"hidden" });
	}
	
	set_pointer_events(svg) {		
		svg.querySelectorAll("*").forEach(n => {			
			n.style.cursor = "none";
			n.style.pointerEvents = "none";
		});
		
		svg.querySelectorAll("[devs-model-id]").forEach(n => {
			var id = n.getAttribute("devs-model-id");
			
			n.style.cursor = "pointer";
			n.style.pointerEvents = "all"
			
			n.addEventListener("mousemove", this.on_svg_mousemove.bind(this, id));
			n.addEventListener("click", this.on_svg_click.bind(this, id));
			n.addEventListener("mouseout", this.on_svg_mouseout.bind(this, id));
		});
	}
	
	load_origin_svg_nodes(simulation) {
		var origins = {};
		
		simulation.models.forEach(m => {
			m.port.forEach(p => {
				if (!origins[m.id]) origins[m.id] = {};

				var nodes = this.get_port_svg(m, p);
				
				this.get_links(m, p).forEach(l => {
					nodes = nodes.concat(this.get_link_svg(l.from_model, l.from_port));
				});
				
				origins[m.id][p.name] = nodes;
			});
		});
		
		return origins;
	}
	
	load_destination_svgs(simulation) {
		var dests = {};
		
		simulation.models.forEach(m => {
			m.port.forEach(p => {				
				if (!dests[m.id]) dests[m.id] = {};
				
				var links = this.get_links(m, p);
				
				links.forEach(l => {
					if (l.to_model instanceof ModelAtomic) return;
					
					links = links.concat(this.get_links(l.to_model, l.to_port));
				});
				
				var nodes = [];
				
				links.forEach(l => {
					nodes = nodes.concat(this.get_link_svg(l.from_model, l.from_port));
					nodes = nodes.concat(this.get_port_svg(l.to_model, l.to_port));
				});
				
				dests[m.id][p.name] = Array.from(nodes);
			});
		});
		
		return dests;
	}
	
	load_links(simulation) {
		var links = {}
		
		simulation.coupled_types.forEach(m => {			
			m.coupling.forEach(c => {
				if (!links[c.from_model.id]) links[c.from_model.id] = {};
				
				var m_id = c.from_model.id;
				var p_id = c.from_port.name
				
				if (!links[m_id][p_id]) links[m_id][p_id] = []
				
				links[m_id][p_id].push(c);
			});
		});
		
		return links;
	}
	
	get_links(model, port) {
		return this.links[model.id]?.[port.name] ?? [];
	}
	
	get_link_svg(m, p) {
		var selector = `[devs-link-mA=${m.id}][devs-link-pA=${p.name}]`;
		
		return Array.from(this.svg.querySelectorAll(selector));
	}
	
	get_port_svg(m, p) {
		var selector = `[devs-model-id=${m.id}],[devs-port-model=${m.id}][devs-port-name=${p.name}]`
		
		return Array.from(this.svg.querySelectorAll(selector));
	}
	
	draw(messages) {		
		this.reset();
		
		messages.forEach(m => this.draw_y_message(m));
		
		this.draw_to_canvas(this.svg);
	}
	
	draw_y_message(message) {
		var p = message.port;
		var m = message.model;

		this.add_css(this.origins[m.id][p.name], ["highlighted", "origin"]);
		this.add_css(this.dests[m.id][p.name], ["highlighted"]);		
	}
		
	draw_to_canvas(svg) {
		var cv = this.canvas;
		var serializer = new XMLSerializer();
		var source = serializer.serializeToString(svg);
		var blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
		var url = window.URL.createObjectURL(blob);
		var ctx = cv.getContext('2d');
		var img = new Image();

		img.onload = function() {
			ctx.fillStyle = "#f9f9f9";
			ctx.fillRect(0, 0, cv.getAttribute("width"), cv.getAttribute("height"));
			ctx.drawImage(img, 0, 0, cv.getAttribute("width"), cv.getAttribute("height"));
			
			window.URL.revokeObjectURL(url);
		}
		
		img.src = url;
	}

	add_css(nodes, css) {		
		nodes.forEach(node => css.forEach(c => node.classList.add(c)));
	}
	
	remove_css(nodes, css) {
		nodes.forEach(node => css.forEach(c => node.classList.remove(c)));
	}
	
	reset() {		
		for (var m in this.dests) {
			for (var p in this.dests[m]) {
				this.remove_css(this.dests[m][p], ["highlighted", "origin"]);
			}
		}
		
		for (var m in this.origins) {
			for (var p in this.origins[m]) {
				this.remove_css(this.origins[m][p], ["highlighted", "origin"]);
			}
		}
	}
		
    /**
     * Returns the diagram size considering the  width, height and optionally, the aspect ratio
	 * @param {SVG Element} an svg element used to determine the ratio between width and height
	 * @return the diagram size { width, height }
	 */
	get_diagram_size(options) {		
		var vb = this.svg.getAttribute("viewBox");
		
		if (!vb) throw new Error("The viewBox attribute must be specified on the svg element.");

		var split = vb.split(" ");
		var ratio = split[2] / split[3];
		
		return { 
			width : options.width, 
			height : options.aspect ? options.width / ratio : options.height 
		}
	}
	
	resize(options) {	
		var svg_size = options.get_diagram_size(this.svg);
		
		this.widget.container.style.width = svg_size.width + "px";
		this.widget.container.style.height = svg_size.height + "px";	

		var cv_size = Dom.geometry(this.elems.diagram);
		
		this.diagram.canvas.setAttribute('width', cv_size.w);	
		this.diagram.canvas.setAttribute('height', cv_size.h);
	}
	
	on_svg_mousemove(id, ev) {		
		this.emit("mousemove", { x:ev.pageX, y:ev.pageY, id:id, svg:ev.target });
	}
	
	on_svg_mouseout(id, ev) {		
		this.emit("mouseout", { x:ev.pageX, y:ev.pageY, id:id, svg:ev.target });
	}
	
	on_svg_click(id, ev) {			
		this.emit("click", { x:ev.pageX, y:ev.pageY, id:id, svg:ev.target });
	}
};