'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Widget from '../../base/widget.js';
import Select from '../../ui/select.js';

export default Core.templatable("Api.Widget.Palette.Styles", class Styles extends Widget { 
	
	constructor(container) {
		super(container);
		
		this.items = null;
		this.tooltip = null;
		this.bIdx = null;
		
		this.build_tooltip();
		
		// Need to make Node access uniform (widget vs node vs element)
		this.elems.selectStyle.on("change", this.on_select_style_change.bind(this));
		this.elems.btnAddStyle.addEventListener("click", this.on_button_add_style_click.bind(this));
		this.elems.btnDelStyle.addEventListener("click", this.on_button_del_style_click.bind(this));
		
		this.elems.addClass.addEventListener("click", this.on_button_add_class_click.bind(this));
	}
	
	build_tooltip() {
		this.tooltip = Dom.create("div", { className:"color-picker-container hidden" }, document.body);
		
		this.picker = new iro.ColorPicker(this.tooltip, {
			width : 170,
			layoutDirection : "vertical",
			sliderSize : 15
		});
		
		this.picker.base.children[0].tabIndex = 0;
		this.picker.base.children[1].tabIndex = 0;
		
		this.picker.on("input:end", this.on_picker_color_change.bind(this));
		
		this.tooltip.addEventListener("mouseleave", (ev) => {
			Dom.add_css(this.tooltip, "hidden");
		});
	}
	
	initialize(settings, style) {
		this.settings = settings;
		
		this.load_styles_dropdown();		
		this.show_style(style);
	}
	
	load_styles_dropdown() {
		this.elems.selectStyle.empty();
		
		this.settings.styles.forEach((s, i) => this.elems.selectStyle.add(i, null, s));
	}
	
	show_style(style) {
		this.elems.selectStyle.value = style;
		
		Dom.empty(this.elems.body);
		
		this.items = [];
		
		this.settings.styles[style].forEach(c => this.add_style_class(c));
	}
	
	add_style_class(c) {
		var item = {};
		
		item.data = c;
		item.row = Dom.create("tr", { className:"table-row" }, this.elems.body);
		item.start = this.add_start(item.row, c);
		item.end = this.add_end(item.row, c);
		item.color = this.add_color(item.row, c, this.items.length);
		item.btnDelete = this.add_delete_button(item);
		
		item.start.addEventListener("change", ev => {
			item.data.start = +ev.target.value;
		
			this.settings.set("styles", this.settings.styles);
		});
		
		item.end.addEventListener("change", ev => { 
			item.data.end = +ev.target.value;
		
			this.settings.set("styles", this.settings.styles);
		});
		
		this.items.push(item);
	}
	
	add_start(tr, c) {
		var td = Dom.create("td", { className:"styles-start"}, tr);
		
		return Dom.create("input", { value:c.start, type:'number' }, td);
	}
	
	add_end(tr, c) {
		var td = Dom.create("td", { className:"styles-end"}, tr);
		
		return Dom.create("input", { value:c.end, type:'number' }, td);
	}
	
	add_color(tr, c, i) {
		var td = Dom.create("td", { className:"styles-color"}, tr);
		var btn = Dom.create("button", { className:"color" }, td);

		btn.style.backgroundColor = `rgb(${c.color})`;

		btn.addEventListener("click", (ev) => {
			this.bIdx = i;
			
			var geom = ev.target.getBoundingClientRect();
			
			this.tooltip.style.left = (geom.left - window.scrollX) + "px";
			this.tooltip.style.top = (geom.top - window.scrollY) + "px";
			
			Dom.remove_css(this.tooltip, "hidden");
		});

		return btn;
	}
	
	add_delete_button(item) {
		var td = Dom.create("td", { className:"grid-delete"}, item.row);
		var btn = Dom.create("button", { className:"table-button button-delete image-button" }, td);
		var img = Dom.create("img", { className:"image-icon", src:"./assets/delete.png", title:this.nls("Settings_Class_Delete_Title") }, btn);
		
		btn.addEventListener('click', this.on_button_delete_class_click.bind(this, item));
		
		return btn;
	}
	
	on_button_add_class_click(ev) {	
		var i = this.elems.selectStyle.value;
		var c = { start:0, end:0, color:[255, 255, 255] };
		
		this.settings.styles[i].push(c);
	
		this.add_style_class(c);
		
		this.elems.classes.scrollTop = this.elems.classes.scrollHeight;
	}	
	
	on_button_delete_class_click(item, ev) {		
		var i = this.elems.selectStyle.value;
		var j = this.items.indexOf(item);
		
		this.settings.styles[i].splice(j, 1);
		this.items.splice(j, 1);
				
		item.row.remove();
		
		this.settings.set("styles", this.settings.styles);
	}
	
	on_select_style_change(ev) {		
		this.show_style(ev.target.value);
	}	
	
	on_button_add_style_click(ev) {
		var style = this.settings.add_style([]);
		
		this.load_styles_dropdown(this.settings.styles);
		
		this.show_style(this.settings.styles.length - 1);
		
		this.settings.set("styles", this.settings.styles);
	}
	
	on_button_del_style_click(ev) {
		this.settings.remove_style(this.elems.selectStyle.selected);
		
		this.load_styles_dropdown(this.settings.styles);
		
		this.show_style(0);
		
		this.settings.set("styles", this.settings.styles);
		
		Dom.toggle_css(this.elems.btnDelStyle, 'hidden', this.settings.styles.length == 1);
		
		this.emit("style-deleted");
	}
	
	on_picker_color_change(ev) {
		var c = this.picker.color.rgb;
		
		this.items[this.bIdx].color.style.backgroundColor = this.picker.color.rgbString;
		this.items[this.bIdx].data.color = [c.r, c.g, c.b];
		
		this.settings.set("styles", this.settings.styles);
	}
	
	html() {
		return 	"<div class='layers-widget'>" + 
					"<div class='settings-title-container'>" +
						"<h3 class='settings-group-label Cell-DEVS'>nls(Settings_Styles)</h3>" +
						"<div handle='selectStyle' class='style-add' widget='Api.UI.Select'></div>" +
						"<button handle='btnAddStyle' class='table-button image-button' title='nls(Settings_Layers_Add_Style_Title)'>" + 
						   "<img src='./assets/add.png' class='image-icon'/>" +
						"</button>" +		
						"<button handle='btnDelStyle' class='table-button image-button' title='nls(Settings_Layers_Del_Style_Title)'>" + 
						   "<img src='./assets/delete.png' class='image-icon'/>" +
						"</button>" +		
					 "</div>" + 
					 "<div handle='classes' class='style'>" + 
						"<table>" + 
							"<thead>" +
								"<tr>" + 
									"<td class='col-1'>nls(Settings_Style_Start)</td>" +
									"<td class='col-2'>nls(Settings_Style_End)</td>" +
									"<td class='col-3'>nls(Settings_Style_Color)</td>" +
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
										"<button handle='addClass' class='table-button image-button' title='nls(Settings_Class_Add_Title)'>" + 
											"<img src='./assets/add.png' class='image-icon'/>" +
										"</button>" +
									"</td>" +
								"</tr>" +
							"</tfoot>" + 
						"</table>" + 
					 "</div>" +
				 "</div>";
	}
	
	localize(nls) {
		nls.add("Settings_Styles", "en", "Modify style no.");
		nls.add("Settings_Layers_Add_Style_Title", "en", "Add a new style to the visualization");
		nls.add("Settings_Layers_Del_Style_Title", "en", "Remove this style from the visualization");
		nls.add("Settings_Style_Start", "en", "Start");
		nls.add("Settings_Style_End", "en", "End");
		nls.add("Settings_Style_Color", "en", "Color");
		nls.add("Settings_Class_Add_Title", "en", "Add a color classification to the visualization");
		nls.add("Settings_Class_Delete_Title", "en", "Remove color classification from visualization");
	}
})