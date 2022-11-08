package com.lifecycle.components.entities;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.lifecycle.components.serialization.repeatable.Deserializer;

public class SpatialCoverage {
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> placename;

	@JsonDeserialize(using = Deserializer.class, contentAs = Extent.class)
	private List<Extent> extent;

	public List<String> getPlacename() {
		return placename;
	}

	public void setPlacename(List<String> placename) {
		this.placename = placename;
	}

	public List<Extent> getExtent() {
		return extent;
	}

	public void setExtent(List<Extent> extent) {
		this.extent = extent;
	}

}
