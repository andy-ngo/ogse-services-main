package com.lifecycle.services.connect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lifecycle.components.rest.Controller;

@RestController
public class ConnectController extends Controller{
private final ConnectService cService;
	
	@Autowired
    public ConnectController(ConnectService cService) {
        this.cService = cService;
    }
	
	@PostMapping("/demo/connect")
    public void connect(@RequestParam(value = "uuid", required = true) String uuid) throws Exception {    	
		System.out.println(uuid + " REST API connected!");
    }
	
	@GetMapping(path="/demo/connect", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView demoHtml() throws Exception {
		ModelAndView mv = new ModelAndView();
		
        mv.setViewName("lifecycle/demo");
        
        return mv;
	}
}
