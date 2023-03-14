'use strict';

import Application from '../app-framework/base/application.js';
import Net from '../app-framework/tools/net.js';
import Recorder from '../app-framework/components/recorder.js';
import wGIS from './widgets/gis/w-gis.js'
import Playback from '../app-framework/widgets/playback.js';

import ParserOGSE from '../app-framework/parsers/parserOGSE.js';
import ConfigurationGis from '../app-framework/data_structures/visualization/configuration-gis.js';
import Simulation from '../app-framework/data_structures/simulation/simulation.js';

export default class AppEmbed extends Application {

	async load() {
		// Parse the URL in the location bar.
		var qry = new URLSearchParams(window.location.search);

		// In the URL of the app, there's a 'viz' parameter. The viz parameter indicates the path to a
		// visualization.json file that contains the visualization configuration. This line reads the
		// viz parameter and retrieves the JSON contained in the file specified.
		var json = await Net.json(qry.get("viz"));

		// Create a configuration object from the json in the visualization.json file
		var viz = new ConfigurationGis(json);

		// Load all the files required for the visualization. These are specified in the visualization.json file
		var files = await viz.load_files();

		// Create a parser object to prepare the simulation data
		var parser = new ParserOGSE(files);

		// Parse the metadata file, this creates a metadata object.
		var metadata = await parser.parse_metadata();

		// Create an empty simulation object from the metadata.
		var simulation = new Simulation(metadata);

		// Finish initializing the visualization configuration
		viz.initialize(parser.files);

		// This line is the conventional way to load messages into the simulation object. This is the part where
		// you integrate the web socket + web worker process. This part will be a bit tricky. I think you should
		// just create the message objects using your process instead of the parser.parse_messages function for
		// now. Once you have all the messages, then proceed to the next step. Once you have that, then we can
		// worry about progressively loading and viewing.
        const webWorker = new Worker('./webworker.js', {type: 'module'});
        webWorker.postMessage('connect,' + parser.files.log.name);
        //TODO: currently simulation loads with messages[] empty
        var messages = [];
        webWorker.onmessage = function(message) {
             messages.push(message);
        }
		//var messages = await parser.parse_messages(simulation);

		// Finish initialization of the simulation object.
		simulation.initialize(messages, viz.cache);
		
		// Instantiate the viewer widget for maps.
		// TODO: I need to fix the wGis widget to receive messages as they are loaded through websockets.
		// TODO: This involves precalculating the simulation stats used to render the map. It will also
		// TODO: require that the playback widget be updated as messages are coming in. 
		var view = new wGIS(this.elems.view, simulation, viz, files);
		
		// Hook up events on the viewer widget.
		view.on("ready", ev => {
			this.elems.playback.recorder = new Recorder(view.canvas);
			this.elems.playback.initialize(simulation, viz);
		});
	}
	
	html() {
		return	"<main handle='main' class='view-container'>" +
					"<div handle='view' class='view'></div>" +
					"<div handle='playback' widget='Api.Widget.Playback'></div>" +
				"</main>";
	}
}