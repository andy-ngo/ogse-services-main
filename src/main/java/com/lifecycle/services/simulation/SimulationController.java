package com.lifecycle.services.simulation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.lifecycle.components.io.ZipFile;
import com.lifecycle.components.rest.Controller;
import com.lifecycle.components.rest.FilesResponse;

@RestController
public class SimulationController extends Controller {

	@Value("${app.folders.scratch}")
	private String APP_FOLDERS_SCRATCH;
	
    private final SimulationService sService;
    
    @Autowired
    public SimulationController(SimulationService sService) {
        this.sService = sService;
    }
    
    @PostMapping("/api/simulate")
    public ResponseEntity<byte[]> simulate(@RequestPart("config") MultipartFile f_config,
    								   	   @RequestParam(value = "iterations", required = false) Long n_iterations,
    								   	   @RequestParam(value = "duration", required = false) Double n_duration) 
    								   			   throws Exception {    	

    	ZipFile zf = this.sService.SimulateZip(f_config, n_iterations, n_duration);
		
    	return FilesResponse.build("simulation_results.zip", zf.toByteArray());
    }
    
	@GetMapping(path="/api/simulate", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView simulateHtml() throws Exception {
		ModelAndView mv = new ModelAndView();
		
        mv.setViewName("lifecycle/simulate");
        
        return mv;
	}
}