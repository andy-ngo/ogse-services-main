/**
 * Tickets
 * -> convert to websockets / remove try and catch
 * -> socket class
 * -> integrate into visualization service
 * -> document communication
 * -> create REST entry point
 * -> unique websocket for each user
 * -> show in basic UI
 */ 

package com.lifecycle.services.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import com.lifecycle.services.visualization.VisualizationService;

import java.io.*;
import java.util.Scanner;

@Controller
public class WebSocketController 
{
	@Autowired
	private SimpMessageSendingOperations sendOps;
	
	private VisualizationService vS = new VisualizationService();
	
	private Scanner scan = null;
	
	@MessageMapping("/results.ask")
	@SendTo("/client.result.done")
	public ModelResults sendMessage(@Payload final ModelResults results) throws Exception
	{
		String uuid = results.getUuid();
		
		if (uuid == null)
		{
			throw new Exception("No uuid provided");
		}
		
		File file = vS.getResults(uuid);
		vS.sendResults(file);
		
		if (scan == null) scan = new Scanner (file);
		
		int i = 0;
		
		while(scan.hasNextLine() && i < 10)
		{
			sendOps.convertAndSend("/client/results.send",scan.nextLine());
			i++;
		}
		
		if(!scan.hasNextLine()) scan.close();
		
		return results;
	}
	
	/*
	VisualizationService vs = new VisualizationService();
	
    @MessageMapping("/results.send")
    @SendTo("/topic/public")
    public ModelResults sendWSResults(@Payload final ModelResults modelResults)
    {
    	
    	String message = modelResults.getResults();
    	
    	if(message.equals(uuid)) //make a method in vs that will check the visualization folder for the given uuid id and return boolean
    	{
    		modelResults.setResults(vs.sendResults(getResults(uuid)));
    		return modelResults;
    	}
    	
    	return modelResults;
    }
    
    @OnError
    public void connectionError(Session session, Throwable throwable)
    {
    	throwable.printStackTrace();
    }

    @OnClose
    public void endConnection(Session session, CloseReason reason) throws Exception
    {
    	session.close(reason);
    }*/
        
}

