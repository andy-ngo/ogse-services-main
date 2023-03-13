'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Net from '../../tools/net.js';
import Widget from '../../base/widget.js';

export default Core.templatable("Api.Widget.Palette.Fields", class Fields extends Widget { 
	
	set available(value) { this._available = value; }
	
	get available() { return this._available; }
	
	set value(value) { this._value = value; }
	
	get value() { return this._value; }
	
	get opened() { return this.elems.dropdown.children.length > 0; }
	
	constructor(container) {
		super(container);
		
		this.on_input_click_bound = this.on_input_click.bind(this);
		this.on_body_keyup_bound = this.on_body_keyup.bind(this);
		this.on_body_click_bound = this.on_body_click.bind(this);
		
		this._available = null;
		this._value = null;
		this._previous = null;
		
		this.elems.input.addEventListener("click", this.on_input_click_bound);
	}
	
	open() {		
		Dom.remove_css(this.elems.top, 'collapsed');
		
		document.body.addEventListener("keyup", this.onBody_KeyUp_Bound);
		document.body.addEventListener("click", this.onBody_Click_Bound);
		
		this._previous = this.value;
		this.value = [];
		
		this.available.forEach(a => {
			var li = Dom.create("li", { className:'select-fields-dropdown-item', innerHTML:a.name }, this.elems.dropdown);
			
			li.addEventListener("click", this.on_li_click.bind(this, a));
		});
	}
	
	close() {		
		Dom.add_css(this.elems.top, 'collapsed');
		
		document.body.removeEventListener("keyup", this.on_body_keyup_bound);
		document.body.removeEventListener("click", this.on_body_click_bound);
		
		Dom.empty(this.elems.dropdown);
		
		if (this.value.length == 0) this.select(this._previous);
	}
	
	select(fields) {
		this.value = fields;
		
		this.elems.input.value = this.value.join(", ");
	}
	
	on_input_click(ev) {
		if (this.opened) this.close();
		
		else this.open();
	}
	
	on_li_click(field, ev) {
		ev.stopPropagation();
		
		this.value.push(field);
		
		this.select(this.value);
		
		this.elems.dropdown.removeChild(ev.target);
		
		if (this.elems.dropdown.children.length == 0) this.close();
		
		this.emit("change", { value:this.value });
	}
	
	on_body_keyup(ev) {
		if (ev.keyCode == 27) this.close();
	}
	
	on_body_click(ev) {
		if (this.elems.input == ev.target) return;
			
		this.close();
	}
	
	html() {
		return "<div handle='top' class='select-fields collapsed'>" +
				   "<input handle='input' class='select-fields-input' type='text' readonly/>" +  
				   "<ul handle='dropdown' class='select-fields-dropdown'></ul>" +
			   "</div>";
	}
});