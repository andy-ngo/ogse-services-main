'use strict';

import Core from '../../tools/core.js';
import Popup from '../../ui/popup.js';
import Layers from './layers.js';
import Styles from './styles.js';

export default Core.templatable("Api.Widget.Popup.Palette", class PopupPalette extends Popup { 
	
	initialize(simulation, settings) {		
		this.simulation = simulation;
		this.settings = settings;
		this.model = simulation.grid_types[0];
		
		// TODO: Review event names
		this.elems.styles.on("style-deleted", ev => this.elems.layers.refresh());
		
		this.elems.layers.initialize(this.model, this.settings);
		this.elems.styles.initialize(this.settings, 0);
	}
	
	html() {
		return "<div handle='popup' class='popup'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'>nls(Popup_Palette_Title)</h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body' handle='body'>" + 
				     "<div class='settings-title-container'>" +
				        "<h3 class='settings-group-label Cell-DEVS'>nls(Settings_Layers)</h3>"+ 
				     "</div>" + 
					 "<div handle='layers' widget='Api.Widget.Palette.Layers'></div>" +
					 "<div handle='styles' widget='Api.Widget.Palette.Styles'></div>" +
				  "</div>" +
			   "</div>";
	}
	
	localize(nls) {
		super.localize(nls);
		
		nls.add("Popup_Palette_Title", "en", "Modify grid palette");
		nls.add("Settings_Layers", "en", "Modify grids");
		nls.add("Settings_Layers_Style_Title", "en", "Modify the style for grid");
	}
});