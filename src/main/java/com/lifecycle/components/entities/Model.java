package com.lifecycle.components.entities;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.lifecycle.components.serialization.repeatable.Deserializer;
import com.lifecycle.components.serialization.repeatable.Serializer;

@JsonPropertyOrder({ "identifier", "title", "alternative", "creator", "contributor", "type", "language", "description",
		"subject", "spatial_coverage", "temporal_coverage", "license", "created", "modified", "time", "behavior",
		"state", "subcomponent", "coupling", "port", "message" })
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Model {

	private String identifier;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> title;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> alternative;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> creator;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> contributor;

	private String type;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> language;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> description;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> subject;

	@JsonProperty("spatial coverage")
	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = SpatialCoverage.class)
	private List<SpatialCoverage> spatial_coverage;

	@JsonProperty("temporal coverage")
	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = TemporalCoverage.class)
	private List<TemporalCoverage> temporal_coverage;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> license;

	private Date created;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> modified;

	private String time;

	@JsonSerialize(using = Serializer.class)
	@JsonDeserialize(using = Deserializer.class, contentAs = String.class)
	private List<String> behavior;

	private State state;

	@JsonDeserialize(using = Deserializer.class, contentAs = Subcomponent.class)
	private List<Subcomponent> subcomponent;

	@JsonDeserialize(using = Deserializer.class, contentAs = Coupling.class)
	private List<Coupling> coupling;

	@JsonDeserialize(using = Deserializer.class, contentAs = Port.class)
	private List<Port> port;

	@JsonDeserialize(using = Deserializer.class, contentAs = Message.class)
	private List<Message> message;

	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	public List<String> getTitle() {
		return title;
	}

	public void setTitle(List<String> title) {
		this.title = title;
	}

	public List<String> getAlternative() {
		return alternative;
	}

	public void setAlternative(List<String> alternative) {
		this.alternative = alternative;
	}

	public List<String> getCreator() {
		return creator;
	}

	public void setCreator(List<String> creator) {
		this.creator = creator;
	}

	public List<String> getContributor() {
		return contributor;
	}

	public void setContributor(List<String> contributor) {
		this.contributor = contributor;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<String> getLanguage() {
		return language;
	}

	public void setLanguage(List<String> language) {
		this.language = language;
	}

	public List<String> getDescription() {
		return description;
	}

	public void setDescription(List<String> description) {
		this.description = description;
	}

	public List<String> getSubject() {
		return subject;
	}

	public void setSubject(List<String> subject) {
		this.subject = subject;
	}

	public List<SpatialCoverage> getSpatial_coverage() {
		return spatial_coverage;
	}

	public void setSpatial_coverage(List<SpatialCoverage> spatial_coverage) {
		this.spatial_coverage = spatial_coverage;
	}

	public List<TemporalCoverage> getTemporal_coverage() {
		return temporal_coverage;
	}

	public void setTemporal_coverage(List<TemporalCoverage> temporal_coverage) {
		this.temporal_coverage = temporal_coverage;
	}

	public List<String> getLicense() {
		return license;
	}

	public void setLicense(List<String> license) {
		this.license = license;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public List<String> getModified() {
		return modified;
	}

	public void setModified(List<String> modified) {
		this.modified = modified;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public List<String> getBehavior() {
		return behavior;
	}

	public void setBehavior(List<String> behavior) {
		this.behavior = behavior;
	}

	public State getState() {
		return state;
	}

	public void setState(State state) {
		this.state = state;
	}

	public List<Subcomponent> getSubcomponent() {
		return subcomponent;
	}

	public void setSubcomponent(List<Subcomponent> subcomponent) {
		this.subcomponent = subcomponent;
	}

	public List<Coupling> getCoupling() {
		return coupling;
	}

	public void setCoupling(List<Coupling> coupling) {
		this.coupling = coupling;
	}

	public List<Port> getPort() {
		return port;
	}

	public void setPort(List<Port> port) {
		this.port = port;
	}

	public List<Message> getMessage() {
		return message;
	}

	public void setMessage(List<Message> message) {
		this.message = message;
	}

	public Model() {
		super();
	}

}
