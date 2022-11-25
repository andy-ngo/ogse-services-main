package com.lifecycle.services.websocket;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.io.IOException;
import java.io.PrintWriter;
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

    @Value("${app.folders.visualizations}")
	private String APP_FOLDERS_VISUALIZATIONS;

    @Value("${app.visualizations}")
	private String APP_VISUALIZATIONS;
	
    //call from visualization folder to call specific uuid
    //grab uuid messages.log file and send it to client

    //run the web socket and then make it run front end
    //do folder.get(messages.log) to get a file

    //method to start connection
    public void startConnection(Session session)
    {
        this.session = session;
    }

    //method to get the file
    public File getResults(String uuid) throws Exception
    {
        Folder folder;
        File resultFile = null;
		try {
			folder = new Folder (APP_FOLDERS_VISUALIZATIONS,uuid);
			resultFile = folder.file("messages.log");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
        return resultFile;
    }

    //method stream to front end
    public void sendResults(Session session, File file) //instead of File file replace String uuid?
    {
    	try {
    		File resultFile = getResults(uuid);
			PrintWriter out = new PrintWriter(websocket output, true);
	        BufferedReader data = new BufferedReader(new FileReader(resultFile));
	        String line;

	        while ((line = data.readLine()) != null) {
	        	System.out.println(line);
	        	out.println(line);
	        	out.flush();
	        }
	        data.close();
	    } catch (FileNotFoundException ex) {
	        ex.printStackTrace();
	    } catch (IOException ex) {
	        ex.printStackTrace();
	    }
		websocket.close(); //session.close()?
    }

    /* 
    public void connectionError(Session session, Throwable throwable)
    {

    }

    public void endConnection(Session session)
    {

    }
    */    
}
