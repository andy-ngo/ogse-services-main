package com.lifecycle.services.connect;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.List;

import java.net.URI;
import java.net.URISyntaxException;
import javax.websocket.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lifecycle.components.io.Folder;

@Service
public class ConnectService {
	
	@Value("${app.folders.visualizations}")
	private String APP_FOLDERS_VISUALIZATIONS;
	
	@Autowired
	public ConnectService() {
		
	}
	
	//websocket connection methods
	public void connectWebsocket(String uuid) {
		try {
			System.out.println("connecting...");
			final WebSocketClientEndpoint clientEndPoint = new WebSocketClientEndpoint(new URI("wss://localhost:8080/demo/connect/" + uuid));
			System.out.println("connected");
			clientEndPoint.addMessageHandler(new WebSocketClientEndpoint.MessageHandler() {
                public void handleMessage(String message) {
                    System.out.println(message);
                }
            });
			System.out.println("sending message...");
			clientEndPoint.sendMessage("test");
			System.out.println("test sent");
		}
		catch (URISyntaxException e) {
			e.printStackTrace();
		}
		
	}
	
	//method to get the file
    public File getResults(String uuid) throws Exception
    {
        Folder folder = new Folder (APP_FOLDERS_VISUALIZATIONS,uuid);
        File resultFile = null;
		resultFile = folder.file("messages.log");
        return resultFile;
    }
    
    //method to stream results 
    public void sendResults(Session session, String uuid) throws Exception
    {
    	Socket socket = new Socket("localhost", 8080); //switch to websockets
    	OutputStream output = socket.getOutputStream();
    	File resultFile = getResults(uuid);
		PrintWriter out = new PrintWriter(output);
	    BufferedReader data = new BufferedReader(new FileReader(resultFile));
	    String line;

	    while ((line = data.readLine()) != null) {
	       	System.out.println(line);
	       	out.println(line);
	       	out.flush();
	    }
	    data.close();
	    socket.close();
		session.close();
    }
}
