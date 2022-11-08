package com.lifecycle.components.entities;


public class TemporalCoverage {
	private String start;
	private String end;
	private String scheme;
	
	public TemporalCoverage() {
		super();
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return end;
	}

	public void setEnd(String end) {
		this.end = end;
	}

	public String getScheme() {
		return scheme;
	}

	public void setScheme(String scheme) {
		this.scheme = scheme;
	}
}
