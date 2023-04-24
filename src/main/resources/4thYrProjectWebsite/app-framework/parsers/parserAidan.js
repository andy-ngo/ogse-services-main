'use strict';

import Parser from './parser.js';
import Reader from "../components/chunk-reader.js";
import Metadata from '../data_structures/metadata/metadata.js';
import Subcomponent from '../data_structures/metadata/subcomponent.js';
import Scenario from '../data_structures/scenario/scenario.js';
import ModelAtomic from '../data_structures/metadata/model-atomic.js';
import ModelCoupled from '../data_structures/metadata/model-coupled.js';
import Coupling from '../data_structures/metadata/coupling.js';
import MessageOutput from '../data_structures/simulation/message-output.js';
import MessageState from '../data_structures/simulation/message-state.js';
import Frame from '../data_structures/simulation/frame.js';
import ConfigurationGis from '../data_structures/visualization/configuration-gis.js';

/**
 * A parser component to process the common results format
 */
export default class ParserAidan extends Parser { 
	
	/**                              
	 * Detects the parser to use. 
	 * @return {String} A string identifying the parser to use ("CDpp-Cell-DEVS", "Cadmium-V1" or "OGSE")
	 */		
	static detect(files) {
		if (!files.find(f => f.name.endsWith("scenario.json"))) return false;
		
		if (!files.find(f => f.name.toLowerCase().endsWith('_state.txt'))) return false;
		
		if (!files.find(f => f.name.toLowerCase() == "metadata.json")) return false;
		
		return true;
	}
	
	constructor(files) {
		super(files);
		
		this.files.scenario = files.find(f => f.name.endsWith("scenario.json"));
		this.files.metadata = files.find(f => f.name.toLowerCase() == "metadata.json");
		this.files.state = files.find(f => f.name.toLowerCase().endsWith('_state.txt'));
		this.files.output = files.find(f => f.name.toLowerCase().endsWith('_messages.txt'));
		this.files.geojson = files.filter(f => f.name.toLowerCase().endsWith(".geojson"));
	}
	
	/**                              
	 * Parses the visualization.json file
	 * @return {Configuration} a visualization configuration file
	 */		
	async default_visualization() {
		throw new Error("No default visualization configuration available for GIS visualizations");
	}
	
	/**                              
	 * Parses the metadata.json file
	 * @return {ModelCoupled} the coupled model metadata
	 */		
	async parse_metadata() {		
		var j_meta = await Reader.read_as_json(this.files.metadata);
		var j_scenario = await Reader.read_as_json(this.files.scenario);
		var metadata = new Metadata(j_meta.title, "top");
		var a = metadata.types.add(new ModelAtomic(j_meta));
		
		for (var id in j_scenario.cells) {
			if (id == "default") continue;
			
			var sc = new Subcomponent(Subcomponent.make(id, a.id));
			metadata.add_subcomponent(metadata.root.type, sc);
		}
		
		return metadata;	
	}

	/**                              
	 * Parses the messages file (name changes according to parser)
	 * @return {Frame[]} an array of Frame objects
	 */		
	async parse_messages(simulation) {		
		var t = null;
		this.frame = null;
		
		return Reader.read_by_chunk(this.files.state, "\n", (parsed, chunk, progress) => {
			if (parsed == null) parsed = [];
			
			// If line has only one item, then it's a timestep. Otherwise, it's a simulation message, 
			// the format then depends on the whether it's a DEVS, Cell-DEVS or Irregular model
			var lines = chunk.split("\n");
			
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].trim().split(" ");
				
				if (line.length == 1) {
					if (t == line[0]) continue;
					
					this.frame = new Frame(line[0]);
					t = line[0];
					
					parsed.push(this.frame);
				}
				
				else {
					var model = simulation.models.get(line[3].slice(1));		
					var values = line[5].split(",").map(v => +v);

					this.frame.add_state_message(new MessageState(model, values));	
				}
			}
			
			this.emit("progress", { progress: progress });
			
			return parsed;
		});
	}
}