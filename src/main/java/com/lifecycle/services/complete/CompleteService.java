package com.lifecycle.services.complete;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.lifecycle.components.io.Folder;
import com.lifecycle.components.io.UuidFolder;
import com.lifecycle.services.simulation.SimulationService;
import com.lifecycle.services.visualization.VisualizationService;

@Service
public class CompleteService {

	@Value("${app.folders.scratch}")
	private String APP_FOLDERS_SCRATCH;

//    private final WorkflowService wService;
    private final SimulationService sService;
    private final VisualizationService vService;
    
    @Autowired
	public CompleteService(SimulationService sService, VisualizationService vService) {
//        this.wService = wService;
        this.sService = sService;
        this.vService = vService;
	}
	
	public ObjectNode Execute(String s_params, MultipartFile visualization) throws Exception {	
		UuidFolder scratch = new UuidFolder(APP_FOLDERS_SCRATCH);
		
		try {
			Folder wFolder = scratch.makeFolder("workflow");
			Folder sFolder = scratch.makeFolder("simulation");
			
			ObjectMapper om = new ObjectMapper();
			CompleteInput p = om.readValue(s_params, CompleteInput.class);
			
//			this.wService.Execute(wFolder, p.workflow_uuid.toString(), p.workflow_params);
			
			this.sService.Simulate(sFolder, wFolder.file("output", "auto_coupled.json"), p.simulation_iterations, p.simulation_duration);

			File structure = sFolder.file("output", "structure.json");
			File messages = sFolder.file("output", "messages.log");
			List<File> output = wFolder.files("output");
			
			return this.vService.Create(p.visualization_name, p.visualization_description, visualization, structure, messages, output).json();
		}
		catch (Exception ex) {
			throw ex;
		}
		finally {
			scratch.delete();
		}
	}
}
