'use strict';

import Core from '../../tools/core.js';
import Popup from '../../ui/popup.js';
import Linker from './linker.js';

export default Core.templatable("App.Popup.Linker", class PopupLinker extends Popup { 
	
	get widget() { return this.elems.linker; }
	
	initialize(simulation, options) {		
		this.options = options;
		
		this.elems.linker.initialize(simulation, options.diagram);
	}
	
	show() {	
		return super.show().then(ev => {
			this.widget.reset();

			this.options.diagram = this.widget.svg.innerHTML;
		})
	}
	
	html() {
		return "<div handle='popup' class='popup'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'>nls(Popup_Linker_Title)</h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body' handle='body'>" + 
					 "<div handle='linker' widget='Api.Widget.Linker'></div>" +
				  "</div>" +
			   "</div>";
	}
	
	localize(nls) {
		super.localize(nls);
		
		nls.add("Popup_Linker_Title", "en", "DEVS Diagram Linker");
	}
});