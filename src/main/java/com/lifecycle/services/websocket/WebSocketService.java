package com.lifecycle.services.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import com.lifecycle.components.entities.Message;
import com.lifecycle.components.io.ZipFile;
import com.lifecycle.components.rest.Controller;
import com.lifecycle.components.rest.FilesResponse;
import com.lifecycle.components.rest.RestResponse;

import java.io.IOException;
import java.util.HashMap;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/chat/{username}")
public class WebSocketService {
	private Session session;
    private static HashMap<String,String> simulations = new HashMap<>();
	
	@OnOpen
	public void onOpen(Session session, @PathParam("file_name") String name) throws IOException {
		// Get session and WebSocket connection
        this.session = session;
        simulations.put(session.getId(),name);

        Message message = new Message();
        message.setField(name);
        message.setContent("Simulated");
        broadcast(message);
	}
	
	@OnMessage
    public void onMessage(Session session, Message message) throws IOException {
        // Handle new messages
        message.setFrom(simulations.get(session.getId()));
        broadcast(message);
    }

    @OnClose
    public void onClose(Session session) throws IOException {
        // WebSocket connection closes
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        // Do error handling here
    }

    private static void broadcast(Message message) throws IOException,EncodeException{
        // Display the simulation data
    }

    
}
