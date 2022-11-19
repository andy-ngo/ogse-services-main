package com.lifecycle.services.websocket;

import java.io.File;
import java.util.HashMap;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.lifecycle.components.entities.Entities;
import com.lifecycle.components.entities.Entity;
import com.lifecycle.components.io.Folder;
import com.lifecycle.components.io.UuidFolder;
import com.lifecycle.components.io.ZipFile;

@ServerEndpoint(value = "/chat/{username}")
public class WebSocketService {
	private Session session;

    @Value("${app.visualizations}")
	private String APP_VISUALIZATIONS;
	
    //call from visualization folder to call specific uuid
    //grab uuid messages.log file and send it to client

    //run the web socket and then make it run frontend
    //do folder.get(messages.log) to get a file

    //method to start connection
    public void startConnection(Session session)
    {
        this.session = session;
        getResults(null);
    }

    //method to get the file
    public File getResults(String uuid)
    {
        return new File (APP_VISUALIZATIONS);
    }

    //method stream to frontend
    public void sendResults(File takefile)
    {
        
    }

    /* 
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
    */
    
}
