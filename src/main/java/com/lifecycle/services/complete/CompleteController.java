package com.lifecycle.services.complete;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.lifecycle.components.rest.Controller;

@RestController
public class CompleteController extends Controller {
	
    private final CompleteService cService;
	
	@Value("${app.folders.scratch}")
	private String APP_FOLDERS_SCRATCH;
    
    @Autowired
    public CompleteController(CompleteService cService) {
    	this.cService = cService;
    }
    
	@PostMapping(path="/api/complete/execute", consumes={ MediaType.MULTIPART_FORM_DATA_VALUE })
    public ObjectNode post(@RequestPart("params") String s_params,
				  		   @RequestPart("visualization_config") MultipartFile visualization) throws Exception {
		return this.cService.Execute(s_params, visualization);
    }
}