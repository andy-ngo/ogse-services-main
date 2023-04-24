'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Widget from '../../base/widget.js';

export default Core.templatable("Api.Widget.Linker", class Linker extends Widget { 
	
    get svg() { return this.elems.svg_content; }
	
	get current() { return this._current; }
	
	async initialize(simulation, diagram) {
		this._current = {
			button: null,
			page: null,
			card: null
		}
		
		this.simulation = simulation;
		
		this.options = await this.make_options(simulation, diagram);
		
		this.load_svg(this.options.diagram);
		this.make_pages(this.options.pages);
		
		this.elems.chk_thick.addEventListener('click', this.on_linker_thicken.bind(this));
		this.elems.btn_clear.addEventListener('click', this.on_linker_clear.bind(this));
		
		this.options.pages.forEach(c => {
			c.button = Dom.create("button", { type: "button", className: "m-1 inactive", innerHTML: c.caption }, this.elems.buttons);
			
			c.button.addEventListener('click', (ev) => this.change_page(c));
		});
		
		this.change_page(this.options.pages[0]);
	}
	
	async make_options(simulation, diagram) {
		var ports = [];
		var links = [];
		
		simulation.models.forEach(m => {
			m.port.forEach(p => ports.push({ model:m, port:p }));
		});
		
		simulation.coupled_types.forEach(m => {
			links = links.concat(m.coupling);
		});
		
		return {
			diagram: diagram,
			selector : Linker.SVG_FORMAT.DRAW_IO,
			pages: [{
				caption: 'Models',
				empty: 'No models found in the structure file.',
				label: d => `<b>${d.id}</b>`,
				items: simulation.models,
				attrs: {
					"devs-model-id" : d => d.id
				}
			}, {
				caption: 'Output ports',
				empty: 'No output ports found in the structure file.',
				label: d => `<div><b>${d.port.name}</b> @ <b>${d.model.id}</b></div>`,
				items: ports,
				attrs: {
					"devs-port-model" :  d => d.model.id,
					"devs-port-name" : d => d.port.name
				}
			}, {
				caption: 'Links',
				empty: 'No links found in the structure file.',
				label: d => `<div><b>${d.from_port.name}</b> @ <b>${d.from_model.id}</b> to</div><div><b>${d.to_port.name}</b> @ <b>${d.to_model.id}</b></div>`,
				items: links,
				attrs: {
					"devs-link-mA" : d => d.from_model.id,
					"devs-link-pA" : d => d.from_port.name
				}
			}]
		}
	}
	
    load_svg(diagram) {
		var selector = Linker.SVG_FORMAT.DRAW_IO;
		
		this.svg.innerHTML = diagram;
		
		this.reset_pointer_events();
		
		this.svg.querySelectorAll(selector).forEach((n, index) => {
			n.addEventListener('click', this.on_svg_click.bind(this), false);
			
			n.style.cursor = "pointer";
			n.style.pointerEvents = "all"
		});
    }
	
	reset_pointer_events() {
		this.svg.querySelectorAll('*').forEach(n => {
			n.style.cursor = "none";
			n.style.pointerEvents = "none"
		});
	}
	
	make_pages(pages) {
		pages.forEach(page => {
			page.items = page.items.map(item => this.make_item(page, item));
		});
	}
	
	make_item(page, item) {
		var item = { data:item, attrs:{}, node:null, svg:[] }
		
		for (var attr in page.attrs) item.attrs[attr] = page.attrs[attr](item.data);
		
		item.node = Dom.create("div", { innerHTML:page.label(item.data), className:"card m-1 dwl-pointer dwl-card" });
		
		Dom.create("i", { className:"fas fa-exclamation-triangle warning-icon" }, item.node);
		
		item.node.addEventListener('click', this.on_card_click.bind(this, item), false);
		
		item.svg = this.get_associations(item.attrs);
		
		return item;
	}
	
	get_associations(attrs) {
		var selector = "";
		
		for (var attr in attrs) selector += `[${attr}=${attrs[attr]}]`
		
		return Array.from(this.svg.querySelectorAll(selector));
	}
	
	change_page(page) {
		Dom.empty(this.elems.cards);
		
		if (this.current.button) Dom.add_css(this.current.button, 'inactive');
		
		this.current.button = page.button;
		
		Dom.remove_css(this.current.button, 'inactive');
		
        this.clear_svg();
		
		this.current.page = page;
		
		if (page.items.length == 0) {
			return Dom.create("p", { innerHTML:page.empty }, this.elems.cards);
		}
		
		page.items.forEach(item => {
			Dom.place(item.node, this.elems.cards);
			
			Dom.toggle_css(item.node, 'hide-warning', item.svg.length > 0);
		});
	}
	
	clear_svg() {
		if (!this.current.card) return;
		
		Dom.remove_css(this.current.card.node, 'dwl-highlight-card');
	}
	
	clear_cards() {
		if (!this.current.card) return;
		
		this.current.card.svg.forEach(n => n.classList.remove('dwl-selected'));
	}
	
	refresh_warnings() {
		this.options.pages.forEach(p => {
			p.items.forEach(card => {
				Dom.toggle_css(card.node, 'hide-warning', card.svg.length > 0);
			});
		});
	}
	
	reset_thickness() {
		this.elems.chk_thick.checked = false;
		
		this.svg.classList.toggle("dwl-thick", false);	
	}
	
	clear() {
		this.clear_svg();
		this.clear_cards();
		this.refresh_warnings();
	}
	
	reset() {
		this.clear();
		this.reset_pointer_events();
		this.reset_thickness();
	}
	
	on_svg_click(ev) {
		var card = this.current.card;
		
		if (!card) return;
		
		var i = card.svg.indexOf(ev.target);
		
		if (i != -1) {
			ev.target.classList.remove('dwl-selected');
			
			card.svg.splice(i, 1);
			
			for (var attr in card.attrs) ev.target.removeAttribute(attr);
		}
		
		else {
			ev.target.classList.add('dwl-selected');
			
			card.svg.push(ev.target);
			
			for (var attr in card.attrs) ev.target.setAttribute(attr, card.attrs[attr]);
		}
		
		Dom.toggle_css(card.node, 'hide-warning', card.svg.length > 0);
	}
		
	on_card_click(card, ev) {
		this.clear();
		
		if (this.current.card == card) this.current.card = null;
		
		else {
			this.current.card = card;
			
			Dom.add_css(card.node, 'dwl-highlight-card');
			
			card.svg.forEach(a => a.classList.add('dwl-selected'));
		}
	} 
	
	on_linker_thicken(ev) {
		this.svg.classList.toggle("dwl-thick", ev.target.checked);	
	}
	
	on_linker_clear(ev) {
		debugger;
		// TODO: There are a few bugs here. The attributes get cleared correctly but the element on the right hand side
		// stays highlighted. Afterwards, when animating the diagram, the couplings still get highlighted.
		this.options.pages.forEach(p => {
			p.items.forEach(card => {
				card.svg.forEach(svg => {
					for (var attr in card.attrs) svg.removeAttribute(attr);
				});
				
				card.svg = [];
			});
		});
		
		this.clear();
	}
	
	html() {
		return `<div class="linker-widget d-flex flex-row h-100">` + 
			      `<div id="json-container" class="d-flex flex-column card me-1 h-100 w-100">` + 
					 `<div handle="buttons" class="p-3"></div>` + 
					 `<div handle="cards" id="cards" class="h-100 d-flex flex-row flex-wrap align-content-start justify-content-center overflow-auto">` + 
					    `<div handle="svg_content"></div>`+					 
					 `</div>` + 
					 `<p class="m-2">NOTE: Input ports will be automatically associated.</p>` + 
				  `</div>` + 
				  `<div id="svg-container" class="card ms-1 h-100 w-100 position-relative">` + 
				     `<div class="p-3 end-0">` + 
						`<div class="m-1 float-start">` + 
						   `<input handle="chk_thick" id="dwl-thick-chk" class="m-1 dwl-pointer align-middle" type="checkbox" title="Thicken line strokes for easier interaction."/>` +
						   `<label class="m-1 dwl-pointer align-middle" title="Thicken line strokes for easier interaction." for="dwl-thick-chk">Thicker line strokes</label>` + 
						`</div>` +
						`<button handle="btn_clear" type="button" class="m-1 float-end hidden" data-button-type="clear" title="Remove all associations.">Clear</button>` +
					 `</div>` +
					 `<div handle="svg_content" id="svg-content"></div>` +
				  `</div>` + 
			   `</div>`;
	}
	
	localize(nls) {
		super.localize(nls);
	}

	static get SVG_FORMAT() {
		return {
			DRAW_IO: 'foreignObject div > div > div, rect:not([fill="none"][stroke="none"]), circle, ellipse, path, polygon, text'
		}
	}
});