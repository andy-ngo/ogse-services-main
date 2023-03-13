
import Dom from '../tools/dom.js';
import Core from '../tools/core.js';
import Templated from '../base/widget.js';

/** 
 * A color picker element
 **/
export default class Picker extends Widget {

	/**
	 * Get the current color from the picker
	 * @type {Color}
	 */
	get color() {
		return this.picker.color;
	}
	
	/**
	 * Get the current color (RGB) from the picker
	 * @type {number[]}
	 */
	get color3() {
		var c = this.color.rgb;
		
		return [c.r, c.g, c.b];
	}
		
	/**
	 * Get the current color (RGBA) from the picker
	 * @type {number[]}
	 */
	get color4() {
		var c = this.color.rgba;
		
		return [c.r, c.g, c.b, c.a * 255];
	}

	/**
	 * Set the current color on the picker
	 * @type {Color}
	 */
	set color(value) {
		this.picker.color.set(value);
		
		this.elems.button.style.backgroundColor = this.picker.color.rgbString;
	}

	/**
	 * Constructor for the Picker element. Follows the widget creation pattern.
	 * @param {object} container - div container
	 */	
	constructor(container) {
		super(container);
		
		this.h = null;
		this.collapsed = true;
		
		this.elems.button.addEventListener("click", this.on_button_color_click.bind(this));
		this.elems.container.addEventListener("click", this.on_container_click.bind(this));
		
		this.picker = new iro.ColorPicker(this.elems.wheel, {
			width : 170,
			layoutDirection : "vertical",
			sliderSize : 15
		});
		
		this.picker.base.children[0].tabIndex = 0;
		this.picker.base.children[1].tabIndex = 0;
		
		this.elems.button.style.backgroundColor = this.picker.color.rgbString;
		
		this.on_body_keyup_bound = this.on_body_keyup.bind(this);
		this.on_body_click_bound = this.on_body_click.bind(this);
	}
	
	/**
	 * Handles the click on the container of the picker
	 * Prevents propagation
	 * @param {event} ev - event object
	 */
	on_container_click(ev) {
		ev.stopPropagation();
	}
	
	/**
	 * Handles the click event on the color button
	 * Shows the picker if collapsed, hides it otherwise
	 * @param {event} ev - event object
	 */
	on_button_color_click(ev) {
		this.collapsed ? this.show() : this.hide();
	}
	
	/**
	 * Shows the picker
	 */
	show() {		
		document.body.addEventListener("keyup", this.on_body_keyup_bound);
		document.body.addEventListener("click", this.on_body_click_bound);
		
		this.collapsed = false;
	
		Dom.remove_css(this.elems.container, "collapsed");
	}
	
	/**
	 * Hides the picker
	 */
	hide() {
		document.body.removeEventListener("keyup", this.on_body_keyup_bound);
		document.body.removeEventListener("click", this.on_body_click_bound);
		
		this.collapsed = true;
	
		Dom.add_css(this.elems.container, "collapsed");
		
		this.elems.button.style.backgroundColor = this.picker.color.rgbString;
		
		this.emit("change", { color:this.picker.color.rgba });
	}
	
	/**
	 * Handles the keyup event on the picker element
	 * Hides the picker if Esc key
	 * @param {event} ev - event object
	 */
	on_body_keyup(ev) {
		if (ev.keyCode == 27) this.hide();
	}
	
	/**
	 * Handles the click event on the picker element
	 * Hides the picker unless clicking on the button
	 * @param {event} ev - event object
	 */
	on_body_click(ev) {
		if (this.elems.button == ev.target) return;
		
		this.hide();
	}
	
	/**
	 * Create HTML for select element
	 * @returns {string} HTML for select element
	 */
	html() {
		return "<div class='color-picker'>" +
				  "<button handle='button' class='color'></button>" +
			      "<div handle='container' class='wheel-container collapsed'>" +
					  "<div handle='wheel'></div>" +
				  "</div>" +
			   "</div>"
	}
}

Core.templatable("Api.UI.Picker", Picker);
