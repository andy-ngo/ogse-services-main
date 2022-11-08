package com.lifecycle.components.entities;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Field {
	private String name;
	private String description;
	private String type;
	private String uom;
	private String scalar;
	private Long decimals;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	}

	public String getScalar() {
		return scalar;
	}

	public void setScalar(String scalar) {
		this.scalar = scalar;
	}

	public Long getDecimals() {
		return decimals;
	}

	public void setDecimals(Long decimals) {
		this.decimals = decimals;
	}

}
