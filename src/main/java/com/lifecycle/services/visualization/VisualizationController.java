package com.lifecycle.services.visualization;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

import com.lifecycle.services.websocket.WebSocketEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.lifecycle.components.entities.Entities;
import com.lifecycle.components.entities.Entity;
import com.lifecycle.components.io.ZipFile;
import com.lifecycle.components.rest.Controller;
import com.lifecycle.components.rest.FilesResponse;
import com.lifecycle.components.rest.RestResponse;
import com.lifecycle.services.websocket.ModelResults;

@RestController
public class VisualizationController extends Controller {
	
    private final VisualizationService vService;
	private Scanner scan = null;
    
    @Autowired
    public VisualizationController(VisualizationService vService) {
		this.vService = vService;
    }

	@Autowired
	private SimpMessageSendingOperations sendOps;

	@Autowired
	private WebSocketEventListener wSEventListener;
	
	@GetMapping(path="/api/visualization/{uuid}", produces=MediaType.APPLICATION_JSON_VALUE)
    public Entity getEntity(@PathVariable String uuid) throws Exception {
    	return this.vService.Read(uuid);
	}

	@GetMapping(path="/api/visualization/{uuid}/file", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<byte[]> getFile(@PathVariable String uuid) throws Exception {
    	ZipFile zf = this.vService.ReadZipFile(uuid);
    	
    	return FilesResponse.build("visualization.zip", zf.toByteArray());
	}
	
	@GetMapping(path="/api/visualization/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<byte[]> get() throws Exception {
    	File file = this.vService.List();

    	return FilesResponse.build(file);
	}
    
	@PostMapping(path="/api/visualization", consumes={ MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ObjectNode post(@RequestPart MultipartFile visualization, 
			    		   @RequestPart MultipartFile structure, 
			    		   @RequestPart MultipartFile messages, 
			    		   @RequestPart(required = false) List<MultipartFile> data,
						   @RequestParam(required = false) String name,
						   @RequestParam(required = false) String description) throws Exception {
    	return this.vService.Create(name, description, visualization, structure, messages, data).json();
    }

	@DeleteMapping(path="/api/visualization/{uuid}")
    public ResponseEntity<RestResponse> delete(@PathVariable String uuid) throws Exception {
    	this.vService.Delete(uuid);
    	
    	return this.handleSuccess();
    }
	
	@PutMapping(path="/api/visualization/{uuid}")
    public ObjectNode put(@PathVariable String uuid, 
			 		      @RequestPart(required = false) MultipartFile visualization, 
			 		      @RequestPart(required = false) MultipartFile structure, 
			 		      @RequestPart(required = false) MultipartFile messages, 
			 		      @RequestPart(required = false) List<MultipartFile> data,
						  @RequestParam(required = false) String name,
						  @RequestParam(required = false) String description,
						  @RequestParam(required = false) Date created) throws Exception {
    	return this.vService.Update(uuid, name, description, created, visualization, structure, messages, data).json();
	}

	/// HTML Endpoints
	@GetMapping(path="/api/visualization", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView postHtml() throws Exception {
		ModelAndView mv = new ModelAndView();

        mv.setViewName("lifecycle/visualization-publish");
        
        return mv;
	}
	
	@GetMapping(path="/api/visualization/list", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getList() throws Exception {
		ModelAndView mv = new ModelAndView();
		Entities<Entity> entities = this.vService.Entities();
		
        mv.addObject("entities", entities.entities);
        mv.setViewName("lifecycle/visualization-list");
        
        return mv;
	}

	@MessageMapping("/results.ask")
	@SendTo("/client/results.done")
	public ModelResults sendMessage(@Payload final ModelResults results) throws Exception
	{
		String uuid = results.getUuid();
		wSEventListener.webSocketConnectListenerMessage("Sending...");

		File resultFile = vService.getResults(uuid);
		if(scan == null) scan = new Scanner(resultFile);

		int i = 0;
		while(scan.hasNextLine() && i < 10)
		{
			sendOps.convertAndSend("/client/results.send", scan.nextLine());
			i++;
		}

		if(!scan.hasNextLine()) scan.close();
		wSEventListener.webSocketConnectListenerMessage("Sent");

		return results;
	}

	@PostMapping(path="/results")
	public void connect(@RequestParam(value="uuid",required = true) String uuid) throws Exception
	{
		System.out.println(uuid + "REST API connected!");
		wSEventListener.webSocketConnectListenerMessage(uuid + "REST API connected!");
	}

	@GetMapping(path="/results",produces=MediaType.TEXT_HTML_VALUE)
	public ModelAndView resultsHtml() throws Exception
	{
		ModelAndView mv = new ModelAndView();

		mv.setViewName("lifecycle/results");

		return mv;
	}
}