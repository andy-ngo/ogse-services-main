package com.lifecycle.services.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import com.lifecycle.components.rest.Controller;

import java.util.Scanner;
import java.io.*;

@RestController
public class DemoController extends Controller{
    private final DemoService dService;
	
	@Autowired
    public DemoController(DemoService dService) {
        this.dService = dService;
    }

    @MessageMapping("/results.ask")
    @SendTo("/client/results.done")
    public BasicMessage sendMessage(@Payload final BasicMessage message) throws Exception {
        String uuid = message.getUuid();

        if (uuid == null) throw new Exception("No uuid provided.");
        System.out.println("Sending...");
        dService.sendResults(uuid);
        System.out.println("Sent");

        return message;
    }

	@PostMapping("/demo")
    public void connect(@RequestParam(value = "uuid", required = true) String uuid) throws Exception {    	
		System.out.println(uuid + " REST API connected!");
    }
	
	@GetMapping(path="/demo", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView demoHtml() throws Exception {
		ModelAndView mv = new ModelAndView();
		
        mv.setViewName("lifecycle/demo");
        
        return mv;
	}
}
