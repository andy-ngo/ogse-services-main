'use strict';

import Core from '../tools/core.js';
import List from "../base/list.js";
import Reader from "../components/chunk-reader.js";
import MessageOutput from '../data_structures/simulation/message-output.js';
import MessageState from '../data_structures/simulation/message-state.js';
import Frame from '../data_structures/simulation/frame.js';
import Metadata from '../data_structures/metadata/metadata.js';
import Subcomponent from '../data_structures/metadata/subcomponent.js';
import ModelCoupled from '../data_structures/metadata/model-coupled.js'
import ModelGrid from '../data_structures/metadata/model-grid.js'
import ConfigurationGrid from '../data_structures/visualization/configuration-grid.js';
import Parser from './parser.js';
import MaUtil from './ma-util.js'

/**
 * A parser component to process the raw Cell-DEVS results from CDpp or Lopez
 */
export default class ParserCDpp extends Parser { 
	
	/**                              
	 * Detects the parser to use. 
	 * @return {String} A string identifying the parser to use ("CDpp-Cell-DEVS", "Cadmium-V1" or "OGSE")
	 */		
	static detect(files) {
		if (!files.find(f => f.name.toLowerCase().endsWith('.ma'))) return false;
		
		if (!files.find(f => f.name.toLowerCase().includes('.log'))) return false;
		
		return true;
	}
	
	constructor(files) {
		super(files);
		
		this.files.ma = files.find(f => f.name.toLowerCase().endsWith('.ma'));
		this.files.log = files.find(f => f.name.toLowerCase().includes('.log'));
		this.files.pal = files.find(f => f.name.toLowerCase().endsWith('.pal'));
		this.files.val = files.find(f => f.name.toLowerCase().endsWith('.val'));
		this.files.map = files.find(f => f.name.toLowerCase().endsWith('.map'));
	}
	
	/**                              
	 * Parses the visualization.json file
	 * @return {Configuration} a visualization configuration file
	 */		
	async default_visualization() {
		var viz = new ConfigurationGrid();

		if (this.files.pal) viz.styles = await this.parse_style();
		
		return viz;
	}
	
	/**                              
	 * Parses the *.ma file into a Structure object
	 * @param {File} ma - the *.ma file
	 * @return {Structure} the structure object built from the file
	 */		
	async parse_metadata() {	
		var title = this.files.ma.name.slice(0,-3);
		var tokens = await MaUtil.tokenize(this.files.ma);
		var t = tokens.find(t => !!t.dim);
		var metadata = new Metadata(title, "top");
		
		// In CDpp and Lopez, cells only log output messages. For visualization, we consider 
		// output messages as state messages. Lopez outputs through ports while CDpp outputs 
		// a single value. Therefore, in CDpp, output messages will have a single variable 
		// while in Lopez, output messages will have a variable per port.
		var fields = ["out"];
		
		if (t.ports) t.ports.forEach(p => fields.push(`out_${p}`));
		
		var type = MaUtil.add_coupled_grid(metadata, t.id, fields, t.dim);
		var curr = MaUtil.add_subcomponent(metadata, type, t.id, type.id);
		
		var a = MaUtil.add_atomic(metadata, `${t.id}-cell`, fields);
		
		type.build_index(metadata, a);
		
		this.initial_value = t.initial_value ?? null;
		this.initial_row_values = t.initial_row_values ?? null;
		
		return metadata;
	}
	
	async parse_style() {
		var content = await Reader.read_as_text(this.files.pal);		
		var lines = content.trim().split("\n").map(l => l.trim());
		var buckets = [];
		
		// VALIDSAVEDFILE
		// 169,169,169
		// ...
		// 4.0,4.9
		if (lines[0] == "VALIDSAVEDFILE") {
			var j = 0;
			lines.shift();
			lines.forEach(l => {
				var d = l.split(',').map(l => +l.trim());
				
				if (d.length == 3) buckets.push({ start:null, end:null, color:d });

				else {
					buckets[j].start = d[0];
					buckets[j++].end = d[1];
				}
			});
		}
		
        // [-0.1;0.9] 255 255 51
        // [-1.1;-0.9] 153 255 255
        // ...
		else {
			lines.forEach(l => {
				var d = l.replace('[','')
						 .replace(']','')
						 .replace(';',' ')
						 .replaceAll(',','')
						 .split(' ').map(s => +s);
					 
				buckets.push({ start:d[0], end:d[1], color:[d[2], d[3], d[4]] });
			});
		}
		
		return [buckets];
	}
	
	/**                              
	 * Parses the *val, *map and *.log file
	 * @param {Structure} structure - the structure object for a simulation
	 * @return {Frame[]} an array of frames built from the messages.log
	 */	
	async parse_messages(simulation, val, map) {
		var lopez_test = await this.files.log.slice(0, 5).text();
		var is_lopez = lopez_test == "0 / L";
		var t0 = is_lopez ? "00:00:00:000:0" : "00:00:00:000";
		
		var grid = simulation.types[1];
		var frames = new List(f => f.time);
		
		if (!is_lopez) this.read_initial_value(frames, t0, grid);
		
		await this.read_val(frames, t0, grid);
		await this.read_map(frames, t0, grid);
		
		await Reader.read_by_chunk(this.files.log, "\n", (parsed, chunk, progress) => {			
			var lines = chunk.split("\n");
			
			for (var i = 0; i < lines.length; i++) {
				
				// Mensaje Y / 00:00:20:000 / sender(02) / dataout /     11.00000 para top(01)
				if (lines[i].startsWith("Mensaje Y")) this.parse_cdpp_line(frames, grid, lines[i]);
				
				else if (lines[i].startsWith("0 / L / Y")) this.parse_lopez_line(frames, grid, lines[i]);
			}
			
			this.emit("progress", { progress: progress });
		});
		
		return frames;
	}
	
