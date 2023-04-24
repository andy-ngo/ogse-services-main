'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Net from '../tools/net.js';

import Widget from '../base/widget.js';

import AppConfig from "../components/config.js";

export default Core.templatable("Api.Widget.ServerLoader", class ServerLoader extends Widget {

    constructor(id) {
        super(id);

		this.models = AppConfig.logs;
		
		this.models.forEach(m => this.add_model(m));
    }

	add_model(model) {
		var li = Dom.create("li", { className:'model' }, this.elems.list);
		
		li.innerHTML = model.name;
		
		li.addEventListener("click", this.on_li_model_click.bind(this, model));
	}
	
    on_li_model_click(model, ev){		
		this.emit("model-selected", { files : model.files });
		Dom.remove_css(this.elems.wait, "hidden");
	
		var ps = model.files.map(f => {			
			return Net.file([AppConfig.URLs.logs, model.folder, f].join("/"), f);
		})
		
		var success = files => {			
			Dom.add_css(this.elems.wait, "hidden");	

			this.emit("files-ready", { files : files });
		};

		Promise.all(ps).then(success, this.on_error.bind(this));
    }

	on_error(error) {
		Dom.add_css(this.elems.wait, "hidden");
		
		this.error(error);
	}

    html() {
		return "<div class='server-loader-widget'>" + 
				  "<div handle='wait' class='wait hidden'>" + 
					 "<img src='./assets/loading.svg'>" + 
				  "</div>" + 
				  "<ul handle='list'></ul>" + 
			   "</div>";
    }
	
	localize(nls) {
		super.localize(nls);
	}
});
