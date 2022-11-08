package com.lifecycle.components.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Extent {
	private String reference;
	
	@JsonProperty("x min")
	private double x_min;
	
	@JsonProperty("x max")
	private double x_max;
	
	@JsonProperty("y min")
	private double y_min;
	
	@JsonProperty("y max")
	private double y_max;
	
	public Extent() {
		super();
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	public double getX_min() {
		return x_min;
	}

	public void setX_min(double x_min) {
		this.x_min = x_min;
	}

	public double getX_max() {
		return x_max;
	}

	public void setX_max(double x_max) {
		this.x_max = x_max;
	}

	public double getY_min() {
		return y_min;
	}

	public void setY_min(double y_min) {
		this.y_min = y_min;
	}

	public double getY_max() {
		return y_max;
	}

	public void setY_max(double y_max) {
		this.y_max = y_max;
	}
}