	/**                              
	 * Parses the initialvalues token in the ma file. 
	 * Adds corresponding messages to the frame 0.
	 * @param {Frame[]} frames - the simulation frames
	 * @param {string} t0  - the time 0 (i.e. 00:00:000)
	 * @param {Model} model - the top model of the simulation 
	 */	
	read_initial_value(frames, t0, grid) {
		var f0 = frames.get(t0) || frames.add(new Frame(t0));
		
        for (var x = 0; x < grid.dimensions.x; x++) {
            for (var y = 0; y < grid.dimensions.y; y++) {
                for (var z = 0; z < grid.dimensions.z; z++) {
					var cell = grid.get_cell(x, y, z);
					var row = this.initial_row_values?.get(x);
					var value = row ? row.values[y] : this.initial_value;

					if (value != null) f0.add_state_message(new MessageState(cell, [value]));
				}
			}
		}
	}
	
	/**                              
	 * Parses the *.val file. Adds corresponding messages to the frame 0.
	 * @param {Frame[]} frames - the simulation frames
	 * @param {string} t0  - the time 0 (i.e. 00:00:000)
	 * @param {File} val - the *.val file
	 */	
	async read_val(frames, t0, grid) {
		if (!this.files.val) return;
		
		var f0 = frames.get(t0) || frames.add(new Frame(t0));
		var content = await Reader.read_as_text(this.files.val);		
		var lines = content.trim().split("\n").map(l => l.trim());
		
        // (0,0,0)=100 2 1
        // (0,0,1)=0.567 0 1
		for (var i = 0; i < lines.length; i++) {
			var split = lines[i].split('=').map(l => l.trim()); 
			
			if (split.length != 2) continue;
			
			var coord = split[0].substring(1, split[0].length - 1).split(",").map(s => s.trim());
			var value = split[1].split(" ").map(v => +(v.trim()));
			
			if (coord.length  == 2) coord.push("0");
			
			var cell = grid.get_cell(coord[0], coord[1], coord[2]);
			
			f0.add_state_message(new MessageState(cell, value));
		}
	}
	
	
	/**                              
	 * Parses the *.map file. Adds corresponding messages to the frame 0.
	 * @param {Frame[]} frames - the simulation frames
	 * @param {string} t0  - the time 0 (i.e. 00:00:000)
	 * @param {Model} model - the top model of the simulation 
	 * @param {File} map - the *.map file
	 */	
	async read_map(frames, t0, grid, map) {
		if (!this.files.map) return;
		
		var f0 = frames.get(t0) || frames.add(new Frame(t0));
		var content = await Reader.read_as_text(map);
		var lines = content.trim().split("\n").map(l => l.trim());		
		var i = 0;
		
		for (var x = 0; x < grid.dimensions.x; x++) {
			for (var y = 0; y < grid.dimensions.y; y++) {
				for (var z = 0; z < grid.dimensions.z; z++) {
					if (i == lines.length) throw new Error("missing initial values in map file."); 
			
					f0.add_state_message(new MessageState(grid.get_cell(x, y, z), lines[i++].trim()));
				}
			}
		}
	}
	
	/**                              
	 * Parses a CDpp line from the *.log. Adds it to the frame provided.
	 * @param {Frame[]} frames - a time frame for the simulation
	 * @param {string} line - a line from the *.log
	 */	
	parse_cdpp_line(frames, grid, line) {
		// Mensaje Y / 00:00:00:100 / flu(18,12)(645) / out /      2.00000 para flu(02)
		// Mensaje Y / 00:00:20:000 / sender(02) / dataout /     11.00000 para top(01)
		var split = line.split('/').map(l => l.trim());
		var model = split[2].replaceAll('(', ' ').replaceAll(')', '').split(' ')
		var xyz = model[1].split(",").map(c => +c);
		
		if (xyz.length == 1) return;
		
		var cell = grid.get_cell(xyz[0], xyz[1], xyz[2] ?? 0);
		var time = split[1]
		var value = split[4].split(' ')[0]
		var frame = frames.get(time) || frames.add(new Frame(time));
		
		frame.add_state_message(new MessageState(cell, [+value]));
	}
	
	/**                              
	 * Parses a Lopez line from the *.log. Adds it to the frame provided.
	 * @param {Frame[]} frames - a time frame for the simulation
	 * @param {string} line - a line from the *.log
	 */	
	parse_lopez_line(frames, grid, line) {
		// 0 / L / Y / 00:00:10:000:0 / computer_lab(15,36)(893) / out_c /    499.97440 / computer_lab(01)
		var split = line.split('/').map(l => l.trim());
		var model = split[4].replaceAll('(', ' ').replaceAll(')', '').split(' ')
		var xyz = model[1].split(",").map(c => +c);

		if (xyz.length == 1) return;
		
		var cell = grid.get_cell(xyz[0], xyz[1], xyz[2] ?? 0);
		var time = split[3]
		var port = split[5]
		var value = split[6]
		
		var frame = frames.get(time) || frames.add(new Frame(time));

		if (cell) {
			var m = frame.state_messages.find(m => m.model.id == cell.id)

			if (!m) m = frame.add_state_message(new MessageState(cell, []));
			
			var idx = cell.state.fields.get_index(port);
			
			m.value[idx] = +value;
		}
	}
}