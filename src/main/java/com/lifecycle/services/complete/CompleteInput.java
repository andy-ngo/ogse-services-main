package com.lifecycle.services.complete;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompleteInput {

	UUID workflow_uuid;
	JsonNode workflow_params;
	Long simulation_iterations;
	Double simulation_duration;
	String visualization_name;
	String visualization_description;
	
	
	public CompleteInput() {
		super();
	}
	public CompleteInput(UUID workflow_uuid, JsonNode workflow_params, Long simulation_iterations,
			Double simulation_duration, String visualization_name, String visualization_description) {
		super();
		this.workflow_uuid = workflow_uuid;
		this.workflow_params = workflow_params;
		this.simulation_iterations = simulation_iterations;
		this.simulation_duration = simulation_duration;
		this.visualization_name = visualization_name;
		this.visualization_description = visualization_description;
	}
	public UUID getWorkflow_uuid() {
		return workflow_uuid;
	}
	public void setWorkflow_uuid(UUID workflow_uuid) {
		this.workflow_uuid = workflow_uuid;
	}
	public JsonNode getWorkflow_params() {
		return workflow_params;
	}
	public void setWorkflow_params(JsonNode workflow_params) {
		this.workflow_params = workflow_params;
	}
	public Long getSimulation_iterations() {
		return simulation_iterations;
	}
	public void setSimulation_iterations(Long simulation_iterations) {
		this.simulation_iterations = simulation_iterations;
	}
	public Double getSimulation_duration() {
		return simulation_duration;
	}
	public void setSimulation_duration(Double simulation_duration) {
		this.simulation_duration = simulation_duration;
	}
	public String getVisualization_name() {
		return visualization_name;
	}
	public void setVisualization_name(String visualization_name) {
		this.visualization_name = visualization_name;
	}
	public String getVisualization_description() {
		return visualization_description;
	}
	public void setVisualization_description(String visualization_description) {
		this.visualization_description = visualization_description;
	}
	
	
}
