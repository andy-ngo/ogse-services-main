package com.lifecycle.services.simulation;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lifecycle.components.io.Folder;
import com.lifecycle.components.io.UuidFolder;
import com.lifecycle.components.io.ZipFile;
import com.lifecycle.components.processes.SimulationProcess;

@Service
public class SimulationService {
	
	@Value("${app.tools.cadmium}")
	private String SIMULATOR;
	
	@Value("${app.folders.scratch}")
	private String APP_FOLDERS_SCRATCH;
	
    @Autowired
	public SimulationService() {
    	
	}
    
	public List<File> Simulate(Folder scratch, InputStream config, Long iterations, Double duration) throws Exception {
		SimulationProcess p = new SimulationProcess(SIMULATOR);
		
		return p.execute(scratch, config, iterations, duration);
	}
    

	public List<File> Simulate(Folder scratch, File config, Long iterations, Double duration) throws Exception {
		SimulationProcess p = new SimulationProcess(SIMULATOR);
		
		return p.execute(scratch, new FileInputStream(config), iterations, duration);
	}
    
	public List<File> Simulate(Folder scratch, MultipartFile config, Long iterations, Double duration) throws Exception {
		SimulationProcess p = new SimulationProcess(SIMULATOR);
		
		return p.execute(scratch, config.getInputStream(), iterations, duration);
	}
	
	public ZipFile SimulateZip(MultipartFile f_config, Long iterations, Double duration) throws Exception {
    	UuidFolder scratch = new UuidFolder(APP_FOLDERS_SCRATCH);
    	List<File> files = this.Simulate(scratch, f_config, iterations, duration);
    	ZipFile zf = new ZipFile(files);
		
		scratch.delete();
		
		return zf;
	}
}
