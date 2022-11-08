package com.lifecycle.components.entities;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.lifecycle.components.serialization.repeatable.Deserializer;

public class Message {
	private long identifier;

	@JsonDeserialize(using = Deserializer.class, contentAs = Field.class)
	private List<Field> field;

	public long getIdentifier() {
		return identifier;
	}

	public void setIdentifier(long identifier) {
		this.identifier = identifier;
	}

	public List<Field> getField() {
		return field;
	}

	public void setField(List<Field> field) {
		this.field = field;
	}

}
