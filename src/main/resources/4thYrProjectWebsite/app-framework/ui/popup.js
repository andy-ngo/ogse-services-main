import Dom from '../tools/dom.js';
import Core from '../tools/core.js';
import Widget from '../base/widget.js';

/** 
 * A moveable popup box
 **/
export default class Popup extends Widget { 
	
	/**
	 * Set the header title for the popup
	 * @type {string}
	 */
	set title(value) { this.elems.title.innerHTML = value; }
	
	/**
	 * Set the content widget in the popup
	 * @type {Widget}
	 */
	set content(widget) {
		this.empty();
		
		this._widget = widget;
		
		widget.container = this.elems.body;
	}
	
	/**
	 * Get the content widget in the popup
	 * @type {Widget}
	 */
	get widget() { return this._widget; }
	
	/**
	 * Set the content widget in the popup. Same as the content setter.
	 * @type {Widget}
	 */
	set widget(value) { this.content = value; }
	
	/**
	 * Constructor for the Picker element. Follows the widget creation pattern.
	 * @param {object} container - div container
	 * @param {object} container - div container
	 * Adds it to the document body by default.
	 */	
	constructor(title, widget) {	
		super(document.body);
		
		if (title) this.title = title;
		if (widget) this.widget = widget;

		this.moving = false;
		this.offset = { x:0, y:0 };
		this.defer = null;
		this.h = null;
		
		this.on_body_keyup_bound = this.on_body_keyup.bind(this);
		
		this.elems.blocker = Dom.create("div", { className:"popup-blocker" }, document.body);
		
		this.set_style(0, "hidden", "none");
		
		this.elems.close.addEventListener("click", this.on_btn_close_click.bind(this));
		this.elems.blocker.addEventListener("click", this.on_blocker_click.bind(this));
		
		this.container.addEventListener("mousedown", this.on_popup_mouse_down.bind(this));
		this.container.addEventListener("mouseup", this.on_popup_mouse_up.bind(this));
		this.container.addEventListener("mousemove", this.on_popup_mouse_move.bind(this));
	}
	
	/**
	 * Set the popup style
	 * @param {number} opacity - the opacity value for the popup 
	 * @param {string} visibility - the visibility value for the popup 
	 * @param {string} display - the display value for the popup 
	 */
	set_style(opacity, visibility, display) {
		this.elems.blocker.style.opacity = opacity;
		this.elems.blocker.style.visibility = visibility;
		this.elems.blocker.style.display = display;
		
		this.elems.popup.style.opacity = opacity;
		this.elems.popup.style.visibility = visibility;
		this.elems.popup.style.display = display;
	}
	
	/**
	 * Empties the popup
	 */
	empty() {
		Dom.empty(this.elems.body);
	}
	
	/**
	 * Gets the x,y coordinates to center the popup in the window
	 * @return {object} an object containing the x,y coordinates to center the popup
	 */
	get_center() {
		var geo = Dom.geometry(this.elems.popup);
		
		return { 
			x : window.innerWidth / 2 - geo.w / 2,
			y : window.innerHeight / 2 - geo.h / 2
		}
	}
	
	/**
	 * Shows the popup in the center of the screen
	 */
	show() {	
		this.defer = Core.defer();
		this.h = document.body.addEventListener("keyup", this.on_body_keyup_bound);		
		
		this.set_style(1, "visible", "block");
		
		var center = this.get_center();
		
		this.move(center.x, center.y);
		this.emit("show", { popup:this });
		
		this.elems.close.focus();
		
		return this.defer.promise;
	}
	
	/**
	 * Hides the popup
	 */
	hide() {		
		document.body.removeEventListener("keyup", this.on_body_keyup_bound);
		
		this.set_style(0, "hidden", "none");
		
		this.emit("hide", { popup:this });
		
		this.defer.Resolve();
	}
	
	/**
	 * Handles the keyup event on the popup.
	 * Hides on esc keyCode
	 * @param {event} ev - event object
	 */
	on_body_keyup(ev) {
		if (ev.keyCode == 27) this.hide();
	}
	
	/**
	 * Handles the click event on the blocker div.
	 * Hides the popup
	 * @param {event} ev - event object
	 */
	on_blocker_click(ev) {
		this.hide();
	}
	
	/**
	 * Handles the click event on the close button.
	 * Hides the popup
	 * @param {event} ev - event object
	 */
	on_btn_close_click(ev) {
		this.emit("close", { popup:this });
		
		this.hide();
	}
	
	/**
	 * Handles the mouse down event on the popup
	 * Initiates the drag action
	 * @param {event} ev - event object
	 */
	on_popup_mouse_down(ev) {
		if (ev.target !== this.elems.title) return;
		
		var rect = this.elems.popup.getBoundingClientRect();
		
		// offset between clicked point and top left of popup
		this.offset.x = ev.clientX - rect.x;
		this.offset.y = ev.clientY - rect.y;

		this.moving = true;
		
		this.on_popup_mouse_move(ev);
	}
	
	/**
	 * Handles the mouse up event on the popup
	 * Stops the drag action
	 * @param {event} ev - event object
	 */
	on_popup_mouse_up(ev) {
		this.moving = false;
	}
	
	/**
	 * Handles the mouse move event on the popup
	 * Moves the popup when dragging
	 * @param {event} ev - event object
	 */
	on_popup_mouse_move(ev) {
		if (!this.moving) return;
      
		ev.preventDefault();

		var x = ev.pageX - this.offset.x;
		var y = ev.pageY - this.offset.y;

		this.move(x, y);
	}
	
	/**
	 * Move the popup to an X,Y position
	 * @param {number} x - the x coordinate
	 * @param {number} y - the y coordinate
	 */
    move(x, y) {
		this.elems.popup.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
	
	/**
	 * Create HTML for select element
	 * @returns {string} HTML for select element
	 */
	html() {
		return "<div handle='popup' class='popup'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'></h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body' handle='body'></div>" +
				  "<div class='popup-footer' handle='footer'></div>" +
			   "</div>";
	}
	
	/**
	 * Defines the localized strings used in this component
	 * @param {Nls} nls - The nls object containing the strings
	 */
	localize(nls) {
		super.localize(nls);
		
		nls.add("Popup_Close", "en", "Close");
		nls.add("Popup_Close", "fr", "Fermer");
	}
}

Core.templatable("Api.UI.Popup", Popup);