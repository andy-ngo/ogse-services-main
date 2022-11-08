package com.lifecycle.components.entities;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

class Input {
	Map<String, String> layers;
	Map<String, String> tables;

	public Input() {
		super();
	}

	public Map<String, String> getLayers() {
		return layers;
	}

	public void setLayers(Map<String, String> layers) {
		this.layers = layers;
	}

	public Map<String, String> getTables() {
		return tables;
	}

	public void setTables(Map<String, String> tables) {
		this.tables = tables;
	}

}

@JsonIgnoreProperties(ignoreUnknown = true)
public class Workflow {
	Input input;

	public Input getInput() {
		return input;
	}

	public void setInput(Input input) {
		this.input = input;
	}
}
