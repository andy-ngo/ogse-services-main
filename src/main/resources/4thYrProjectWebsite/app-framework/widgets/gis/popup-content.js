'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Widget from '../../base/widget.js';

export default Core.templatable("Api.Widget.GIS.PopupContent", class PopupContent extends Widget { 
	
	get size() { return this.features.length; } 
	
	constructor(node, options) {
		super(node);
		
		this.get_content = options?.get_content ?? null;
		this.get_title = options?.get_title ?? null;
		
		this.fill(options?.features || [])
		
		this.elems.prev.addEventListener("click", this.prev_page.bind(this));
		this.elems.next.addEventListener("click", this.next_page.bind(this));
	}
	
	fill(features) {		
		this.features = features;
		this.i = 0;
		
		if (this.size > 0) this.set_page(this.i);
		
		Dom.toggle_css(this.elems.button_container, 'hidden', this.size == 1);
	}
	
	set_page(i) {
		this.elems.page.innerHTML = `${i + 1} of ${this.size}`;
		
		Dom.empty(this.elems.props);
		
		var content = this.get_content(this.features[i]);
		
		if (content instanceof HTMLElement) Dom.place(content, this.elems.props);
		
		else this.elems.props.innerHTML = content;
		
		if (!this.get_title) return;
		
		this.elems.title.innerHTML = this.get_title(this.features[i]);
	}
	
	next_page() {
		this.i = (this. i + 1) % this.size;
		this.set_page(this.i);
	}
	
	prev_page() {
		this.i = (this.i + this.size - 1) % this.size;
		this.set_page(this.i);
	}
	
	html() {
		return "<div handle='root' class='popup-content'>" + 
				  "<div handle='title' class='title'></div>" +
				  "<div handle='props'></div>" +
				  "<div handle='button_container' class='button-container'>" + 
					 "<button handle='prev' class='button previous'><</button>" +
					 "<button handle='next' class='button next'>></button>" +
					 "<span handle='page'></span>" + 
				  "</div>" +
			   "</div>";
	}
});