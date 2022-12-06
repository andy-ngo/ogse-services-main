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

import javax.websocket.*;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.lifecycle.services.visualization.VisualizationService;

@Controller
public class WebSocketController 
{
	VisualizationService vs = new VisualizationService();
	
    @MessageMapping("/results.send")
    @SendTo("/topic/public")
    public ModelResults sendWSResults(@Payload final ModelResults modelResults)
    {
    	/*
    	String message = modelResults.getResults();
    	
    	if(message.equals(uuid)) //make a method in vs that will check the visualization folder for the given uuid id and return boolean
    	{
    		modelResults.setResults(vs.sendResults(getResults(uuid)));
    		return modelResults;
    	}
    	*/
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
    }
        
}
